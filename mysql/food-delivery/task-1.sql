-- Lấy 10 đơn hàng gần nhất của 1 user, bao gồm:
-- order info
-- danh sách món (name, quantity, unit_price)
-- tổng tiền sau giảm (final_amount)
-- REQUIREMENTS
-- Không được N+1 query
-- Phải dùng JOIN
-- Query phải chạy tốt khi:
--    + 1M orders
--    + 5M order_items


SELECT o.id, o.code, o.user_id, o.restaurant_id, o.restaurant_name, o.total_amount
    , o.discount_amount, o.final_amount, o.status
    , mi.name, oi.quantity, oi.unit_price, o.final_amount
FROM orders o
JOIN order_items oi on (oi.order_id = o.id)
JOIN menu_items mi on (mi.id = oi.product_id)
WHERE o.user_id = userID
ORDER BY o.created_at DESC
LIMIT 10

-- Limit sai, cần load1 10 order trước =>

SELECT 
  o.id, o.code, o.user_id, o.restaurant_id, o.restaurant_name,
  o.total_amount, o.discount_amount, o.final_amount, o.status,
  mi.name AS product_name,
  oi.quantity,
  oi.unit_price
FROM (
  SELECT *
  FROM orders
  WHERE user_id = ?
  ORDER BY created_at DESC
  LIMIT 10
) o
JOIN order_items oi ON oi.order_id = o.id
JOIN menu_items mi ON mi.id = oi.product_id;

-- khó dọc kết quả -> MySQL 8 JSON =>

SELECT 
  o.id,
  o.code,
  o.final_amount,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'product_name', mi.name,
      'quantity', oi.quantity,
      'price', oi.unit_price
    )
  ) AS items
FROM (
  SELECT *
  FROM orders
  WHERE user_id = ?
  ORDER BY created_at DESC
  LIMIT 10
) o
JOIN order_items oi ON oi.order_id = o.id
JOIN menu_items mi ON mi.id = oi.product_id
GROUP BY o.id;