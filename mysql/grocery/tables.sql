-- suppliers
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE,        -- mã nội bộ
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  unit_price DECIMAL(12,2) NOT NULL, -- bán lẻ
  cost_price DECIMAL(12,2),          -- giá vốn
  quantity_in_stock INT DEFAULT 0,
  supplier_id BIGINT UNSIGNED REFERENCES suppliers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- qr_codes: map mã QR -> product hoặc thông tin bán lẻ
CREATE TABLE qr_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL, -- nội dung QR (ví dụ: "prod:SKU1234" hoặc UUID)
  product_id BIGINT UNSIGNED REFERENCES products(id),
  type VARCHAR(50) DEFAULT 'product', -- 'product', 'promo', 'info'
  created_at TIMESTAMP DEFAULT NOW()
);

-- customers (khách hàng thân thiết)
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(50) UNIQUE,
  name VARCHAR(200),
  email VARCHAR(200),
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- employees
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  role VARCHAR(50),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- invoices (hóa đơn bán)
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(50) UNIQUE NOT NULL,
  employee_id BIGINT UNSIGNED REFERENCES employees(id),
  customer_id BIGINT UNSIGNED REFERENCES customers(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
  total_amount DECIMAL(12,2) DEFAULT 0,
  payment_method VARCHAR(50), -- cash, card, momo, zalo, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- invoice_items
CREATE TABLE invoice_items (
  invoice_id BIGINT UNSIGNED REFERENCES invoices(id),
  product_id BIGINT UNSIGNED REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2),
  PRIMARY KEY(invoice_id, product_id)
);

-- import receipts (nhập hàng)
CREATE TABLE import_receipts (
  id SERIAL PRIMARY KEY,
  receipt_no VARCHAR(50) UNIQUE,
  supplier_id BIGINT UNSIGNED REFERENCES suppliers(id),
  employee_id BIGINT UNSIGNED REFERENCES employees(id),
  total_amount DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- import items
CREATE TABLE import_items (
  receipt_id BIGINT UNSIGNED REFERENCES import_receipts(id),
  product_id BIGINT UNSIGNED REFERENCES products(id),
  quantity INT,
  import_price DECIMAL(12,2),
  PRIMARY KEY(receipt_id, product_id)
);

-- inventory_movements: lưu lịch sử tăng/giảm tồn kho
CREATE TABLE IF NOT EXISTS inventory_movements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  change_qty INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  related_id BIGINT UNSIGNED, -- invoice_id, receipt_id, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;


-- loyalty points history
CREATE TABLE loyalty_history (
  id SERIAL PRIMARY KEY,
  customer_id BIGINT UNSIGNED REFERENCES customers(id),
  invoice_id BIGINT UNSIGNED REFERENCES invoices(id),
  points_change INT,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO suppliers (name, phone, address)
VALUES ('Công ty TNHH ABC', '0909123456', '123 Nguyễn Trãi, Q5, TP.HCM');

INSERT INTO products (sku, name, category, unit_price, cost_price, quantity_in_stock, supplier_id)
VALUES 
('SP001', 'Coca Cola 330ml', 'Nước giải khát', 10000, 7000, 100, 1),
('SP002', 'Snack Oishi', 'Bánh kẹo', 8000, 5000, 200, 1),
('SP003', 'Mì ly Hảo Hảo', 'Thực phẩm', 12000, 8000, 150, 1);

INSERT INTO qr_codes (code, product_id) VALUES
('prod:SP001', 1),
('prod:SP002', 2),
('prod:SP003', 3);

INSERT INTO employees (name, role, phone)
VALUES ('Nguyễn Văn A', 'cashier', '0909111222');
