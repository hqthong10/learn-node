- users
id BIGINT PK
name VARCHAR(100)
email VARCHAR(255) UNIQUE

- vehicles
id BIGINT PK
plate_number VARCHAR(20) UNIQUE
user_id BIGINT
type TINYINT

- parking_slots
id BIGINT PK
zone VARCHAR(50)
status TINYINT

- vehicle_logs (QUAN TRỌNG NHẤT)
id BIGINT PK
vehicle_id BIGINT
slot_id BIGINT
in_time DATETIME
out_time DATETIME
status TINYINT
fee DECIMAL(10,2)

- payments
id BIGINT PK
log_id BIGINT
amount DECIMAL
status TINYINT
created_at TIMESTAMP

# practice
TASK 1: Bạn thiết kế lại DDL full chuẩn production

- users:
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

- vehicles
CREATE TABLE vehicles(
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    type TINYINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_vehicle FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
)
CREATE INDEX idx_vehicle_user ON vehicles(user_id);

- parking_slots
CREATE TABLE parking_slots(
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    zone VARCHAR(50) NOT NULL,
    status TINYINT NOT NULL COMMENT '1=USED,2=NOT USE, 3=LOCKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE INDEX idx_slot_status ON parking_slots (status, zone);

- vehicle_logs
CREATE TABLE vehicle_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT UNSIGNED NOT NULL,
    slot_id BIGINT UNSIGNED NOT NULL,
    in_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    out_time TIMESTAMP NULL,
    status TINYINT NOT NULL COMMENT '1=IN,2=OUT',
    fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_vehicle_time (vehicle_id, in_time DESC),
    KEY idx_status_time (status, in_time),
    
    CONSTRAINT fk_vehiclelog_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_vehiclelog_slot FOREIGN KEY (slot_id) REFERENCES parking_slots(id) ON DELETE CASCADE,
)

- payments
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    log_id BIGINT UNSIGNED,
    amount DECIMAL(10,2) NOT NULL,
    status TINYINT NOT NULL COMMENT '1=PENDING,2=FINISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_log_id (log_id),

    CONSTRAINT fk_payment_log FOREIGN KEY (log_id) REFERENCES vehicle_logs(id) ON DELETE CASCADE,
)
CREATE INDEX idx_payment_time ON payments (status, created_at);


🔥 TASK 2 – Query cơ bản

- Lấy 10 xe vào gần nhất
SELECT vl.vehicle_id, v.plate_number, v.type
FROM vehicle_logs vl
JOIN vehicles v ON (vl.vehicle_id = v.id)
WHERE vl.status = 1
ORDER BY vl.in_time DESC
LIMIT 10;

- Lấy tất cả xe đang trong bãi
SELECT vl.vehicle_id, v.plate_number, v.type
FROM vehicle_logs vl
JOIN vehicles v ON (vl.vehicle_id = v.id)
WHERE vl.status = 1 AND vl.out_time IS NULL;
Hoặc
SELECT *
FROM (
  SELECT vl.*,
         ROW_NUMBER() OVER (PARTITION BY vehicle_id ORDER BY in_time DESC) rn
  FROM vehicle_logs vl
) t
WHERE rn = 1 AND status = 1;

- Tính tổng tiền hôm nay
SELECT SUM(amount)
FROM payments
WHERE status = 2 -- 1=PENDING,2=FINISHED
    and created_at >= CURDATE() AND created_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY);

- Tìm user có nhiều xe nhất
SELECT u.id, u.name, u.email, COUNT(*) AS num_vehicles
FROM vehicles v
JOIN users u ON v.user_id = u.id
GROUP BY u.id
ORDER BY num_vehicles DESC
LIMIT 1;

Hoặc nếu có nhiều người cùng top
SELECT *
FROM (
  SELECT u.id, u.name, u.email, COUNT(*) AS num_vehicles
  FROM vehicles v
  JOIN users u ON v.user_id = u.id
  GROUP BY u.id
) t
WHERE num_vehicles = (
  SELECT MAX(cnt)
  FROM (
    SELECT COUNT(*) AS cnt
    FROM vehicles
    GROUP BY user_id
  ) x
);
Hoặc window function (best)
SELECT *
FROM (
  SELECT u.id, u.name, u.email,
         COUNT(*) AS num_vehicles,
         RANK() OVER (ORDER BY COUNT(*) DESC) rnk
  FROM vehicles v
  JOIN users u ON v.user_id = u.id
  GROUP BY u.id
) t
WHERE rnk = 1;



🚀 PHASE 3 – INDEX & PERFORMANCE
🔥 TASK 3

Cho query:

SELECT *
FROM vehicle_logs
WHERE vehicle_id = ?
ORDER BY in_time DESC
LIMIT 20;

👉 Bạn:
thiết kế index: idx_vehicle_time (vehicle_id, in_time DESC)
giải thích: index theo đúng thứ tự để được áp dụng hiệu quả
EXPLAIN mong đợi: type = const, possible_keys = idx_vehicle_time, key = idx_vehicle_time, Extra: Using index condition, rows = số dòng kết quả trả về


🚀 PHASE 4 – TRANSACTION
🔥 TASK 4 – Xe vào bãi
Yêu cầu:
check còn slot không
insert log
update slot
tránh race condition

👉 Viết SQL transaction
await conn.beginTransaction();

const [rows]: any = await conn.query(`
  SELECT id
  FROM parking_slots
  WHERE status = 2
  ORDER BY id
  LIMIT 1
  FOR UPDATE
`);

if (rows.length === 0) {
  throw new Error('NO_SLOT');
}

const slotId = rows[0].id;

await conn.query(`
  UPDATE parking_slots
  SET status = 1
  WHERE id = ? AND status = 2
`, [slotId]);

await conn.query(`
  INSERT INTO vehicle_logs (vehicle_id, slot_id, in_time, status)
  VALUES (?, ?, NOW(), 1)
`, [vehicleId, slotId]);

await conn.commit();



🚀 PHASE 6 – REPORT (SQL nâng cao)
🔥 TASK 6
- Doanh thu theo ngày
await conn.query(`
  SELECT SUM(amount)
    FROM payments
    WHERE status = 2
        and created_at >= DATE(?) AND created_at < DATE_ADD(DATE(?), INTERVAL 1 DAY)
`, [dayFilter, dayFilter]);

- Top 5 xe vào nhiều nhất
await conn.query(`
    SELECT vehicle_id, COUNT(*) as times_in
    FROM vehicle_logs
    GROUP BY vehicle_id
    ORDER BY times_in DESC
    LIMIT 5
`)

- Thời gian đỗ trung bình
SLECT AVG(t.parking_time)
FROM (SELECT id, TIMESTAMPDIFF(MINUTE, in_time, out_time) as parking_time
    FROM vehicle_logs
    WHERE in_time is not null and out_time is not null) as t




🚀 PHASE 7 – CACHE (Redis)
🔥 TASK 7

Cache:

GET /vehicle/:id

👉 xử lý:

cache aside
stampede
invalidation