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

### Các nhóm SQL:

- DDL (Data Definition Language)
    - Ngôn ngữ định nghĩa dữ liệu (DDL) là một tập hợp con của SQL. Chức năng chính của nó là tạo, sửa đổi và xóa cấu trúc cơ sở dữ liệu chứ không phải dữ liệu.
    - CREATE, ALTER, DROP

- DML (Data Manipulation Language) : Ngôn ngữ thao tác dữ liệu
    - DML là một tiểu thể loại của SQL, viết tắt của Ngôn ngữ thao tác dữ liệu. Mục đích của DML là chèn, truy xuất, cập nhật và xóa dữ liệu khỏi cơ sở dữ liệu. Với điều này, chúng ta có thể thực hiện các thao tác trên các bản ghi hiện có.
    - INSERT, UPDATE, DELETE

- DQL: SELECT
- DCL: GRANT, REVOKE
- TCL: COMMIT, ROLLBACK

### Lock level

- Row Lock (Record Lock):
    - Lock trực tiếp vào một row cụ thể trong index.
    - Phải có index
      SELECT \* FROM users
      WHERE id = 2
      FOR UPDATE;

- Gap Lock:
    - lock khoảng giữa các index value
    - Mục đích chặn INSERT vào khoảng đó
      SELECT \*
      FROM users
      WHERE id BETWEEN 10 AND 20
      FOR UPDATE;

- Next-Key Lock:
    - Đây là default behavior của InnoDB trong REPEATABLE READ.
      SELECT \*
      FROM users
      WHERE id >= 20
      FOR UPDATE;

### Sử Dụng MySQL

#### **Tạo Cơ Sở Dữ Liệu**

    CREATE DATABASE mydatabase;

#### **Tạo Bảng**

USE mydatabase;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    post_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES users(id)
)

#### Tạo Index
CREATE INDEX ten_index ON ten_bang (ten_cot);
vd:
CREATE INDEX idx_ho_ten ON sinhvien (ho_ten);
CREATE INDEX idx_id_mail ON sinhvien (id, email);

#### **Thêm Dữ Liệu**

INSERT INTO users (name, email) VALUES ('John Doe', 'john.doe@example.com');

#### **Truy Vấn Dữ Liệu**

SELECT \* FROM users;

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

- LEFT JOIN: trả về tất cả các hàng từ bảng bên trái (table1) và các hàng khớp từ bảng bên phải (table2). Nếu không có khớp, kết quả từ bảng bên phải sẽ là NULL.

```
SELECT columns
FROM table1
LEFT JOIN table2
ON table1.common_column = table2.common_column;
```

- RIGHT JOIN trả về tất cả các hàng từ bảng bên phải (table2) và các hàng khớp từ bảng bên trái (table1). Nếu không có khớp, kết quả từ bảng bên trái sẽ là NULL.

### Transaction

một nhóm query phải thành công cùng nhau

### ACID:

1. A - Atomicity: tính nguyên tử

- Tất cả hoặc không gì
- Một transaction phải hoàn thành toàn bộ, nếu có lỗi thì rollback toàn bộ.

2. C - Consistency: tính nhất quán

- dữ liệu luôn hợp lệ
- Sau mỗi transaction, dữ liệu phải tuân thủ tất cả rule của database

3. I - Isolation: tính cô lập

- transaction không phá nhau
- Khi nhiều transaction chạy cùng lúc, mỗi transaction không nhìn thấy dữ liệu “bẩn” của transaction khác.

4. D - Durability: tính bền

- commit là vĩnh viễn
- Data không bị mất, kể cả:server crash, mất điện, restart database

# notice
- join nhanh hơn subquery
- where Lọc trước GROUP, having Lọc sau GROUP, WHERE nhanh hơn HAVING
- EXISTS dừng sớm,Tốt khi bảng con lớn, IN → Materialize list → tốn RAM
- không nên dùng function trong where vì index sẽ không áp dụng
- Index quá nhiều → INSERT chậm
- Không index → SELECT chậm
- LIKE '%abc' không dùng index: vì Index là B-Tree có thứ tự nên % ở đầu thì không biết bắt đầu tìm từ đâu

# function

- UNIX_TIMESTAMP(pdCD160): lấy timestamp của date
- Show index [table]: hiển thị tất cả index của 1 table

- SUBSTR
  SELECT SUBSTR('Hello World', 7, 5); -- Kết quả: 'World'
  SELECT SUBSTR('Hello World', -5, 5); -- Kết quả: 'World'
  SELECT SUBSTR('Hello World' from 7 for 5); -- Kết quả: 'World'

- BIT_AND(expr) Thực hiện phép AND bitwise trên tất cả các giá trị.
- BIT_OR(expr) Thực hiện phép OR bitwise trên tất cả các giá trị.
- BIT_XOR(expr) Thực hiện phép XOR bitwise trên tất cả các giá trị.
- STDDEV(expr) Tính độ lệch chuẩn mẫu (sample standard deviation).
- STDDEV_POP(expr) Tính độ lệch chuẩn tổng thể (population standard deviation).
- STDDEV_SAMP(expr) Tính độ lệch chuẩn mẫu (sample standard deviation).
- VAR_POP(expr) Tính phương sai tổng thể (population variance).
- VAR_SAMP(expr) Tính phương sai mẫu (sample variance).
- VARIANCE(expr) Alias của VAR_SAMP().
- GROUP_CONCAT(expr) Ghép các giá trị thành chuỗi, có thể sắp xếp, phân tách bằng dấu phẩy.
- JSON_ARRAYAGG(expr) Gom các giá trị thành mảng JSON.
- JSON_OBJECTAGG(key, value) Gom thành đối tượng JSON với cặp key–value.
- ROW_NUMBER() Gán số thứ tự cho mỗi hàng trong cửa sổ.
- RANK() Gán hạng (rank) cho hàng, có thể bỏ qua số nếu hạng trùng.
- DENSE_RANK() Giống RANK(), nhưng không bỏ qua số khi hạng trùng.
- PERCENT_RANK() Tính tỷ lệ phần trăm hạng của hàng trong nhóm (0 → 1).
- CUME_DIST() Tính phân phối tích lũy (cumulative distribution) – tỷ lệ số hàng ≤ giá trị hiện tại.
- NTILE(n) Chia cửa sổ thành n nhóm (tiles) gần bằng nhau và trả về nhóm của từng hàng.
- LAG(expr [, offset [, default]]) Truy cập giá trị trước đó trong cửa sổ.
- LEAD(expr [, offset [, default]]) Truy cập giá trị sau đó trong cửa sổ.
- FIRST_VALUE(expr) Lấy giá trị đầu tiên trong cửa sổ hiện tại.
- LAST_VALUE(expr) Lấy giá trị cuối cùng trong cửa sổ hiện tại.
- NTH_VALUE(expr, n) Lấy giá trị thứ n trong cửa sổ hiện tại.

- date_add(pdCD160, interval (pnDIFFE\*60) minute)
- date_format(dUNTIL, '%d.%m.%Y')
- str_to_date(str, '%d.%m.%Y %H:%i')

- TIMESTAMPDIFF tính chênh lệch thời gian giữa hai timestamp theo đơn vị
  TIMESTAMPDIFF(minute, sysdate(), mydatetime)

# command
- Phân tích lại table để tối ưu hóa
    ANALYZE TABLE mytable