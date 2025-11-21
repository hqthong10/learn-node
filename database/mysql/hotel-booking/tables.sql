CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(15),
  type ENUM('regular','vip') DEFAULT 'regular',
  created_at DATETIME DEFAULT NOW()
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(10),
  type ENUM('standard','deluxe','suite'),
  price_per_night DECIMAL(10,2),
  status ENUM('available','occupied','maintenance') DEFAULT 'available'
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  room_id INT,
  check_in DATETIME,
  check_out DATETIME,
  total_room_price DECIMAL(10,2),
  total_service_price DECIMAL(10,2)
  final_total DECIMAL(10,2),
  payment_status ENUM('pending','paid'),
  status ENUM('confirmed','checked_in','checked_out','cancelled'),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2)
);

CREATE TABLE booking_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  service_id INT,
  quantity INT,
  price_at_time DECIMAL(10,2)    -- GIÁ dịch vụ tại thời điểm sử dụng
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

INSERT INTO customers (name, phone, type) VALUES
('Nguyen Van A', '0909123456', 'regular'),
('Le Thi B', '0909555666', 'vip'),
('Tran Van C', '0911222333', 'regular');

INSERT INTO rooms (room_number, type, price_per_night, status) VALUES
('101', 'standard', 500000, 'available'),
('102', 'standard', 500000, 'available'),
('103', 'standard', 500000, 'available'),
('104', 'deluxe', 800000, 'available'),
('105', 'deluxe', 800000, 'available'),
('106', 'suite', 1200000, 'available');
('201', 'standard', 500000, 'available'),
('202', 'standard', 500000, 'available'),
('203', 'standard', 500000, 'available'),
('204', 'deluxe', 800000, 'available'),
('205', 'deluxe', 800000, 'available'),
('206', 'suite', 1200000, 'available');

INSERT INTO services (name, price) VALUES
('Breakfast', 100000),
('Laundry', 150000),
('Minibar', 50000),
('Coffee', 30000);

INSERT INTO bookings (customer_id, room_id, check_in, check_out, total_price, status) VALUES
(1, 1, '2025-11-01', '2025-11-03', 1000000, 'checked_out'),
(2, 2, '2025-11-02', '2025-11-04', 1600000, 'checked_out'),
(2, 3, '2025-11-05', '2025-11-07', 2400000, 'checked_in'),
(3, 1, '2025-11-07', '2025-11-09', 1000000, 'confirmed');