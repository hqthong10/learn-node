const conn = await pool.getConnection();

try {
  await conn.beginTransaction();

  // 1. create order
  const [orderResult] = await conn.execute(
    `INSERT INTO orders (user_id, total_amount, status)
     VALUES (?, ?, ?)`,
    [userId, totalAmount, 0] // pending
  );

  const orderId = orderResult.insertId;

  // 2. insert order_items
  for (const item of items) {
    await conn.execute(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
       VALUES (?, ?, ?, ?)`,
      [orderId, item.productId, item.quantity, item.price]
    );
  }

  await conn.commit();

  // 3. call payment (OUTSIDE transaction)
  const paymentResult = await callPaymentGateway();

  // 4. update payment + order status
  if (paymentResult.success) {
    await pool.execute(
      `UPDATE orders SET status = 1 WHERE id = ?`,
      [orderId]
    );

    await pool.execute(
      `INSERT INTO payments (order_id, amount, status)
       VALUES (?, ?, ?)`,
      [orderId, totalAmount, 1]
    );
  } else {
    await pool.execute(
      `UPDATE orders SET status = 4 WHERE id = ?`,
      [orderId]
    );
  }

} catch (err) {
  await conn.rollback();
  throw err;
} finally {
  conn.release();
}