CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE restaurants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_support VARCHAR(20) NOT NULL,
    adrress VARCHAR(200) NOT NULL,
    status TINYINT DEFAULT 1, -- 1=active, 0=inactive
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE menu_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT UNSIGNED,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    status TINYINT DEFAULT 1, -- 1=active, 0=inactive
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    KEY idx_menu_restaurant (restaurant_id)
)

CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,

    user_id BIGINT UNSIGNED NOT NULL,
    restaurant_id BIGINT UNSIGNED NOT NULL,
    restaurant_name VARCHAR(100) NOT NULL,

    total_amount DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    final_amount DECIMAL(15,2) NOT NULL,
    
    status TINYINT NOT NULL DEFAULT 0, -- 0 = pending, 1 = paid, 2 = delivering, 3 = completed, 4 = cancelled
    request_id VARCHAR(100) UNIQUE, -- chống duplicate request

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY idx_orders_user_time (user_id, created_at DESC),
    KEY idx_orders_status_time (status, created_at DESC),
    KEY idx_orders_restaurant_time (restaurant_id, created_at),
    KEY idx_orders_created_at orders(created_at),

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_restaurant
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
)

CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    subtotal DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,

    KEY idx_items_order (order_id),
    KEY idx_items_product (product_id),

    UNIQUE KEY uk_order_product (order_id, product_id),

    CONSTRAINT fk_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

    CONSTRAINT fk_items_product
        FOREIGN KEY (product_id) REFERENCES menu_items(id)
)

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    
    amount DECIMAL(15,2) NOT NULL,
    method TINYINT NOT NULL, -- 1=cash,2=bank,3=card,4=momo,
    status TINYINT NOT NULL DEFAULT 0, -- 0=pending,1=success,2=fail,
    transaction_ref VARCHAR(255) UNIQUE,

    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    KEY idx_payments_order (order_id),
    KEY idx_payments_status_time (status, created_at),

    CONSTRAINT fk_payments_order 
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
)

CREATE TABLE promotions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    
    max_discount_amount DECIMAL(15, 2),
    min_order_value DECIMAL(15, 2) DEFAULT 0,
    
    usage_limit INT UNSIGNED DEFAULT NULL,
    used_count INT UNSIGNED DEFAULT 0,
    
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    
    status TINYINT(1) DEFAULT 1, -- 1: Hoạt động, 0: Tạm dừng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE order_promotions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    promotion_id BIGINT UNSIGNED NOT NULL,
    discount_amount DECIMAL(15, 2) NOT NULL, -- Lưu số tiền được giảm tại thời điểm đó

    KEY idx_order_promotions_order (order_id),
    KEY idx_order_promotions_promotion (promotion_id),
    
    CONSTRAINT fk_op_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_op_promo FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);