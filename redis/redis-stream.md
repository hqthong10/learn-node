### Redis Streams with Nodejs
Redis Streams là một cấu trúc dữ liệu mạnh mẽ dành cho các ứng dụng cần xử lý dữ liệu theo kiểu log hoặc luồng thời gian thực. Nó thường được dùng để:
- Xử lý log hệ thống.
- Hàng đợi tin nhắn (message queue).
- Streaming dữ liệu thời gian thực.

#### Khái niệm cơ bản về Redis Streams
- **Stream**: Một tập hợp các entries được lưu theo thứ tự thời gian.
    + Mỗi entry có một ID duy nhất (gồm timestamp và sequence number).
    + Mỗi entry chứa một tập key-value.
- **Các thao tác chính:**
    + **XADD**: Thêm entry vào stream.
    + **XRANGE**: Lấy dữ liệu trong một khoảng ID.
    + **XREAD**: Đọc dữ liệu từ stream theo thời gian thực.
    + **XDEL**: Xóa entry khỏi stream

#### Cài đặt Redis Streams trong Node.js
- Cài đặt Redis client.
```
npm install redis
```

- Thêm dữ liệu vào Stream.
```
const redis = require('redis');
const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Thêm dữ liệu vào stream
client.xadd('mystream', '*', 'temperature', '22', 'humidity', '60', (err, reply) => {
  if (err) throw err;
  console.log('Entry ID:', reply);
  client.quit();
});
```
+ mystream: Tên stream.
+ *: Redis tự động tạo ID dựa trên timestamp.
+ temperature và humidity: Dữ liệu key-value của entry.

- Đọc dữ liệu từ Stream.
```
client.xrange('mystream', '-', '+', (err, entries) => {
  if (err) throw err;

  console.log('Stream entries:');
  entries.forEach(([id, data]) => {
    console.log(`ID: ${id}, Data: ${JSON.stringify(data)}`);
  });

  client.quit();
});
```
+ và +: Lấy toàn bộ dữ liệu từ đầu đến cuối stream.

- Đọc dữ liệu thời gian thực.
```
client.xread('BLOCK', 0, 'STREAMS', 'mystream', '$', (err, reply) => {
  if (err) throw err;

  console.log('Real-time data received:');
  console.log(reply);

  client.quit();
});
```
+ BLOCK 0: Đợi dữ liệu mới mãi mãi.
+ STREAMS mystream $: Lắng nghe dữ liệu mới từ cuối stream.

#### Ứng dụng Redis Streams: Hàng đợi tin nhắn
- Producer: Gửi tin nhắn
```
const redis = require('redis');
const producer = redis.createClient();

producer.on('connect', () => {
  console.log('Producer connected to Redis');
});

// Gửi tin nhắn vào stream
setInterval(() => {
  const message = `Message at ${new Date().toISOString()}`;
  producer.xadd('chatstream', '*', 'message', message, (err, id) => {
    if (err) throw err;
    console.log(`Message sent with ID: ${id}`);
  });
}, 2000);
```

- Consumer: Nhận tin nhắn

```
const redis = require('redis');
const consumer = redis.createClient();

consumer.on('connect', () => {
  console.log('Consumer connected to Redis');
});

// Lắng nghe tin nhắn từ stream
const lastID = '0';

setInterval(() => {
  consumer.xread(
    'BLOCK', 0,
    'STREAMS', 'chatstream', lastID,
    (err, streamData) => {
      if (err) throw err;

      if (streamData) {
        streamData.forEach(([stream, entries]) => {
          entries.forEach(([id, data]) => {
            console.log(`Received [ID: ${id}] - ${data}`);
          });
        });
      }
    }
  );
}, 1000);
```

#### Một số lệnh Streams quan trọng
- Thêm entry vào Stream:
```
XADD mystream * key1 value1 key2 value2
```

- Lấy entry theo khoảng ID:
```
XRANGE mystream 1672560000000-0 1672560000000-1
```

- Lấy entry mới nhất:
```
XREVRANGE mystream + -
```

- Xóa entry
```
XDEL mystream 1672560000000-0
```