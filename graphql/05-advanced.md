# 05 — Nâng cao: auth, lỗi, phân trang, N+1, subscription

[← Mục lục](README.md) · Trước: [04 — Client](04-client.md) · Tiếp: [06 — Production](06-production.md)

## 1. Authentication

Xác thực **một lần trong `context`**, resolver chỉ việc đọc `context.user`.

```js
import jwt from 'jsonwebtoken';

export async function buildContext({ req }) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user = null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(payload.sub);
    } catch {
      // token sai/hết hạn → coi như chưa đăng nhập; resolver cần đăng nhập sẽ báo lỗi
    }
  }

  return { user };
}
```

Đăng nhập là một mutation bình thường:

```graphql
type AuthPayload { token: String!, user: User! }
type Mutation { login(email: String!, password: String!): AuthPayload! }
```

---

## 2. Authorization (phân quyền)

```js
import { GraphQLError } from 'graphql';

function requireUser(ctx) {
  if (!ctx.user) {
    throw new GraphQLError('Chưa đăng nhập', { extensions: { code: 'UNAUTHENTICATED' } });
  }
  return ctx.user;
}

function requireRole(ctx, role) {
  const user = requireUser(ctx);
  if (user.role !== role) {
    throw new GraphQLError('Không có quyền', { extensions: { code: 'FORBIDDEN' } });
  }
  return user;
}

const resolvers = {
  Query: {
    me: (_, __, ctx) => requireUser(ctx),
    users: (_, __, ctx) => { requireRole(ctx, 'ADMIN'); return User.find(); },
  },
  User: {
    // phân quyền theo từng field
    email: (user, _, ctx) => (ctx.user?.id === user.id || ctx.user?.role === 'ADMIN' ? user.email : null),
  },
};
```

Các cách tổ chức:

| Cách | Ghi chú |
|---|---|
| Kiểm tra trong resolver (như trên) | Đơn giản, rõ ràng |
| Kiểm tra ở service/business layer | **Khuyên dùng** — REST, GraphQL, job đều dùng chung một luật |
| Directive `@auth(requires: ADMIN)` | Khai báo trong schema, cần `@graphql-tools/utils` `mapSchema` |
| `graphql-shield` | Gom luật phân quyền thành một "permission layer" |

---

## 3. Xử lý lỗi

Ném `GraphQLError` với `extensions.code` để client phân loại:

```js
throw new GraphQLError('Không tìm thấy sách', {
  extensions: { code: 'NOT_FOUND', bookId: id },
});
```

| Code (Apollo) | Khi nào |
|---|---|
| `GRAPHQL_PARSE_FAILED` | Sai cú pháp query |
| `GRAPHQL_VALIDATION_FAILED` | Query không khớp schema |
| `BAD_USER_INPUT` | Tham số không hợp lệ |
| `UNAUTHENTICATED` | Chưa đăng nhập |
| `FORBIDDEN` | Không có quyền |
| `INTERNAL_SERVER_ERROR` | Lỗi không mong muốn (mặc định) |

Ẩn chi tiết lỗi nội bộ ở production:

```js
new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formatted, error) => {
    if (formatted.extensions?.code === 'INTERNAL_SERVER_ERROR') {
      console.error(error);                         // log đầy đủ ở server
      return { message: 'Lỗi hệ thống', extensions: { code: 'INTERNAL_SERVER_ERROR' } };
    }
    return formatted;
  },
});
```

**Lỗi nghiệp vụ trong mutation** (email đã tồn tại, hết hàng...) — nhiều team trả về trong kết quả thay vì `errors`, để client có kiểu rõ ràng:

```graphql
type CreateUserPayload {
  user: User
  errors: [UserError!]!
}
type UserError { field: String, message: String! }
```

---

## 4. Phân trang

### Offset (đơn giản)

```graphql
type Query { books(limit: Int = 20, offset: Int = 0): [Book!]! }
```

Dễ làm, nhưng chậm với offset lớn và bị lệch khi dữ liệu thêm/xóa trong lúc lật trang.

### Cursor (khuyên dùng — chuẩn Relay connection)

