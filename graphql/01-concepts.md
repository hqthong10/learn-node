# 01 — Khái niệm cốt lõi

[← Mục lục](README.md) · Tiếp: [02 — Cú pháp query](02-query-syntax.md)

## 1. GraphQL là gì

**GraphQL** là ngôn ngữ truy vấn cho API kèm một runtime để thực thi truy vấn đó. Facebook phát triển năm 2012, công khai năm 2015.

Thay vì nhiều endpoint như REST, GraphQL có **một endpoint duy nhất**; client mô tả chính xác dữ liệu cần, server trả về đúng như vậy.

---

## 2. So với REST

Màn hình cần: tên user + tiêu đề 3 bài viết + số follower.

```
REST:                                   GraphQL:
GET /users/1           → cả object      POST /graphql
GET /users/1/posts     → cả list        query {
GET /users/1/followers → cả list          user(id: 1) {
                                            name
3 request, thừa nhiều field                 posts(first: 3) { title }
                                            followerCount
                                          }
                                        }
                                        1 request, đúng field cần
```

| | REST | GraphQL |
|---|---|---|
| Endpoint | Nhiều (`/users`, `/posts`) | Một (`/graphql`) |
| Dữ liệu trả về | Server quyết định | Client chọn field |
| Over/under-fetching | Thường gặp | Không |
| Kiểu dữ liệu | Tùy (OpenAPI nếu có) | Bắt buộc có schema, tự sinh tài liệu |
| Versioning | `/v1`, `/v2` | Thêm field mới, đánh dấu `@deprecated` field cũ |
| HTTP cache | Dễ (GET + URL) | Khó hơn (thường POST) |
| Upload file, tải file | Đơn giản | Phức tạp, thường để REST lo |
| Độ phức tạp server | Thấp | Cao hơn (N+1, bảo mật query) |

**Dùng GraphQL khi:** nhiều loại client (web, mobile) cần dữ liệu khác nhau, dữ liệu dạng đồ thị/quan hệ, frontend thay đổi nhanh.
**REST vẫn hợp hơn khi:** API đơn giản CRUD, public API cần HTTP cache, upload/stream file.

---

## 3. Schema & Type system

Schema là **hợp đồng** giữa client và server, viết bằng **SDL** (Schema Definition Language):

```graphql
type User {
  id: ID!
  name: String!
  email: String
  role: Role!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}

enum Role {
  ADMIN
  USER
}

input CreatePostInput {
  title: String!
  content: String
}

type Query {
  me: User
  user(id: ID!): User
  posts(first: Int = 10): [Post!]!
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
}

type Subscription {
  postCreated: Post!
}
```

| Loại | Ví dụ | Ghi chú |
|---|---|---|
| Scalar | `ID`, `String`, `Int`, `Float`, `Boolean` | Giá trị đơn |
| Object | `type User { ... }` | Có các field |
| Input | `input CreatePostInput` | Chỉ dùng làm tham số, không có field quan hệ |
| Enum | `enum Role` | Tập giá trị cố định |
| Interface | `interface Node { id: ID! }` | Các type cùng có field chung |
| Union | `union SearchResult = User \| Post` | Một trong nhiều type |
| Custom scalar | `scalar DateTime` | Tự định nghĩa cách parse/serialize |

**Null:** mặc định mọi field **có thể null**. Thêm `!` để bắt buộc.

| Khai báo | `null` | `[]` | `[null]` |
|---|---|---|---|
| `[Post]` | ✅ | ✅ | ✅ |
| `[Post]!` | ❌ | ✅ | ✅ |
| `[Post!]!` | ❌ | ✅ | ❌ |

---

## 4. Ba loại thao tác

| Thao tác | Ý nghĩa | Tương đương REST |
|---|---|---|
| **Query** | Đọc dữ liệu, các field chạy song song | `GET` |
| **Mutation** | Ghi dữ liệu, các field chạy **tuần tự** | `POST` / `PUT` / `DELETE` |
| **Subscription** | Nhận dữ liệu realtime (thường qua WebSocket) | WebSocket / SSE |

---

## 5. Resolver

Mỗi field trong schema có một **resolver** — hàm trả về giá trị của field đó.

```js
const resolvers = {
  Query: {
    user: (parent, args, context, info) => context.db.users.findById(args.id),
  },
  User: {
    // field quan hệ: parent là object User vừa lấy ở trên
    posts: (parent, args, context) => context.db.posts.find({ authorId: parent.id }),
  },
};
```

| Tham số | Ý nghĩa |
|---|---|
| `parent` | Kết quả của resolver cấp cha (với `Query` thường là `undefined`) |
| `args` | Tham số truyền vào field, vd `{ id: "1" }` |
| `context` | Dữ liệu dùng chung cho cả request: user đăng nhập, DB, DataLoader |
| `info` | Thông tin về query (AST, field được chọn) — ít dùng |

Field không khai báo resolver → GraphQL dùng **resolver mặc định**: trả về `parent[tênField]`. Vì vậy `User.name` không cần viết resolver.

---

## 6. Cách một request được thực thi

```
POST /graphql { query, variables }
        │
        ▼
1. Parse      chuỗi query → AST          (sai cú pháp → lỗi)
2. Validate   AST so với schema           (field không tồn tại, sai kiểu → lỗi)
3. Execute    gọi resolver từ ngoài vào trong
                 Query.user  →  User.name, User.posts  →  Post.title ...
        │
        ▼
{ "data": {...}, "errors": [...] }
```

Response luôn có dạng:

```json
{
  "data": { "user": { "name": "Thông", "posts": null } },
  "errors": [
    { "message": "Không có quyền", "path": ["user", "posts"], "extensions": { "code": "FORBIDDEN" } }
  ]
}
```

- Có thể vừa có `data` vừa có `errors` (**partial data**): field lỗi thành `null`, phần còn lại vẫn trả về.
- Field lỗi mà khai báo `!` (non-null) → `null` lan lên field cha gần nhất cho phép null.

---

## 7. Hệ sinh thái Node.js

| Thư viện | Vai trò |
|---|---|
| `graphql` | Bản cài đặt chuẩn (graphql-js) — nền của mọi thư viện khác |
| **Apollo Server** (`@apollo/server`) | Server phổ biến nhất |
| GraphQL Yoga | Server nhẹ, chuẩn, nhiều plugin |
| `graphql-http` | Handler HTTP tối giản, thay cho `express-graphql` (đã ngừng phát triển) |
| Pothos / TypeGraphQL / Nexus | Viết schema bằng code (code-first), hợp TypeScript |
| **Apollo Client**, urql, Relay | Client cho frontend |
| GraphQL Code Generator | Sinh type TypeScript từ schema & query |
