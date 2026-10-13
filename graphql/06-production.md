# 06 — Production: bảo mật, hiệu năng, thiết kế schema

[← Mục lục](README.md) · Trước: [05 — Nâng cao](05-advanced.md)

## 1. Bảo mật

GraphQL cho client tự viết query → client cũng có thể viết query **cực nặng**:

```graphql
{ users { friends { friends { friends { friends { name } } } } } }   # bùng nổ theo cấp số nhân
```

| Rủi ro | Biện pháp |
|---|---|
| Query quá sâu | Giới hạn độ sâu: `graphql-depth-limit` (vd tối đa 7–10 cấp) |
| Query quá "đắt" | Tính điểm độ phức tạp: `graphql-query-complexity` |
| Danh sách không giới hạn | Bắt buộc `first`/`limit`, đặt giá trị tối đa (vd 100) |
| Alias/batch spam (`a1: login(...) a2: login(...)`) | Giới hạn số alias/operation mỗi request, rate limit |
| Lộ cấu trúc schema | Tắt introspection (Apollo tự tắt khi `NODE_ENV=production`) |
| Lộ chi tiết lỗi, stack trace | `formatError` (xem [05](05-advanced.md#3-xử-lý-lỗi)) |
| Client lạ gửi query bất kỳ | **Persisted queries** / trusted documents: chỉ chấp nhận query đã đăng ký |
| CSRF | Apollo Server bật sẵn CSRF prevention — client phải gửi `Content-Type: application/json` hoặc header `apollo-require-preflight` |
| Phân quyền thiếu | Kiểm tra ở mọi field nhạy cảm, không chỉ ở `Query` gốc |

```js
import depthLimit from 'graphql-depth-limit';

new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)],
});
```

> Rate limit theo **độ phức tạp**, không chỉ theo số request — một request GraphQL có thể nặng bằng hàng trăm request REST.

---

## 2. Hiệu năng

| Vấn đề | Giải pháp |
|---|---|
| N+1 query | DataLoader ([05](05-advanced.md#5-n1-query--dataloader)) |
| Lấy thừa cột từ DB | Dùng `info` (hoặc `graphql-parse-resolve-info`) để chỉ `select` field được yêu cầu — chỉ khi thật sự cần |
| Parse/validate lặp lại | Apollo cache sẵn document đã parse; dùng persisted queries để gửi hash thay vì cả chuỗi |
| Không HTTP cache được (POST) | APQ + `GET` cho query, `@cacheControl(maxAge: 60)` + CDN |
| Cache tầng server | Cache kết quả resolver/service bằng Redis; `responseCachePlugin` của Apollo |
| Response lớn, chậm hiển thị | `@defer` / `@stream` (incremental delivery) nếu server & client hỗ trợ |
| Resolver chậm không rõ ở đâu | Tracing: OpenTelemetry, Apollo Studio / GraphOS |

---

## 3. Thiết kế schema

| Nguyên tắc | Ví dụ |
|---|---|
| Thiết kế theo **nhu cầu client**, không ánh xạ 1-1 từ bảng DB | `user.fullName`, `order.totalFormatted` |
| Đặt tên nhất quán: type `PascalCase`, field `camelCase`, enum `UPPER_CASE` | `type OrderItem`, `createdAt`, `PENDING` |
| Mutation đặt tên theo hành động, nhận **một `input`**, trả về **payload** | `createOrder(input: CreateOrderInput!): CreateOrderPayload!` |
| Dùng `ID` cho định danh, không lộ khóa nội bộ khi không cần | `id: ID!` |
| Dùng enum thay chuỗi tự do | `status: OrderStatus!` |
| Non-null có cân nhắc: chỉ `!` khi **chắc chắn** luôn có | Field có thể lỗi riêng → để nullable cho partial data |
| Danh sách có thể lớn → phân trang cursor | `orders(first, after): OrderConnection!` |
| Không versioning: thêm field mới, `@deprecated` field cũ | `oldField: String @deprecated(reason: "Dùng newField")` |
| Có mô tả cho type/field (hiện trong tài liệu tự sinh) | `"""Tổng tiền, đơn vị VND"""` |

**Thay đổi an toàn vs phá vỡ (breaking):**

| An toàn | Phá vỡ client |
|---|---|
| Thêm type, field, tham số tùy chọn | Xóa / đổi tên field |
| Thêm giá trị enum (cẩn thận với client `switch`) | Đổi kiểu field |
| Đổi `String!` → `String` ở **tham số** | Đổi `String` → `String!` ở **tham số** / thêm tham số bắt buộc |
| Đổi `String` → `String!` ở **field trả về** | Đổi `String!` → `String` ở **field trả về** |

> Kiểm tra breaking change tự động trong CI: `graphql-inspector`, Apollo `rover graph check`.

---

## 4. Kiến trúc lớn: Federation

Nhiều team, nhiều service → mỗi service sở hữu một phần schema, **router** gộp lại thành một graph:

```
               Client
                 │
          ┌──── Router ────┐        (Apollo Router / GraphQL Mesh / Hive Gateway)
          │      │         │
   users-service  orders-service  products-service
   type User      type Order      type Product
                  extend User { orders }
```

```graphql
# users-service
type User @key(fields: "id") { id: ID!, name: String! }

# orders-service
type User @key(fields: "id") { id: ID!, orders: [Order!]! }
```

Chỉ nên dùng khi có nhiều team/service thật sự; hệ thống nhỏ dùng một server (monolith graph) đơn giản hơn nhiều.

---

## 5. Giám sát

| Theo dõi | Công cụ |
|---|---|
| Latency theo **operation name** và theo **field** | Apollo GraphOS, OpenTelemetry, Grafana |
| Tỷ lệ lỗi theo `extensions.code` | Log có cấu trúc + dashboard |
| Field nào còn được dùng (trước khi xóa) | Field usage trong GraphOS / Hive |
| Query chậm, query nặng | Log query có độ phức tạp cao |

> Bắt buộc client đặt **tên operation** — không có tên thì gần như không giám sát được.

---

## 6. Xử lý sự cố

| Triệu chứng | Nguyên nhân / Cách xử lý |
|---|---|
| `Cannot query field "x" on type "Y"` | Field không có trong schema, hoặc sai type — kiểm tra SDL |
| Field luôn trả `null` | Tên resolver không khớp tên field; resolver quên `return`; với `rootValue` (express-graphql) hàm nhận `(args)` chứ không phải `(parent, args)` |
| `Cannot return null for non-nullable field` | Resolver trả null/lỗi cho field `!` → sửa dữ liệu hoặc bỏ `!` |
| `id` trả về null với MongoDB | Schema khai báo `id` nhưng chỉ có `_id` → dùng document Mongoose (có getter `id`) hoặc viết resolver `id: (d) => d._id` |
| Lỗi CORS ở trình duyệt | Bật `cors()` cho route `/graphql` với đúng origin |
| `This operation has been blocked as a potential CSRF` | Client không gửi `Content-Type: application/json` → thêm header |
| Sandbox/GraphiQL trắng trang | `helmet` CSP chặn script → nới CSP cho dev |
| Response chậm khi lấy danh sách lồng nhau | N+1 → DataLoader |
| Subscription không nhận được | Sai path WebSocket, client dùng giao thức cũ `subscriptions-transport-ws`, hoặc PubSub in-memory khi chạy nhiều instance |
| UI không cập nhật sau mutation (Apollo Client) | Mutation không trả `id`, hoặc thêm/xóa phần tử danh sách → `refetchQueries` / `update` |
