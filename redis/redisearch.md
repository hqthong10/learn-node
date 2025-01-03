RediSearch là một module của Redis cho phép thực hiện tìm kiếm văn bản toàn văn (full-text search) và truy vấn dữ liệu nhanh chóng. Nó hỗ trợ:

- Tìm kiếm full-text với các tính năng như tìm kiếm cụm từ, fuzzy search.
- Lọc dữ liệu theo các trường (fields) hoặc các điều kiện.
- Sắp xếp kết quả theo thứ tự.
- Tự động tạo chỉ mục trên dữ liệu.

### **Cài Đặt Redisearch**

- Đầu tiên, bạn cần cài đặt Redisearch. Bạn có thể sử dụng Docker để dễ dàng chạy Redis với Redisearch:
```
docker run -p 6379:6379 --name redis-redisearch redislabs/redisearch:latest
```

- Cài đặt Redis client trong Node.js
```
npm install redis
```

### Các khái niệm chính
- Index (Chỉ mục):
  + Là cấu trúc dữ liệu để lưu trữ thông tin tìm kiếm.
  + Tạo chỉ mục bằng lệnh FT.CREATE.

- Document (Tài liệu):
  + Là một bản ghi được thêm vào index, bao gồm các trường dữ liệu.

- Query (Truy vấn):
  + Tìm kiếm trong index dựa trên các từ khóa hoặc điều kiện.

### RediSearch trong Node.js

- Kết nối Redis
```
const redis = require('redis');
const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});
```

- Tạo Index
```
client.send_command(
  'FT.CREATE',
  [
    'myindex',                 // Tên index
    'ON', 'HASH',              // Loại dữ liệu (HASH, JSON)
    'PREFIX', '1', 'doc:',     // Tiền tố của key
    'SCHEMA',                  // Định nghĩa schema
    'title', 'TEXT',           // Trường 'title' kiểu TEXT
    'description', 'TEXT',     // Trường 'description' kiểu TEXT
    'price', 'NUMERIC'         // Trường 'price' kiểu NUMERIC
  ],
  (err, reply) => {
    if (err) throw err;
    console.log('Index created:', reply);
  }
);
```

- Thêm Document vào Index
```
client.hset(
  'doc:1',
  'title', 'Redis Search Module',
  'description', 'A module to enhance search capabilities in Redis',
  'price', '99.99',
  (err, reply) => {
    if (err) throw err;
    console.log('Document added:', reply);
  }
);
```

- Tìm kiếm
  + Tìm kiếm toàn văn bản (Full-Text Search):

  ```
  client.send_command(
    'FT.SEARCH',
    [
      'myindex',          // Tên index
      'Redis',            // Từ khóa tìm kiếm
      'LIMIT', '0', '10'  // Giới hạn kết quả
    ],
    (err, reply) => {
      if (err) throw err;
      console.log('Search results:', reply);
    }
  );
  ```

  + Tìm kiếm với điều kiện (Numeric Filtering):
  client.send_command(
    'FT.SEARCH',
    [
      'myindex',
      '@price:[50 100]',  // Tìm kiếm giá trong khoảng 50 đến 100
      'LIMIT', '0', '10'
    ],
    (err, reply) => {
      if (err) throw err;
      console.log('Search results:', reply);
    }
  );

- Xóa Index
```
client.send_command(
  'FT.DROPINDEX',
  ['myindex', 'DD'], // 'DD' để xóa cả dữ liệu
  (err, reply) => {
    if (err) throw err;
    console.log('Index deleted:', reply);
  }
);
```

### Ví dụ
- Tìm kiếm sản phẩm
+ Tạo Index
```
client.send_command(
  'FT.CREATE',
  [
    'products',
    'ON', 'HASH',
    'PREFIX', '1', 'product:',
    'SCHEMA',
    'name', 'TEXT',
    'category', 'TAG',
    'price', 'NUMERIC',
    'stock', 'NUMERIC'
  ],
  (err, reply) => {
    if (err) throw err;
    console.log('Index created:', reply);
  }
);
```

+ Thêm sản phẩm
```
client.hset(
  'product:1',
  'name', 'Laptop',
  'category', 'Electronics',
  'price', '999.99',
  'stock', '10',
  (err, reply) => {
    if (err) throw err;
    console.log('Product added:', reply);
  }
);
```

+ Tìm kiếm sản phẩm theo tên
```
client.send_command(
  'FT.SEARCH',
  ['products', 'Laptop'],
  (err, reply) => {
    if (err) throw err;
    console.log('Search results:', reply);
  }
);
```

+ Lọc sản phẩm theo giá và tồn kho
```
client.send_command(
  'FT.SEARCH',
  ['products', '@price:[500 1500] @stock:[5 +inf]'],
  (err, reply) => {
    if (err) throw err;
    console.log('Filtered products:', reply);
  }
);
```

### Các tính năng nâng cao
- Tìm kiếm fuzzy
```
// Sử dụng ~ để tìm kiếm gần đúng
client.send_command('FT.SEARCH', ['myindex', '%Redi%~']);
```

- Sắp xếp kết quả
```
// Thêm SORTBY vào truy vấn
client.send_command(
  'FT.SEARCH',
  ['products', '*', 'SORTBY', 'price', 'ASC']
);
```

- Autocomplete (Hoàn thành từ khóa)
```
// Sử dụng FT.SUGADD và FT.SUGGET
```

- Highlight kết quả tìm kiếm
```
// Sử dụng HIGHLIGHT
```

- Khác:

```
const redis = require('redis');
const { promisify } = require('util');

// Kết nối tới Redis
const client = redis.createClient();

// Chuyển đổi các hàm Redis thành Promise
const ft_create = promisify(client.ft_create).bind(client);
const hset = promisify(client.hset).bind(client);
const ft_search = promisify(client.ft_search).bind(client);

async function setup() {
  // Tạo chỉ mục
  await ft_create('idx:users', {
    ON: 'HASH',
    PREFIX: '1 user:',
    SCHEMA: 'name TEXT age NUMERIC'
  });

  // Thêm dữ liệu
  await hset('user:1', 'name', 'John Doe', 'age', 30);
  await hset('user:2', 'name', 'Jane Doe', 'age', 25);
  await hset('user:3', 'name', 'Alice Smith', 'age', 30);

  // Tìm kiếm dữ liệu
  const result = await ft_search('idx:users', '@name:John');
  console.log(result);
}

setup().catch(console.error);
```