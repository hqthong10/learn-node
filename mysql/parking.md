## Thiết kế hệ thống quản lý bãi giữ xe cho tòa nhà / chung cư.

# Features
- Register cars/motorbikes for residents & guests
- Record entry/exit times
- Charge parking fees automatically
- Manage employees and shifts

# Entity Analysis
- Employee: Nhân viên bảo vệ, quản lý
- Vehicle: Xe được đăng ký hoặc vãng lai
- Customer: Chủ xe (cư dân hoặc khách)
- Card: Thẻ từ / QR dùng ra vào
- Parking_Log: Ghi nhận lượt vào/ra
- Fee_Plan: Biểu phí theo loại xe

# Xác định quan hệ giữa các bảng
- Customer – Vehicle: 1–n -> Một khách có thể có nhiều xe
- Vehicle – Parking_Log: 1–n -> Một xe có nhiều lượt ra vào
- Card – Vehicle: 1–1 -> Một thẻ gắn với một xe
- Fee_Plan – Vehicle: 1–n -> Nhiều xe cùng loại dùng 1 biểu phí
- Employee – Parking_Log: 1–n -> Một nhân viên ghi nhận nhiều lượt

# Logical Design
- customers
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    type ENUM('resident', 'guest') DEFAULT 'resident',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

- vehicles
CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('car', 'motorbike') NOT NULL,
    customer_id INT,
    fee_plan_id INT,
    card_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (fee_plan_id) REFERENCES fee_plans(fee_plan_id),
    FOREIGN KEY (card_id) REFERENCES cards(card_id)
);

- fee_plans
CREATE TABLE fee_plans (
    fee_plan_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type ENUM('car', 'motorbike') NOT NULL,
    fee_per_hour DECIMAL(10,2),
    monthly_fee DECIMAL(10,2)
);

- employees
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    position ENUM('guard', 'manager'),
    shift ENUM('morning', 'evening', 'night')
);

- parking_logs
CREATE TABLE parking_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    employee_id INT,
    entry_time DATETIME,
    exit_time DATETIME,
    total_fee DECIMAL(10,2),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

- cards
CREATE TABLE cards (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    card_code VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

# Normalization
- 1NF (First Normal Form):	Mỗi cột chỉ chứa 1 giá trị (atomic).
- 2NF (Second Normal Form): Không phụ thuộc một phần vào khóa chính.
- 3NF (Third Normal Form): Không phụ thuộc vào cột không khóa.

# Entity Relationship Diagram
CUSTOMERS (1) ——< (n) VEHICLES (1) ——< (n) PARKING_LOGS
                          │
                          ├── (1) FEE_PLANS
                          └── (1) CARDS
EMPLOYEES (1) ——< (n) PARKING_LOGS
