# [v] PostgreSQL là gì?

# PostgreSQL có phải là SQL hay NoSQL?
PostgreSQL vừa là SQL vừa là NoSQL

# PostgreSQL có hỗ trợ ACID không?
hỗ trợ mạnh mẽ 

# PostgreSQL lưu trữ dữ liệu như thế nào?
PostgreSQL lưu trữ dữ liệu theo cấu trúc phân tầng gồm: Database → Schema → Table → Page → Tuple. Dữ liệu không chỉ được ghi vào bảng mà còn được quản lý bởi các cơ chế lưu trữ, indexing, WAL (Write-Ahead Logging) để đảm bảo hiệu suất và an toàn dữ liệu.
🔥 1. Cấu trúc lưu trữ trong PostgreSQL
📌 Cấp cao: Database → Schema → Table
Database: Mỗi PostgreSQL instance có thể có nhiều database.
Schema: Mỗi database có thể chứa nhiều schema (một cách tổ chức bảng và dữ liệu).
Table: Dữ liệu được lưu trữ trong bảng.
📌 Cấp thấp: Page → Tuple (Row)
PostgreSQL lưu trữ dữ liệu theo từng page (block) trong file hệ thống.
Mỗi page chứa nhiều tuple (row).
Khi một bảng được tạo, PostgreSQL cấp phát không gian trên đĩa theo từng page 8KB.

🔥 2. PostgreSQL lưu trữ bảng như thế nào?
Khi tạo bảng:
- PostgreSQL tạo một file trong hệ thống để lưu dữ liệu của bảng.
- File này được chia thành nhiều page (8KB mỗi page).
- Khi có dữ liệu mới, PostgreSQL ghi dữ liệu vào các tuple (row) bên trong page.
🔥 3. Cấu trúc của một page trong PostgreSQL
Mỗi page (8KB) trong PostgreSQL bao gồm:

Header (24 bytes): Metadata về page.
Item Pointer (16 bytes): Chỉ mục đến vị trí dữ liệu trong page.
Tuple (Row Data): Chứa dữ liệu thực tế.
Free Space: Phần trống để ghi dữ liệu mới.
📌 Khi ghi dữ liệu mới:

PostgreSQL tìm page có đủ chỗ trống.
Nếu không có, PostgreSQL cấp phát page mới.
🚨 Lưu ý: PostgreSQL không ghi đè dữ liệu khi cập nhật, mà tạo một bản ghi mới (MVCC - Multi-Version Concurrency Control).

# Schema trong PostgreSQL là gì?
Schema trong PostgreSQL là một không gian chứa các đối tượng cơ sở dữ liệu như bảng, view, index, function, sequence, v.v. Một database có thể chứa nhiều schema, giúp tổ chức dữ liệu và quản lý quyền truy cập hiệu quả hơn.
- Mặc định: PostgreSQL tạo một schema có tên là "public". Nếu không chỉ định schema khi truy vấn, PostgreSQL sẽ sử dụng schema này.

# Sự khác nhau giữa Table, View, Materialized View?
- Table là một cấu trúc sữ liệu vật lý trong database, lưu trữ dữ liệu vĩnh viễn trên ổ đĩa
- View chỉ là 1 câu truy vấn ảo dựa trên các Table, không lưu trữ dữ liệu mà chỉ hiển thị dữ liệu dựa trên truy vấn gốc.
- Materialized View giống như view nhưng lưu trữ dữ liệu tạm thời. Nó không tự cập nhật khi dữ liệu nguồn thay đổi.

# [v] Lệnh tạo database, tạo bảng?

# Sự khác nhau giữa TEXT, VARCHAR, CHAR trong PostgreSQL?
- CHAR(n): độ dài cố định, nếu không đủ n ký tự thì tự động thêm SPACE.
- VARCHAR(n): độ dài thay đổi, giới hạn bởi n. không tự động thêm SPACE.
- TEXT: không có độ dài giới hạn

# Cách sử dụng PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK?
-- 

# Index trong PostgreSQL là gì? Có bao nhiêu loại Index?
- Index (chỉ mục) trong PostgreSQL giúp tăng tốc truy vấn dữ liệu bằng cách tạo ra một cấu trúc đặc biệt để tìm kiếm nhanh hơn.
- Nếu không có index, PostgreSQL phải quét toàn bộ bảng (Sequential Scan), gây chậm khi dữ liệu lớn.

