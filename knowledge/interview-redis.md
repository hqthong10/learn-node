# Redis là gì?
- Redis (Remote Dictionary Server) là một cơ sở dữ liệu NoSQL dạng key-value, hoạt động trong bộ nhớ (in-memory), giúp truy vấn dữ liệu nhanh hơn so với cơ sở dữ liệu truyền thống. Redis hỗ trợ nhiều kiểu dữ liệu như String, List, Set, Hash, Sorted Set, v.v.

# Redis khác gì so với MySQL/PostgreSQL?
- Loại DB:
    + Redis: NoSQL (Key-Value Store)
    + SQL (Relational DB)
- Lưu trữ: 
    + Redis: In-memory
    + Disk-based
- Tốc độ:
    + Redis: Cực nhanh (μs/ms)
    + Chậm hơn (ms/s)
- Truy vấn:
    + Redis: Lệnh đơn giản (SET, GET)
    + SQL (SELECT, JOIN)
- Hỗ trợ transaction?:
    + Redis: Có (MULTI/EXEC)
    + Có (BEGIN/COMMIT)
=> Redis phù hợp với cache, xếp hàng (queue), session storage, còn MySQL/PostgreSQL thích hợp cho lưu trữ dữ liệu lâu dài.

# Redis có phải là một cơ sở dữ liệu thuần bộ nhớ không?
- Redis lưu trữ dữ liệu trong RAM, nhưng có cơ chế lưu trữ trên ổ đĩa (Persistence) thông qua RDB (Redis Database) và AOF (Append-Only File).

# Các kiểu dữ liệu chính trong Redis là gì?
- String (SET, GET, INCR): Cache dữ liệu, lưu token
- List (LPUSH, RPUSH, LPOP): Hàng đợi (queue), tin nhắn chat
- Set (SADD, SMEMBERS): Lưu danh sách không trùng
- Hash (HSET, HGET, HGETALL): Lưu trữ đối tượng JSON-like
- Sorted Set (ZSet) (ZADD, ZRANGE): Xếp hạng, leaderboard

# Redis có hỗ trợ Transactions không?
Có, Redis hỗ trợ Transaction bằng MULTI, EXEC, DISCARD, WATCH.
```
MULTI
SET user:1 "Alice"
INCR balance:1
EXEC
```
Nếu lệnh INCR bị lỗi, toàn bộ transaction sẽ thất bại.

# Redis có cơ chế lưu dữ liệu (Persistence) không?
- Redis có 2 cơ chế:
    + RDB (Redis Database): Snapshot dữ liệu định kỳ.
    + AOF (Append-Only File): Ghi log tất cả thao tác ghi (SET, DEL,...)
=> Thường kết hợp cả RDB và AOF để tối ưu hiệu suất & an toàn dữ liệu.

# Redis có hỗ trợ Replication không?
- Redis hỗ trợ Master-Slave Replication, giúp tăng tốc đọc dữ liệu và cải thiện tính sẵn sàng (High Availability).
    + Slave tự động đồng bộ dữ liệu từ Master.
    + Nếu Master gặp sự cố, có thể chuyển đổi Slave thành Master.
```
SLAVEOF <master_host> <master_port>
```

# Cách xóa dữ liệu hiệu quả trong Redis?
- DEL key: Xóa 1 key (chậm nếu dữ liệu lớn).
- UNLINK key: Xóa không đồng bộ (nhanh hơn DEL).
- FLUSHDB: Xóa toàn bộ dữ liệu trong DB hiện tại.
- FLUSHALL: Xóa toàn bộ Redis.
=> Nên dùng UNLINK để xóa nhanh hơn nếu key có dữ liệu lớn.

# Redis có hỗ trợ TTL (Time-To-Live) không?
Có! Redis hỗ trợ TTL để tự động xóa dữ liệu sau một khoảng thời gian.
```
SET session:user1 "abc123"
EXPIRE session:user1 300  # Xóa sau 300 giây
```

# Redis hỗ trợ Pub/Sub không?
- Có! Redis có Pub/Sub để gửi và nhận tin nhắn theo mô hình Publisher-Subscriber.
=> Thường dùng trong real-time notifications, chat, event broadcasting.

# Redis Cluster là gì?
- Redis Cluster giúp phân tán dữ liệu trên nhiều node để tăng hiệu suất và khả năng chịu lỗi.
```
redis-cli --cluster create 192.168.1.1:7000 192.168.1.2:7001 ...
```

# Redis có hỗ trợ Sharding không?
- Có! Sharding giúp chia dữ liệu thành nhiều phần để tăng hiệu suất. Redis Cluster sử dụng Sharding tự động bằng thuật toán hash-slot.

# Redis Sentinel là gì?
- Redis Sentinel giúp tự động phát hiện lỗi và failover trong hệ thống Master-Slave.
    + Tự động chọn Master mới nếu Master hiện tại bị lỗi.
    + Giám sát trạng thái các Redis node.
```
redis-server sentinel.conf --sentinel
```

# Redis có hỗ trợ Authentication không?
Có! Redis hỗ trợ mật khẩu qua requirepass.
```
// Thiết lập mật khẩu
requirepass my_redis_password

// Đăng nhập Redis bằng mật khẩu
AUTH my_redis_password
```

# Làm sao để bảo vệ Redis khỏi tấn công?
- Không mở cổng 6379 ra ngoài Internet.
-  Bật Authentication (requirepass).
- Dùng tường lửa (Firewall) để giới hạn truy cập.
- Tắt lệnh nguy hiểm (CONFIG, FLUSHDB, FLUSHALL).
- Chỉ cho phép truy cập từ IP đáng tin cậy.