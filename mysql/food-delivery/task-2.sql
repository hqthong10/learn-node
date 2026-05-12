-- Lấy Top 5 món ăn bán chạy nhất trong tháng hiện tại
-- REQUIREMENTS
-- Tính theo: tổng quantity
-- Chỉ tính: order status = completed
-- Theo: tháng hiện tại
-- DATE_FORMAT(o.created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
-- MONTH(tên_cột_ngay) = MONTH(NOW()) AND YEAR(tên_cột_ngay) = YEAR(NOW())
-- tên_cột_ngay >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY
  AND tên_cột_ngay <= LAST_DAY(NOW());


SELECT items.product_id, mi.name, items.total_sell
FROM (
    SELECT oi.product_id, SUM(oi.quantity) as total_sell
    FROM order_items oi
    JOIN orders o on (o.id = oi.order_id)
    WHERE o.status = 3
        AND o.created_at >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY 
        AND o.created_at <= LAST_DAY(NOW())
    GROUP BY oi.product_id
    ORDER BY total_sell DESC
    LIMIT 5
) as items
JOIN menu_items mi on (mi.id = items.product_id)

-- không lấy ngày cuối vì 00:00:00
-- ->
-- AND o.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')
-- AND o.created_at < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, '%Y-%m-01')
-- or
-- AND o.created_at >= LAST_DAY(NOW() - INTERVAL 1 MONTH) + INTERVAL 1 DAY 
-- AND o.created_at <= LAST_DAY(NOW()) + INTERVAL 1 DAY
-- or
-- DATE_FORMAT(o.created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')

-- ❌ THIẾU FILTER SỚM
-- order_items → JOIN → orders → filter
-- order_items rất to (10M+)
-- join trước → tốn CPU

-- => Filter từ orders trước

SELECT 
  oi.product_id,
  mi.name,
  SUM(oi.quantity) AS total_sell
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN menu_items mi ON mi.id = oi.product_id
WHERE o.status = 3
  AND o.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')
  AND o.created_at < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, '%Y-%m-01')
GROUP BY oi.product_id
ORDER BY total_sell DESC
LIMIT 5;
