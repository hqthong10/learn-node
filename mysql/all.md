# Tuần 1: Nền tảng MySQL và Phân tích yêu cầu
## Ngày 1-3: Hiểu cơ bản về MySQL
- Học các khái niệm cơ bản:
    + DDL (Data Definition Language): CREATE, ALTER, DROP.
    + DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE.
    + DCL (Data Control Language): GRANT, REVOKE.

- Thực hành:
    + Tạo bảng, thêm dữ liệu, và viết các truy vấn cơ bản.
    + Cài đặt MySQL Workbench để hỗ trợ làm việc với MySQL.
- Tài liệu: MySQL Documentation.

## Ngày 4-5: Phân tích yêu cầu
- Luyện tập phân tích yêu cầu từ một bài toán thực tế:
    Ví dụ: Xây dựng hệ thống quản lý học sinh.
- Xác định các bảng cần thiết: Students, Classes, Teachers.
- Định nghĩa các mối quan hệ giữa các bảng.
- Công cụ hỗ trợ: Vẽ sơ đồ ERD (Entity Relationship Diagram) bằng công cụ như Draw.io hoặc dbdiagram.io.

## Ngày 6-7: Thiết kế database
- Học về chuẩn hóa (Normalization): Hiểu các dạng chuẩn (1NF, 2NF, 3NF, BCNF).
- Thực hành chuẩn hóa dữ liệu từ một bảng phức tạp.
- Học về phi chuẩn hóa (Denormalization) để tối ưu hóa khi cần thiết.
- Bài tập: Thiết kế database cho hệ thống quản lý cửa hàng sách.

# Tuần 2: Hiệu suất và Tối ưu hóa

## Ngày 8-9: Hiểu về Index
Tìm hiểu các loại Index:
B-Tree Index.
Full-Text Index.
Unique Index.
Thực hành:
Thêm và xóa chỉ mục trong các bảng.
Sử dụng lệnh EXPLAIN để kiểm tra tác động của Index trên hiệu suất truy vấn.

## Ngày 10-11: Tối ưu hóa query
Học các kỹ thuật tối ưu:
Sử dụng LIMIT để giảm dữ liệu không cần thiết.
Tránh sử dụng SELECT * mà chỉ chọn các cột cần thiết.
Tránh sử dụng subquery nếu có thể dùng JOIN.
Thực hành tối ưu truy vấn với EXPLAIN trên các bảng lớn.

## Ngày 12-13: Partitioning và Sharding
Tìm hiểu:
Partitioning: Chia nhỏ bảng lớn theo từng phần để tăng tốc độ truy vấn.
Sharding: Phân phối dữ liệu trên nhiều server.
Bài tập:
Chia bảng Orders thành các partition theo năm.

## Ngày 14: Caching
Tìm hiểu cách sử dụng bộ nhớ đệm (caching):
Query Cache trong MySQL.
Sử dụng Redis hoặc Memcached để lưu kết quả truy vấn.
Thực hành:
Cài đặt và thử nghiệm caching trên một ứng dụng nhỏ.

# Tuần 3: Xử lý lỗi và các vấn đề nâng cao
## Ngày 15-16: Deadlock
Hiểu nguyên nhân gây ra Deadlock.
Thực hành:
Tạo kịch bản gây Deadlock bằng các giao dịch đồng thời.
Giải quyết bằng cách:
Thực hiện khóa theo thứ tự.
Sử dụng lệnh SHOW ENGINE INNODB STATUS để phân tích Deadlock.

## Ngày 17-18: Transactions và ACID
Tìm hiểu:
Các thuộc tính của giao dịch (ACID): Atomicity, Consistency, Isolation, Durability.
Cách sử dụng START TRANSACTION, COMMIT, và ROLLBACK.
Bài tập:
Viết một ứng dụng CRUD với các giao dịch phức tạp.

## Ngày 19-20: Handle Concurrency
Học các cấp độ cách ly giao dịch (Isolation Levels):
READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.
Thực hành:
Thử nghiệm các cấp độ cách ly trên bảng có nhiều giao dịch đồng thời.

# Tuần 4: Dự án thực tế và nâng cao

## Ngày 21-23: Xây dựng dự án
Đề bài: Hệ thống quản lý đặt vé máy bay.
Thiết kế CSDL cho các bảng Flights, Bookings, Users.
Xử lý các vấn đề: Deadlock, rate limiting, và caching.
Công cụ hỗ trợ:
Sử dụng MySQL Workbench để kiểm tra các truy vấn.

## Ngày 24-26: Tối ưu hóa cho Big Data
Làm việc với bảng lớn:
Sử dụng Partitioning và Index.
Viết các truy vấn tối ưu cho bảng chứa hàng triệu bản ghi.
Thử nghiệm:
Import một dataset lớn và kiểm tra hiệu suất.

## Ngày 27-28: Sao lưu và phục hồi
Tìm hiểu cách:
Sao lưu dữ liệu bằng mysqldump.
Phục hồi dữ liệu từ file backup.
Thực hành:
Tạo bản sao lưu tự động hàng ngày.

## Ngày 29-30: Ôn tập và Đánh giá
Tổng hợp kiến thức đã học.
Viết một báo cáo phân tích hiệu suất cho dự án đã thực hiện.
Kiểm tra lại các vấn đề:
Hiệu suất.
Deadlock.
Độ tin cậy dữ liệu.
