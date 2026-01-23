# Các nhóm SQL:
DDL: CREATE, ALTER, DROP
DML: INSERT, UPDATE, DELETE
DQL: SELECT
DCL: GRANT, REVOKE
TCL: COMMIT, ROLLBACK

# create table
CREATE TABLE vehicles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  plate_number VARCHAR(20) NOT NULL,
  type TINYINT NOT NULL COMMENT '1=bike,2=car',
  owner_id BIGINT UNSIGNED NOT NULL,
  status TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_plate_number (plate_number),
  KEY idx_owner_id (owner_id)
) ENGINE=InnoDB;


+ id nên dùng BIGINT vì đảm bảo hệ thống lớn lên, nhiều record hơn
+ TIMESTAMP có timezone, DATETIME không có timezone
+ PK nên: nhỏ, tăng dần, không đổi, dùng UUID random → fragment disk
+ nên tránh dùng TEXT vì: Không giới hạn, Không index toàn bộ, Chậm hơn
+ nên tránh NULL vì: NULL phá index, Logic phức tạp, Query chậm

+ Index quá nhiều → INSERT chậm
+ Không index → SELECT chậm
+ LIKE '%abc' không dùng index: vì Index là B-Tree có thứ tự nên % ở đầu thì không biết bắt đầu tìm từ đâu


# InnoDB có gì?
- Transaction (ACID):
A	Atomicity – tất cả hoặc không gì
C	Consistency – dữ liệu hợp lệ
I	Isolation – không ảnh hưởng lẫn nhau
D	Durability – commit là sống

- Row-level lock
- Foreign key
- Crash recovery
- MVCC: Multi-Version Concurrency Control
Khi bạn SELECT:
Không block UPDATE
Không bị dirty read

+ InnoDB lock row, nhưng không có index thì sẽ lock table

# Index
Index = B-Tree được sắp xếp
Không phải hash map
Không phải magic

Mỗi index: Tốn disk, Tốn RAM, Làm INSERT/UPDATE chậm hơn
Index là trade-off (sự đánh đổi)

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_owner_status ON vehicles(owner_id, status);

Function trên column = bỏ index
✅ WHERE email = ?
❌ WHERE LOWER(email) = ?

WHERE nên theo thứ tự của index
✅ WHERE owner_id = ? and status = ?
❌ WHERE status = ? and owner_id = ?

SELECT * FROM mytable
WHERE owner_id = ?
ORDER BY created_at DESC
LIMIT 10;

✅ Index đúng (owner_id, created_at)
❌ Index sai: (created_at, owner_id)

- Vì sao có index nhưng vẫn chậm?
+ Low selectivity: quá nhiều giá trị giống nhau
+ Index sai thứ tự: không match query
+ Query trả nhiều row: LIMIT không cứu
+ Using filesort: ORDER BY không dùng index
+ dùng SELECT *