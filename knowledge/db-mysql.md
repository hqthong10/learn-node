# [v] MySQL là gì?
# InnoDB và MyISAM khác nhau như thế nào?

# Giải thích ACID trong cơ sở dữ liệu?

# Các kiểu dữ liệu chính trong MySQL là gì?
- Kiểu số (Numeric Types)
    + TINYINT (1 byte): Thích hợp cho cờ Boolean (0 hoặc 1)
    + SMALLINT (2 bytes)
    + MEDIUMINT (3 bytes)
    + INT (4 bytes): Kiểu số nguyên phổ biến
    + BIGINT (8 bytes): Dùng cho số lớn
    + FLOAT (4 bytes): Dùng cho số thực, độ chính xác thấp
    + DOUBLE (8 bytes): Độ chính xác cao hơn FLOAT
    + DECIMAL(M,D) (Tùy số chữ số): Lưu số thập phân chính xác, thích hợp cho tiền tệ
- Kiểu ký tự và chuỗi (String Types)
    + CHAR(N): Chuỗi có độ dài cố định
    + VARCHAR(N): Chuỗi có độ dài thay đổi, tối ưu hơn CHAR
    + TEXT: Dùng để lưu văn bản lớn, không có index tốt
    + TINYTEXT: Văn bản ngắn
    + MEDIUMTEXT: Văn bản lớn
    + LONGTEXT: Văn bản rất lớn
    + BLOB: Lưu trữ dữ liệu nhị phân (hình ảnh, file,...)
    + TINYBLOB
    + MEDIUMBLOB
    + LONGBLOB
- Kiểu ngày và thời gian (Date & Time Types)
    + DATE: Lưu ngày
    + DATETIME: Lưu cả ngày và giờ
    + TIMESTAMP: Tự động cập nhật theo múi giờ
    + TIME: Lưu thời gian
    + YEAR: Lưu năm

# Sự khác nhau giữa CHAR và VARCHAR?

# Sự khác nhau giữa TEXT và BLOB?
- BLOB lưu dữ liệu nhị phân

# Viết câu lệnh để tạo bảng, chèn dữ liệu và xóa bảng?

# Phân biệt UNIQUE, PRIMARY KEY, FOREIGN KEY và AUTO_INCREMENT?

# Cách sử dụng SELECT với WHERE, ORDER BY, GROUP BY, HAVING?

# Khác biệt giữa INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN?

# Cách sử dụng UNION và UNION ALL?


# Làm thế nào để tối ưu hóa một truy vấn MySQL chậm?

# Giải thích INDEX trong MySQL, các loại index phổ biến?
- INDEX (chỉ mục) là một cấu trúc dữ liệu giúp tăng tốc truy vấn (SELECT) bằng cách tạo ra một bảng tra cứu để tìm kiếm dữ liệu nhanh hơn.
- Khi một cột có index, MySQL có thể tìm kiếm dữ liệu mà không cần duyệt toàn bộ bảng (full table scan).

- Các loại INDEX phổ biến trong MySQL
    + PRIMARY KEY: Index duy nhất, không thể có giá trị NULL
    + UNIQUE INDEX: Không cho phép giá trị trùng lặp
    + B-Tree INDEX: Index mặc định trong MySQL, hỗ trợ truy vấn nhanh
    + FULLTEXT INDEX: Chuyên dùng cho tìm kiếm văn bản
    + SPATIAL INDEX: Dùng cho dữ liệu không gian (GIS)

# Làm thế nào để kiểm tra Index đang hoạt động hiệu quả?

# Làm sao để kiểm tra truy vấn đang chạy có hiệu suất tốt không? (Sử dụng EXPLAIN hoặc SHOW PROCESSLIST)

# Khi nào nên dùng INDEX, khi nào không nên dùng?
- Dùng khi
    +Khi bảng có nhiều dữ liệu (hàng triệu bản ghi).
    + Khi thường xuyên truy vấn có điều kiện (WHERE, JOIN, ORDER BY, GROUP BY).
    + Khi cột cần đảm bảo duy nhất (UNIQUE).
    + Khi tìm kiếm văn bản (FULLTEXT).
    + Khi làm việc với tọa độ địa lý (SPATIAL).

- Không nên dùng
    + Bảng nhỏ, chỉ có vài trăm bản ghi (không cần tối ưu).
    + Cập nhật (INSERT, UPDATE, DELETE) quá nhiều (vì index sẽ làm chậm thao tác ghi dữ liệu).
    + Có quá nhiều index (tốn RAM, làm chậm insert/update).

# Có bao nhiêu loại khóa trong MySQL? (Row-level, Table-level, etc.)
- Table Lock (Khóa bảng):
    + Khóa toàn bộ bảng, không cho các session khác truy cập cùng lúc
    + Khi cần cập nhật hàng loạt dữ liệu
- Row Lock (Khóa dòng):
    + Chỉ khóa các dòng bị ảnh hưởng, không khóa cả bảng
    + Khi có nhiều giao dịch cùng truy cập vào một bảng
- Shared Lock (S Lock):
    + Cho phép nhiều tiến trình đọc cùng lúc nhưng không được ghi
    + Khi chỉ cần đọc dữ liệu mà không thay đổi
- Exclusive Lock (X Lock):
    + Chỉ có một tiến trình có thể đọc/ghi dữ liệu
    + Khi cần cập nhật dữ liệu quan trọng
- Intent Lock: 
    + Đánh dấu trước khi khóa Shared/Exclusive	+ Khi có nhiều giao dịch đồng thời
- Gap Lock:
    + Ngăn chặn chèn dữ liệu mới vào khoảng trống giữa các dòng
    + Khi dùng SELECT ... FOR UPDATE với InnoDB
- Auto-Increment Lock:
    + Điều khiển việc tăng giá trị AUTO_INCREMENT
    + Khi chèn dữ liệu vào bảng có AUTO_INCREMENT

# Sự khác biệt giữa Optimistic Locking và Pessimistic Locking?

# SELECT FOR UPDATE hoạt động như thế nào?
# Transaction là gì? Cách sử dụng BEGIN, COMMIT, ROLLBACK?
# Các mức Isolation Level trong MySQL là gì?
# Sự khác nhau giữa READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE?

# Câu hỏi về MySQL thực tế
1. Làm sao để xử lý hàng triệu bản ghi trong MySQL?
2. Khi nào nên dùng Partitioning trong MySQL?
3. Khi nào nên sử dụng Sharding trong MySQL?
4. MySQL Replication là gì? Có bao nhiêu loại Replication?
5. Cách backup và restore MySQL database?
6. MySQL Cluster là gì?

# Câu hỏi SQL thực hành
1. Lấy danh sách khách hàng có tổng số tiền mua hàng lớn nhất?
2. Lấy 3 sản phẩm bán chạy nhất trong tháng trước?
3. Tìm tất cả các khách hàng không có đơn hàng nào?
4. Viết truy vấn lấy 5 nhân viên có lương cao nhất?
