# 04 — Gọi GraphQL từ client

[← Mục lục](README.md) · Trước: [03 — Server](03-server.md) · Tiếp: [05 — Nâng cao](05-advanced.md)

## 1. `fetch` thuần (không cần thư viện)

```js
async function gql(query, variables = {}) {
  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await res.json();
  if (errors?.length) throw new Error(errors[0].message);   // HTTP 200 vẫn có thể có lỗi
  return data;
}

const data = await gql(
  `query GetBook($id: ID!) { book(id: $id) { title author } }`,
  { id: '1' },
);
```

> ⚠️ Luôn kiểm tra `errors` — GraphQL thường trả HTTP 200 kể cả khi lỗi.

Đủ dùng cho script, trang nhỏ. App lớn cần cache, loading state, refetch → dùng client library.

---

## 2. Apollo Client (React)

```bash
npm install @apollo/client graphql
```

> Ví dụ theo Apollo Client 3. Apollo Client 4: các hook (`useQuery`, `useMutation`, `ApolloProvider`) import từ `@apollo/client/react`, và phải khai báo `link: new HttpLink({ uri })` thay cho `uri`.

### Khởi tạo

```jsx
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
```

### Query

```jsx
import { gql, useQuery } from '@apollo/client';

const GET_BOOKS = gql`
  query GetBooks {
    books { id title author }
  }
`;

function Books() {
  const { data, loading, error, refetch } = useQuery(GET_BOOKS);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;
  return data.books.map((b) => <p key={b.id}>{b.title}</p>);
}
```

Tham số hay dùng của `useQuery`:

| Tùy chọn | Ý nghĩa |
|---|---|
| `variables: { id }` | Biến cho query |
| `skip: !id` | Không chạy khi chưa đủ điều kiện |
| `fetchPolicy` | Chiến lược cache (bảng dưới) |
| `pollInterval: 5000` | Tự query lại mỗi 5s |
| `useLazyQuery` | Hook riêng: chỉ chạy khi gọi hàm (vd bấm nút tìm kiếm) |

### Mutation

```jsx
import { gql, useMutation } from '@apollo/client';

const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) { id title author }
  }
`;

function AddBook() {
  const [createBook, { loading }] = useMutation(CREATE_BOOK, {
    refetchQueries: [GET_BOOKS],   // cách đơn giản: query lại danh sách
  });

  return (
    <button disabled={loading} onClick={() => createBook({ variables: { input: { title: 'X', author: 'Y' } } })}>
      Thêm
    </button>
  );
}
```

---

## 3. Cache của Apollo Client

`InMemoryCache` **chuẩn hóa** dữ liệu: mỗi object được lưu một lần theo khóa `__typename:id` (vd `Book:1`). Mọi query chứa `Book:1` dùng chung bản đó.

```
Cache:
  ROOT_QUERY.books → [ref Book:1, ref Book:2]
  Book:1 → { title: "Book 1", author: "Author 1" }
  Book:2 → { ... }
```

Hệ quả:
- Mutation **sửa** object và trả về `id` + field đã đổi → cache tự cập nhật, UI tự render lại.
- Mutation **thêm/xóa** phần tử → cache không tự biết danh sách thay đổi → dùng `refetchQueries` hoặc `update`:

```js
useMutation(CREATE_BOOK, {
  update(cache, { data: { createBook } }) {
    cache.modify({
      fields: {
        books: (existing = []) => [...existing, cache.writeFragment({
          data: createBook,
          fragment: gql`fragment NewBook on Book { id title author }`,
        })],
      },
    });
  },
});
```

| `fetchPolicy` | Hành vi |
|---|---|
| `cache-first` (mặc định) | Có trong cache thì dùng, không gọi mạng |
| `cache-and-network` | Hiện cache ngay, đồng thời gọi mạng để cập nhật |
| `network-only` | Luôn gọi mạng, vẫn ghi vào cache |
| `no-cache` | Luôn gọi mạng, không ghi cache |
| `cache-only` | Chỉ đọc cache |

> Object không có field `id`/`_id` → không chuẩn hóa được. Khai báo khóa riêng: `new InMemoryCache({ typePolicies: { Product: { keyFields: ['sku'] } } })`.

### Optimistic UI

Cập nhật UI ngay trước khi server trả lời:

```js
updateBook({
  variables: { id, title },
  optimisticResponse: { updateBook: { __typename: 'Book', id, title } },
});
```

---

## 4. Gửi token

```js
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: { ...headers, authorization: `Bearer ${localStorage.getItem('token')}` },
  }));
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: 'http://localhost:4000/graphql' })),
  cache: new InMemoryCache(),
});
```

---

## 5. Client khác

| Client | Đặc điểm |
|---|---|
| **Apollo Client** | Đầy đủ nhất, cache chuẩn hóa, phổ biến |
| **urql** | Nhẹ, đơn giản, cache dạng document (có plugin normalized) |
| **Relay** | Của Meta, hiệu năng cao, yêu cầu schema theo chuẩn Relay, khó học |
| **TanStack Query + `graphql-request`** | Dùng khi đã quen React Query, không cần cache chuẩn hóa |

> Dùng **GraphQL Code Generator** để sinh type TypeScript cho từng query → `data.books[0].title` có gợi ý và kiểm tra kiểu.
