# MySQL

MySQL là một hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở (RDBMS - Relational Database Management System). Nó được sử dụng rộng rãi để quản lý và lưu trữ dữ liệu trong nhiều ứng dụng khác nhau, từ các trang web nhỏ đến các hệ thống lớn và phức tạp.

### Tính Năng Chính của MySQL

1. Quản Lý Dữ Liệu Quan Hệ

    - MySQL sử dụng mô hình dữ liệu quan hệ, trong đó dữ liệu được tổ chức dưới dạng các bảng (tables) với các hàng (rows) và cột (columns).
    - Các bảng có thể liên kết với nhau thông qua các khóa chính (primary keys) và khóa ngoại (foreign keys).

2. Ngôn Ngữ Truy Vấn Cấu Trúc (SQL)

    - MySQL sử dụng SQL (Structured Query Language) để thực hiện các thao tác như thêm, sửa, xóa và truy vấn dữ liệu.
    - SQL là một ngôn ngữ mạnh mẽ và tiêu chuẩn cho quản lý cơ sở dữ liệu quan hệ.

3. Hiệu Suất Cao và Khả Năng Mở Rộng

    - MySQL được thiết kế để xử lý hiệu quả các khối lượng công việc lớn và có thể mở rộng để đáp ứng nhu cầu tăng trưởng của dữ liệu.
    - Nó hỗ trợ nhiều cơ chế lưu trữ (storage engines) như InnoDB và MyISAM, mỗi loại có các đặc điểm riêng về hiệu suất và tính năng.

4. Bảo Mật

    - MySQL cung cấp nhiều tính năng bảo mật như quản lý người dùng, quyền truy cập và mã hóa dữ liệu.
    - Hệ thống quyền linh hoạt giúp kiểm soát truy cập đến cơ sở dữ liệu và các bảng dữ liệu.

5. Khả Năng Sao Lưu và Phục Hồi

    - MySQL hỗ trợ các phương thức sao lưu và phục hồi dữ liệu, bao gồm sao lưu toàn bộ hoặc từng phần, phục hồi dữ liệu từ các bản sao lưu, và sao chép dữ liệu (replication).

6. Tính Di Động

    - MySQL có thể chạy trên nhiều hệ điều hành khác nhau, bao gồm Windows, Linux, và macOS.
    - Nó cũng hỗ trợ nhiều ngôn ngữ lập trình thông qua các thư viện và trình điều khiển (drivers).

### Storage Engines
- InnoDB: Đây là storage engine mặc định, hỗ trợ các tính năng như ACID, transactions, foreign keys, và row-level locking. InnoDB sử dụng một hệ thống quản lý bộ nhớ riêng để lưu trữ dữ liệu và chỉ mục.

- MyISAM: Là engine nhẹ hơn nhưng không hỗ trợ transactions hoặc khóa ngoại. MyISAM phù hợp cho các ứng dụng đọc nhiều hơn ghi.

- Memory Engine: Lưu dữ liệu trong bộ nhớ RAM, phù hợp cho các bảng tạm thời yêu cầu truy cập nhanh.

- Other Engines: Các engine khác như CSV, Archive, Federated, và NDB Cluster phục vụ cho các nhu cầu đặc biệt.

### Sử Dụng MySQL

#### **Tạo Cơ Sở Dữ Liệu**

```
CREATE DATABASE mydatabase;
```

#### **Tạo Bảng**

```
USE mydatabase;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Thêm Dữ Liệu**

```
INSERT INTO users (name, email) VALUES ('John Doe', 'john.doe@example.com');
```

#### **Truy Vấn Dữ Liệu**

```
SELECT * FROM users;
```

#### **Join**

Trong MySQL, JOIN là một phép toán được sử dụng để kết hợp các hàng từ hai hoặc nhiều bảng dựa trên một điều kiện liên kết giữa các bảng đó.

Các loại JOIN phổ biến bao gồm INNER JOIN và OUTER JOIN (bao gồm LEFT JOIN và RIGHT JOIN).

- **INNER JOIN**

INNER JOIN trả về các hàng khi có ít nhất một hàng khớp nhau trong cả hai bảng được tham gia.

```
SELECT columns
FROM table1
INNER JOIN table2
ON table1.common_column = table2.common_column;
```

- **OUTER JOIN**

OUTER JOIN bao gồm các loại chính: LEFT JOIN và RIGHT JOIN

+ LEFT JOIN: trả về tất cả các hàng từ bảng bên trái (table1) và các hàng khớp từ bảng bên phải (table2). Nếu không có khớp, kết quả từ bảng bên phải sẽ là NULL.

```
SELECT columns
FROM table1
LEFT JOIN table2
ON table1.common_column = table2.common_column;
```

+ RIGHT JOIN trả về tất cả các hàng từ bảng bên phải (table2) và các hàng khớp từ bảng bên trái (table1). Nếu không có khớp, kết quả từ bảng bên trái sẽ là NULL.

# function

- UNIX_TIMESTAMP(pdCD160): lấy timestamp của date
