-- Tìm những sản phẩm KHÔNG có ai mua trong 30 ngày gần nhất

-- REQUIREMENTS
-- Output:  product_id | product_name
-- Bao gồm:  tất cả sản phẩm chưa bán
-- phải:  chạy nhanh khi:
-- 1M products
-- 50M order_items

-- Bẫy
-- dùng NOT IN sai
-- full scan
-- join sai thứ tự

-- Bài này sẽ test:
-- anti-join
-- index usage
-- query planning


SELECT  id, name
FROM menu_items
WHERE NOT EXISTS (
    SELECT DISTINCT oi.product_id
    FROM orders o
    JOIN order_items oi on oi.order_id = o.id
    WHERE o.status = 3 AND o.created_at >= CURDATE() - INTERVAL 30 DAY
    GROUP BY oi.product_id
)

-- Subquery của bạn KHÔNG liên quan tới menu_items
-- ->

SELECT id, name
FROM menu_items mi
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.status = 3
      AND o.created_at >= CURDATE() - INTERVAL 30 DAY
      AND oi.product_id = mi.id
);

-- hoặc

WITH sell_items_3_month AS (
    SELECT DISTINCT oi.product_id
    FROM orders o
    JOIN order_items oi on oi.order_id = o.id
    WHERE o.status = 3 AND o.created_at >= CURDATE() - INTERVAL 30 DAY
    GROUP BY oi.product_id
)
SELECT p.id, p.name
FROM menu_items mi
LEFT JOIN sell_items_3_month sp ON mi.id = sp.product_id
WHERE sp.product_id IS NULL;

-- DISTINCT và GROUP BY dụng độ nhau, dư thừa

WITH sold_products AS (
    SELECT oi.product_id
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.status = 3
      AND o.created_at >= CURDATE() - INTERVAL 30 DAY
    GROUP BY oi.product_id
)
SELECT mi.id, mi.name
FROM menu_items mi
LEFT JOIN sold_products sp ON mi.id = sp.product_id
WHERE sp.product_id IS NULL;

-- =>>> best

SELECT mi.id, mi.name
FROM menu_items mi
LEFT JOIN order_items oi ON oi.product_id = mi.id
LEFT JOIN orders o ON o.id = oi.order_id
  AND o.status = 3
  AND o.created_at >= CURDATE() - INTERVAL 30 DAY
WHERE o.id IS NULL;