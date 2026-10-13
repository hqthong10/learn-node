# 03 — Dựng server với Apollo Server

[← Mục lục](README.md) · Trước: [02 — Cú pháp query](02-query-syntax.md) · Tiếp: [04 — Client](04-client.md)

> Dùng `@apollo/server` (Apollo Server 5). Gói cũ `apollo-server-express` (v3) và `express-graphql` đã ngừng hỗ trợ — code mới đừng dùng.

## 1. Server nhanh nhất (standalone)

```bash
npm install @apollo/server graphql
```

```js
// server.js  (package.json có "type": "module")
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
  }
`;

const books = [
  { id: '1', title: 'Book 1', author: 'Author 1' },
  { id: '2', title: 'Book 2', author: 'Author 2' },
];

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find((b) => b.id === id),
  },
  Mutation: {
    addBook: (_, { title, author }) => {
      const book = { id: String(books.length + 1), title, author };
      books.push(book);
      return book;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 ${url}`);
```

```bash
node server.js
# mở http://localhost:4000 → Apollo Sandbox để thử query
```

---

## 2. Gắn vào Express + MongoDB (cấu trúc thực tế)

```bash
npm install @apollo/server @as-integrations/express4 graphql express cors mongoose dotenv
# Express 5: dùng @as-integrations/express5
```

```
src/
├── index.js            khởi động server
├── db.js               kết nối MongoDB
├── context.js          tạo context cho mỗi request
├── models/
│   └── Book.js
└── graphql/
    ├── typeDefs.js
    └── resolvers.js
```

```js
// src/db.js
import mongoose from 'mongoose';

export async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);   // không hard-code chuỗi kết nối
  console.log('MongoDB connected');
}
```

```js
// src/models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true },
);

export const Book = mongoose.model('Book', bookSchema);
```

```js
// src/graphql/typeDefs.js
export const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
    createdAt: String!
  }

  input CreateBookInput {
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    createBook(input: CreateBookInput!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;
```

```js
// src/graphql/resolvers.js
import { Book } from '../models/Book.js';

export const resolvers = {
  Query: {
    books: () => Book.find().sort({ createdAt: -1 }),
    book: (_, { id }) => Book.findById(id),
  },
  Mutation: {
    createBook: (_, { input }) => Book.create(input),
    deleteBook: async (_, { id }) => {
      const res = await Book.deleteOne({ _id: id });
      return res.deletedCount === 1;
    },
  },
  Book: {
    // Mongoose có getter `id` (= _id dạng string) nên không cần resolver cho id
    createdAt: (book) => book.createdAt.toISOString(),
  },
};
```

```js
// src/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { connectDB } from './db.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { buildContext } from './context.js';

await connectDB();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use('/graphql', cors(), express.json(), expressMiddleware(server, { context: buildContext }));

app.listen(4000, () => console.log('🚀 http://localhost:4000/graphql'));
```

```js
// src/context.js — chạy cho MỖI request
export async function buildContext({ req }) {
  return {
    user: null,  // đọc token từ req.headers.authorization (xem 05-advanced)
  };
}
```

> `helmet()` với CSP mặc định sẽ chặn trang Apollo Sandbox ở `/graphql`. Ở môi trường dev, tắt CSP cho route này hoặc chỉ bật helmet ở production.

---

## 3. Schema-first vs code-first

| | Schema-first (SDL) | Code-first |
|---|---|---|
| Cách viết | Viết SDL, rồi viết resolver khớp tên | Viết schema bằng code JS/TS, SDL tự sinh |
| Ví dụ | Apollo `typeDefs` + `resolvers` | `GraphQLObjectType`, Pothos, TypeGraphQL, Nexus |
| Ưu | Dễ đọc, dễ trao đổi với frontend | Type-safe, không lệch giữa schema và resolver |
| Nhược | Dễ lệch tên/kiểu nếu không có codegen | Dài dòng hơn (bản thuần `graphql-js`) |

Code-first thuần `graphql-js` (như [schema/schema.js](schema/schema.js)):

```js
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
  },
});

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      books: { type: new GraphQLList(BookType), resolve: () => Book.find() },
    },
  }),
});
```

> TypeScript: dùng **GraphQL Code Generator** để sinh type cho resolver từ SDL — được cả hai cái lợi.

---

## 4. Tách schema theo module

Dự án lớn: mỗi domain một cặp `typeDefs` + `resolvers`, dùng `extend type` rồi gộp lại:

```js
// user/typeDefs.js
export const userTypeDefs = `#graphql
  type User { id: ID! name: String! }
  extend type Query { me: User }
`;

// index
const server = new ApolloServer({
  typeDefs: [baseTypeDefs, userTypeDefs, bookTypeDefs],   // base có: type Query { _empty: String }
  resolvers: [userResolvers, bookResolvers],
});
```

Hoặc dùng `@graphql-tools/merge` / `@graphql-tools/load-files` để tự gộp theo thư mục.

---

## 5. Resolver: nên & không nên

| Nên | Không nên |
|---|---|
| Resolver mỏng, gọi xuống service/business layer | Viết toàn bộ logic nghiệp vụ trong resolver |
| Trả về Promise trực tiếp (`return Book.find()`) | `new Promise` bọc thừa |
| Lấy user, DB, loader từ `context` | Import biến toàn cục chứa thông tin request |
| Ném `GraphQLError` có `extensions.code` | Ném chuỗi hoặc trả `{ error: '...' }` |
| Dùng DataLoader cho field quan hệ | Query DB trong vòng lặp (N+1) |
