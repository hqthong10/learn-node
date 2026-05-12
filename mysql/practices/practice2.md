- e-commerce
1️⃣ Core
User đặt hàng
Mỗi order có nhiều item
Trừ tồn kho
Thanh toán

2️⃣ Business rules (quan trọng)
❌ Không được oversell (bán quá tồn kho)
1 order phải atomic
Payment fail → rollback

3️⃣ Query
Lịch sử đơn hàng
Top sản phẩm bán chạy
Doanh thu theo ngày/tháng
Sản phẩm còn hàng

4️⃣ Scale
100k order/ngày
nhiều user cùng mua 1 sản phẩm (flash sale)

🎯 NHIỆM VỤ CỦA BẠN
🔥 TASK A – SCHEMA DESIGN (RẤT QUAN TRỌNG)
👉 Thiết kế các bảng:
1. users
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NULL,
    status TINYINT NOT NULL DEFAULT 1, -- 1=active, 0=inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY idx_user_time (status, created_at DESC)
) ENGINE=InnoDB;

2. products
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1, -- 1=active
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY idx_products_status_stock (status, stock),
    KEY idx_products_created (created_at DESC)
) ENGINE=InnoDB;

3. orders
CREATE TABLE orders(
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    status TINYINT NOT NULL DEFAULT 0, -- 0=pending,1=paid,2=cancelled
    request_id VARCHAR(100) UNIQUE, -- chống duplicate request
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY idx_orders_user_time (user_id, created_at DESC),
    KEY idx_orders_status_time (status, created_at DESC),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

4. order_items
CREATE TABLE order_items(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
        FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

5. payments
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
) ENGINE=InnoDB;


🔥 TASK B – TRANSACTION (CỰC QUAN TRỌNG)
👉 API: tạo order
Flow:
1. check tồn kho
2. lock product
3. insert order
4. insert order_items
5. trừ stock
6. commit

const conn = await pool.getConnection();

try {
  await conn.beginTransaction();

  // insert order (idempotency bằng UNIQUE)
  const [orderRes]: any = await conn.query(`
    INSERT INTO orders (code, user_id, status, request_id)
    VALUES (?, ?, 0, ?)
  `, [generateOrderCode(), userId, requestId]);

  const orderId = orderRes.insertId;

  let total = 0;

  // sort để tránh deadlock
  carts.sort((a, b) => a.productId - b.productId);

  for (const item of carts) {

    const [res]: any = await conn.query(`
      UPDATE products
      SET stock = stock - ?
      WHERE id = ? AND stock >= ?
    `, [item.quantity, item.productId, item.quantity]);

    if (res.affectedRows === 0) {
      throw new Error('OUT_OF_STOCK');
    }

    const [[product]]: any = await conn.query(`
      SELECT price FROM products WHERE id = ?
    `, [item.productId]);

    const subtotal = product.price * item.quantity;

    await conn.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price)
      VALUES (?, ?, ?, ?)
    `, [orderId, item.productId, item.quantity, product.price]);

    total += subtotal;
  }

  await conn.query(`
    UPDATE orders SET total_amount = ? WHERE id = ?
  `, [total, orderId]);

  await conn.commit();

  return orderId;

} catch (e) {
  try { await conn.rollback(); } catch {}
  throw e;
} finally {
  conn.release();
}


🔥 TASK C – QUERY
Viết SQL:

- Lịch sử đơn hàng của user
await conn.query(`
    SELECT id, code, user_id, total_amount, status
    FROM orders
    WHERE user_id = ? and created_at < ?
    ORDER BY created_at DESC LIMIT 10
`, [userId, cursor]);

- Top 5 sản phẩm bán chạy
await conn.query(`
    SELECT product_id, SUM(oi.quantity) as total_sell
    FROM order_items oi
    JOIN orders o on o.id = oi.order_id
    WHERE o.status = 1
    GROUP BY oi.product_id
    ORDER BY total_sell DESC
    LIMIT 5
`);

hoặc
await conn.query(`
    WITH ProductSales AS (
        SELECT 
            product_id, 
            SUM(quantity) as total_sell
        FROM order_items
        GROUP BY product_id
    )
    SELECT * FROM (
        SELECT 
            product_id, 
            total_sell,
            DENSE_RANK() OVER (ORDER BY total_sell DESC) as ranking
        FROM ProductSales
    ) AS RankedProducts
    WHERE ranking <= 5;
`);

- Doanh thu hôm nay
 amount, status = 1, paid_at
await conn.query(`
    SELECT SUM(amount) as total
    FROM payments
    WHERE status = 1
        and paid_at >= ? AND paid_at < DATE_ADD(?, INTERVAL 1 DAY)
`, [today, today]);

- Sản phẩm còn hàng
await conn.query(`
    SELECT id, name, stock
    FROM products
    WHERE status = 1 and stock > 0
    ORDER BY created_at DESC
`);

🔥 TASK D – PERFORMANCE
- Lịch sử đơn hàng của user
- Top 5 sản phẩm bán chạy
- Doanh thu hôm nay
- Sản phẩm còn hàng
👉 Trả lời:

1. Query nào sẽ chậm khi data lớn?
- đang hỏi những query đã làm ở trên?
-> Top 5 sản phẩm bán chạy

2. Index nào critical nhất?
- đang hỏi những index đã dùng ở trên?
order_items: (order_id, product_id)

3. Nếu 10M orders → scale sao?
- scale orders?
-> dùng partition theo tháng, tạo 1 bảng mới lưu những order nhiều năm trước
- scale query chậm nhất?
-> tạo 1 cột số_lượng_đã_bán trong products

4. Query nào cần cache?
-> Doanh thu hôm nay

🔥 TASK E – EDGE CASE
2 user mua cùng 1 sản phẩm
payment fail
duplicate request (bấm 2 lần)
