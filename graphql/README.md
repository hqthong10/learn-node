# GraphQL — Hướng dẫn sử dụng

> Người mới: đọc lần lượt 01 → 04. Người đã biết: xem [05](05-advanced.md), [06](06-production.md) và [Bảng tra nhanh](#bảng-tra-nhanh) bên dưới.

## Lộ trình

| File | Nội dung | Dành cho |
|---|---|---|
| [01-concepts.md](01-concepts.md) | GraphQL là gì, so với REST, schema, type, resolver | Người mới |
| [02-query-syntax.md](02-query-syntax.md) | Viết query/mutation: biến, alias, fragment, directive | Mọi người |
| [03-server.md](03-server.md) | Dựng server Node.js với Apollo Server + MongoDB | Mọi người |
| [04-client.md](04-client.md) | Gọi từ frontend: `fetch`, Apollo Client, cache | Mọi người |
| [05-advanced.md](05-advanced.md) | Auth, xử lý lỗi, phân trang, N+1 & DataLoader, subscription | Đã biết |
| [06-production.md](06-production.md) | Bảo mật, hiệu năng, thiết kế schema, federation, sự cố | Chuyên nghiệp |

Code mẫu trong thư mục này: [apollo-graphql.js](apollo-graphql.js), [express-graphql.js](express-graphql.js), [schema/](schema/), [models/](models/), [public/](public/).

---

## GraphQL trong 30 giây

```
Client gửi:                         Server trả về đúng hình dạng đó:
POST /graphql
query {                             {
  user(id: "1") {                     "data": {
    name                                "user": {
    posts(first: 2) {                     "name": "Thông",
      title                               "posts": [
    }                                       { "title": "Học Kafka" },
  }                                         { "title": "Học Git" }
}                                         ]
                                        }
                                      }
                                    }
```

- **Một endpoint** (`/graphql`), client **tự chọn field** cần lấy.
- Server mô tả dữ liệu bằng **schema** (có kiểu rõ ràng); mỗi field có một **resolver** lấy dữ liệu.
- Ba loại thao tác: **query** (đọc), **mutation** (ghi), **subscription** (realtime).

---

## Bảng tra nhanh

**Schema (SDL):**

| Cú pháp | Ý nghĩa |
|---|---|
| `type User { id: ID! name: String }` | Object type |
| `String`, `Int`, `Float`, `Boolean`, `ID` | Kiểu vô hướng có sẵn |
| `String!` | Bắt buộc, không null |
| `[Post!]!` | Mảng không null, phần tử không null |
| `input CreateUserInput { name: String! }` | Kiểu cho tham số đầu vào |
| `enum Role { ADMIN USER }` | Liệt kê |
| `interface Node { id: ID! }` / `type User implements Node` | Interface |
| `union SearchResult = User \| Post` | Union |
| `scalar DateTime` | Kiểu vô hướng tự định nghĩa |
| `type Query { ... }` / `type Mutation` / `type Subscription` | Điểm vào |

**Query (phía client):**

| Cú pháp | Ý nghĩa |
|---|---|
| `query GetUser($id: ID!) { user(id: $id) { name } }` | Query có tên + biến |
| `mutation { createUser(input: {...}) { id } }` | Mutation |
| `admin: user(id: 1) { name }` | Alias |
| `fragment F on User { id name }` / `...F` | Fragment |
| `name @include(if: $showName)` / `@skip(if: ...)` | Directive |
| `... on Post { title }` | Inline fragment (union/interface) |
| `__typename` | Tên kiểu của object |

**Resolver:** `(parent, args, context, info) => ...`

**Ghi nhớ:**

| Quy tắc | |
|---|---|
| HTTP status | Thường luôn `200` — lỗi nằm trong mảng `errors` của response |
| N+1 | Resolver lồng nhau gọi DB mỗi phần tử → dùng **DataLoader** |
| Bảo mật | Giới hạn độ sâu/độ phức tạp query, tắt introspection ở production |
| Phân quyền | Kiểm tra trong resolver / tầng business, dựa trên `context.user` |
| Mutation | Nhận một `input`, trả về object đã thay đổi |