```graphql
type BookConnection {
  edges: [BookEdge!]!
  pageInfo: PageInfo!
}
type BookEdge { node: Book!, cursor: String! }
type PageInfo { hasNextPage: Boolean!, endCursor: String }

type Query { books(first: Int = 20, after: String): BookConnection! }
```

```js
books: async (_, { first, after }) => {
  const filter = after ? { _id: { $lt: decodeCursor(after) } } : {};
  const docs = await Book.find(filter).sort({ _id: -1 }).limit(first + 1);   // lấy dư 1 để biết còn trang sau

  const hasNextPage = docs.length > first;
  const nodes = docs.slice(0, first);
  const edges = nodes.map((node) => ({ node, cursor: encodeCursor(node._id) }));

  return { edges, pageInfo: { hasNextPage, endCursor: edges.at(-1)?.cursor ?? null } };
},
```

```js
const encodeCursor = (id) => Buffer.from(String(id)).toString('base64');
const decodeCursor = (c) => Buffer.from(c, 'base64').toString();
```

---

## 5. N+1 query & DataLoader

```graphql
{ posts { title author { name } } }     # 100 bài viết
```

```js
Post: { author: (post) => User.findById(post.authorId) }
```

→ 1 query lấy posts + **100 query** lấy author = N+1. DataLoader gom các lần gọi trong cùng một tick thành **một** query:

```bash
npm install dataloader
```

```js
import DataLoader from 'dataloader';

function createLoaders() {
  return {
    userById: new DataLoader(async (ids) => {
      const users = await User.find({ _id: { $in: ids } });
      const map = new Map(users.map((u) => [String(u._id), u]));
      return ids.map((id) => map.get(String(id)) ?? null);   // ⚠️ phải đúng thứ tự & độ dài như ids
    }),
  };
}

// context: tạo loader MỚI cho MỖI request (tránh lộ cache giữa các user)
export async function buildContext({ req }) {
  return { user: await getUser(req), loaders: createLoaders() };
}

// resolver
Post: { author: (post, _, ctx) => ctx.loaders.userById.load(post.authorId) }
```

Kết quả: 1 query posts + 1 query users. DataLoader còn **cache theo request**: cùng một id gọi nhiều lần chỉ query một lần.

---

## 6. Subscription (realtime)

Dùng WebSocket qua giao thức `graphql-ws`.

```bash
npm install graphql-ws ws @graphql-tools/schema graphql-subscriptions
```

```js
import { createServer } from 'node:http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';     // graphql-ws v5: 'graphql-ws/lib/use/ws'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express4';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const typeDefs = `#graphql
  type Book { id: ID!, title: String! }
  type Query { books: [Book!]! }
  type Mutation { addBook(title: String!): Book! }
  type Subscription { bookAdded: Book! }
`;

const resolvers = {
  Query: { books: () => [] },
  Mutation: {
    addBook: async (_, { title }) => {
      const book = { id: Date.now().toString(), title };
      await pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },
  },
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED']) },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
const wsCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    { async serverWillStart() { return { async drainServer() { await wsCleanup.dispose(); } }; } },
  ],
});
await server.start();

app.use('/graphql', express.json(), expressMiddleware(server));
httpServer.listen(4000);
```

Client:

```graphql
subscription { bookAdded { id title } }
```

> - `PubSub` trong bộ nhớ chỉ chạy trên **một** instance. Nhiều instance → dùng Redis (`graphql-redis-subscriptions`) hoặc Kafka.
> - `graphql-subscriptions` v3 đổi `asyncIterator` thành `asyncIterableIterator`.
> - Nhu cầu đơn giản (thông báo, cập nhật số liệu) có thể dùng polling (`pollInterval`) hoặc SSE thay vì subscription.

---

## 7. Custom scalar

```js
import { GraphQLScalarType, Kind } from 'graphql';

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize: (value) => new Date(value).toISOString(),          // server → client
  parseValue: (value) => new Date(value),                       // biến từ client → server
  parseLiteral: (ast) => (ast.kind === Kind.STRING ? new Date(ast.value) : null),  // giá trị viết thẳng trong query
});

const resolvers = { DateTime, Query: { ... } };
```

Có sẵn nhiều scalar thông dụng (`DateTime`, `EmailAddress`, `JSON`...) trong gói `graphql-scalars`.
