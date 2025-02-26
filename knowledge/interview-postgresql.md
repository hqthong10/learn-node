# Câu hỏi PostgreSQL cơ bản
1. [v] PostgreSQL là gì?
1. So sánh với MySQL?
- Kiến trúc:
+ PostgreSQL: Hỗ trợ cả SQL và NoSQL
+ MySQL: Chỉ hỗ trợ SQL

- Kiểu dữ liệu
+ PostgreSQL: JSON, XML, Array, UUID, Hstore…
+ MySQL: Hạn chế hơn

- Chỉ mục
+ PostgreSQL: B-tree, Hash, GIN, GiST (đa dạng hơn)
+ MySQL: B-tree, Hash

- ACID
+ PostgreSQL: Hỗ trợ đầy đủ
+ MySQL: Hỗ trợ nhưng không mạnh bằng

- Mở rộng:
+ PostgreSQL: Hỗ trợ sharding, partitioning tốt hơn
+ MySQL: Kém hơn

- Ứng dụng
+ PostgreSQL: Hệ thống lớn, AI, Big Data, Blockchain
+ MySQL: Web, ứng dụng nhỏ & vừa


2. PostgreSQL có phải là SQL hay NoSQL?
3. PostgreSQL có hỗ trợ ACID không?
4. PostgreSQL lưu trữ dữ liệu như thế nào?
5. Schema trong PostgreSQL là gì?
6. Sự khác nhau giữa Table, View, Materialized View?
7. Lệnh tạo database, tạo bảng?
8. Sự khác nhau giữa TEXT, VARCHAR, CHAR trong PostgreSQL?
9. Cách sử dụng PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK?

# Câu hỏi PostgreSQL nâng cao
2.1. Index & Tối ưu hiệu suất
1. Index trong PostgreSQL là gì? Có bao nhiêu loại Index?
2. Khi nào nên dùng B-Tree Index, GIN Index, BRIN Index?
3. Làm sao để kiểm tra hiệu suất truy vấn? (EXPLAIN ANALYZE)
4. Partitioning là gì? Khi nào nên dùng?
2.2. Transaction & Locking
5. PostgreSQL hỗ trợ những mức Transaction Isolation nào?
6. Sự khác nhau giữa Optimistic Locking và Pessimistic Locking?
7. SELECT FOR UPDATE hoạt động như thế nào?
2.3. Replication & Backup
8. PostgreSQL có hỗ trợ Replication không?
9. Streaming Replication hoạt động như thế nào?
10. Cách backup và restore dữ liệu trong PostgreSQL?

# Câu hỏi PostgreSQL thực tế
1. Khi nào PostgreSQL có thể bị chậm? Cách tối ưu?
2. Khi nào nên dùng Sharding, khi nào nên dùng Replication?
3. Làm sao để scale PostgreSQL?
4. Cách bảo mật PostgreSQL?
5. Cách cấp quyền READ, WRITE, EXECUTE cho user?

# Câu hỏi PostgreSQL thực hành
1. Lấy danh sách khách hàng có tổng số tiền mua hàng lớn nhất?
2. Tìm các sản phẩm có giá lớn hơn 1000$?
3. Lấy 5 sản phẩm bán chạy nhất trong tháng trước?
4. Tìm tất cả các khách hàng không có đơn hàng nào?