- Các loại index:
    + B-Tree (Mặc định): Phù hợp cho hầu hết các truy vấn tìm kiếm (=, <, >, BETWEEN).
        vd: CREATE INDEX idx_users_email ON users(email);
    + Hash: Chỉ tối ưu cho tra cứu bằng =.
    + GIN (Generalized Inverted Index): Tốt cho dữ liệu kiểu JSONB, mảng hoặc tìm kiếm toàn văn (full-text search).
        vd: CREATE INDEX idx_users_bio ON users USING GIN(to_tsvector('english', bio));
    + GiST (Generalized Search Tree): Hữu ích khi tìm kiếm không gian (spatial search).
    + BRIN (Block Range INdex): Hiệu quả với các bảng rất lớn, đặc biệt khi dữ liệu được lưu theo thứ tự.
    + SP-GiST: Dành cho dữ liệu có cấu trúc phân cấp.

# Khi nào nên dùng B-Tree Index, GIN Index, BRIN Index?

# Làm sao để kiểm tra hiệu suất truy vấn? (EXPLAIN ANALYZE)
EXPLAIN ANALYZE cautruyvan

# Partitioning là gì? Khi nào nên dùng?
Partitioning (phân vùng) trong PostgreSQL là kỹ thuật chia một bảng lớn thành nhiều bảng con (partitions) dựa trên một điều kiện nhất định (ví dụ: ngày tháng, phạm vi giá trị, hash, v.v.). Điều này giúp cải thiện hiệu suất truy vấn và quản lý dữ liệu dễ dàng hơn.
- PostgreSQL hỗ trợ hai loại partitioning chính:
    + Range Partitioning: Chia bảng theo phạm vi giá trị, thường dùng với dữ liệu thời gian (vd: chia theo tháng, năm).
    + List Partitioning: Chia bảng theo danh sách giá trị cụ thể (vd: chia theo quốc gia, khu vực).
    + Hash Partitioning: Chia bảng theo hàm băm, thường áp dụng khi dữ liệu không thể phân chia theo phạm vi hoặc danh sách cụ thể.

- Khi nào nên sử dụng Partitioning?
    + Dữ liệu quá lớn: Khi bảng có hàng triệu hoặc hàng tỷ bản ghi, partitioning giúp cải thiện hiệu suất truy vấn.
    + Truy vấn thường xuyên có điều kiện lọc trên một cột nhất định: Ví dụ, nếu bạn thường xuyên truy vấn dữ liệu theo ngày (created_at), thì partition theo ngày tháng sẽ giúp tối ưu hiệu suất.
    + Xóa dữ liệu nhanh chóng: Khi cần xóa một lượng lớn dữ liệu (ví dụ: dữ liệu cũ hàng năm), bạn có thể DROP hoặc TRUNCATE partition thay vì chạy DELETE (giúp giảm load trên database).
    + Tăng hiệu suất INSERT: Nếu dữ liệu được chèn theo thời gian (vd: log, giao dịch tài chính), partitioning giúp tránh tình trạng lock trên bảng chính.
    + Cải thiện hiệu suất truy vấn: Nếu PostgreSQL có thể loại bỏ các partitions không cần thiết khi thực hiện truy vấn (partition pruning), hiệu suất sẽ được cải thiện đáng kể.



# PostgreSQL hỗ trợ những mức Transaction Isolation nào?

# Sự khác nhau giữa Optimistic Locking và Pessimistic Locking?

# SELECT FOR UPDATE hoạt động như thế nào?

# Replication & Backup

# PostgreSQL có hỗ trợ Replication không?

# Streaming Replication hoạt động như thế nào?

# Cách backup và restore dữ liệu trong PostgreSQL?

# Khi nào PostgreSQL có thể bị chậm? Cách tối ưu?

# Khi nào nên dùng Sharding, khi nào nên dùng Replication?

# Làm sao để scale PostgreSQL?

# Cách bảo mật PostgreSQL?

# Cách cấp quyền READ, WRITE, EXECUTE cho user?

# Câu hỏi PostgreSQL thực hành
1. Lấy danh sách khách hàng có tổng số tiền mua hàng lớn nhất?
2. Tìm các sản phẩm có giá lớn hơn 1000$?
3. Lấy 5 sản phẩm bán chạy nhất trong tháng trước?
4. Tìm tất cả các khách hàng không có đơn hàng nào?