Redisearch một module của Redis cho phép tìm kiếm văn bản đầy đủ (full-text search) và lập chỉ mục nâng cao. Redisearch giúp bạn tạo các chỉ mục tìm kiếm mạnh mẽ trên dữ liệu được lưu trữ trong Redis và hỗ trợ các tính năng như tìm kiếm toàn văn, truy vấn phạm vi, và sắp xếp.

### **Cài Đặt Redisearch**

Đầu tiên, bạn cần cài đặt Redisearch. Bạn có thể sử dụng Docker để dễ dàng chạy Redis với Redisearch:

```
docker run -p 6379:6379 --name redis-redisearch redislabs/redisearch:latest
```

Sử Dụng Redisearch với Node.js

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