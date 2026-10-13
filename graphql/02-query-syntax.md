# 02 — Cú pháp query (phía client)

[← Mục lục](README.md) · Trước: [01 — Khái niệm](01-concepts.md) · Tiếp: [03 — Server](03-server.md)

Thử các ví dụ trong Apollo Sandbox / GraphiQL (mở `http://localhost:4000/graphql` khi server chạy).

## 1. Query cơ bản

```graphql
{
  posts {
    id
    title
    author {
      name
    }
  }
}
```

- Phải chọn tới **field vô hướng** (scalar/enum). `author` là object → phải liệt kê field bên trong.
- Viết tắt `{ ... }` = `query { ... }`.

---

## 2. Tham số (arguments)

```graphql
{
  user(id: "1") {
    name
    posts(first: 5, orderBy: CREATED_AT_DESC) {
      title
    }
  }
}
```

Field ở bất kỳ cấp nào cũng có thể nhận tham số.

---

## 3. Đặt tên & biến (luôn dùng trong code)

```graphql
query GetUser($id: ID!, $first: Int = 10) {
  user(id: $id) {
    name
    posts(first: $first) { title }
  }
}
```

Variables gửi riêng dạng JSON:

```json
{ "id": "1", "first": 3 }
```

- **Tên operation** (`GetUser`) giúp debug, log, giám sát.
- **Biến** thay vì nối chuỗi → tránh injection, query cố định nên cache/persisted query được.
- `$id: ID!` bắt buộc, `$first: Int = 10` có giá trị mặc định.

---

## 4. Mutation

```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    author { name }
  }
}
```

```json
{ "input": { "title": "Học GraphQL", "content": "..." } }
```

Mutation trả về object vừa thay đổi → client cập nhật UI/cache ngay, không cần query lại.

Nhiều mutation trong một request chạy **tuần tự** theo thứ tự viết:

```graphql
mutation {
  a: deletePost(id: "1") { id }
  b: deletePost(id: "2") { id }
}
```

---

## 5. Alias — đổi tên field kết quả

Cần gọi cùng một field nhiều lần với tham số khác nhau:

```graphql
{
  admin: user(id: "1") { name }
  guest: user(id: "2") { name }
}
```

```json
{ "data": { "admin": { "name": "A" }, "guest": { "name": "B" } } }
```

---

## 6. Fragment — tái sử dụng tập field

```graphql
fragment UserBasic on User {
  id
  name
  avatar
}

query {
  me { ...UserBasic email }
  user(id: "2") { ...UserBasic }
}
```

Frontend thường để mỗi component khai báo fragment của riêng nó, rồi ghép lại thành query của trang.

---

## 7. Union / interface — inline fragment

```graphql
query Search($q: String!) {
  search(q: $q) {
    __typename
    ... on User { name }
    ... on Post { title }
  }
}
```

`__typename` cho biết mỗi phần tử thuộc type nào — Apollo Client cũng dùng nó để cache.

---

## 8. Directive

```graphql
query GetUser($id: ID!, $withPosts: Boolean!) {
  user(id: $id) {
    name
    posts @include(if: $withPosts) { title }   # chỉ lấy khi withPosts = true
    email @skip(if: $withPosts)                # bỏ khi withPosts = true
  }
}
```

Directive có sẵn: `@include`, `@skip` (client), `@deprecated` (schema), `@specifiedBy` (scalar). Server có thể tự định nghĩa thêm (vd `@auth`).

---

## 9. Introspection — hỏi schema

```graphql
{
  __schema { types { name } }
  __type(name: "User") { fields { name type { name } } }
}
```

Đây là cách GraphiQL/Sandbox tự gợi ý và sinh tài liệu. Production thường tắt (xem [06](06-production.md)).

---

## 10. Gửi qua HTTP

```bash
curl -X POST http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "query GetUser($id: ID!) { user(id: $id) { name } }",
    "variables": { "id": "1" },
    "operationName": "GetUser"
  }'
```

Body luôn là JSON gồm `query`, `variables` (tùy chọn), `operationName` (tùy chọn, cần khi chuỗi chứa nhiều operation).
