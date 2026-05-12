-- Thống kê doanh thu theo ngày trong 30 ngày gần nhất

-- REQUIREMENTS
-- trả về: date | total_revenue
-- chỉ tính:  order status = completed
-- phải:  fill đủ ngày (kể cả ngày không có order)

-- Bẫy
-- thiếu ngày
-- full scan
-- sai time range

-- OUTPUT
-- SELECT ...

-- Bài này sẽ đụng:
-- date series
-- aggregation
-- production query mindset

SELECT DATE(o.created_at) as order_date, SUM(final_amount) as daily_total
FROM orders o
WHERE o.status = 3 AND o.created_at >= CURDATE() - INTERVAL 30 DAY
GROUP BY DATE(o.created_at)
ORDER BY order_date DESC

-- chưa lấy những ngày không có hóa đơn
-- ->

WITH RECURSIVE calendar AS (
    SELECT CURDATE() - INTERVAL 29 DAY AS date_series
    UNION ALL
    SELECT date_series + INTERVAL 1 DAY
    FROM calendar
    WHERE date_series < CURDATE()
)

SELECT 
    c.date_series AS order_date,
    COALESCE(SUM(o.final_amount), 0) AS daily_total
FROM calendar c
LEFT JOIN orders o ON (o.status = 3 AND DATE(o.created_at) = c.date_series)
GROUP BY c.date_series
ORDER BY c.date_series DESC;

-- không dùng được index vì function
-- ->

WITH RECURSIVE calendar AS (
    SELECT CURDATE() - INTERVAL 29 DAY AS date_series
    UNION ALL
    SELECT date_series + INTERVAL 1 DAY
    FROM calendar
    WHERE date_series < CURDATE()
)

SELECT 
    c.date_series AS order_date,
    COALESCE(SUM(o.final_amount), 0) AS daily_total
FROM calendar c
LEFT JOIN orders o 
    ON o.status = 3
    AND o.created_at >= c.date_series
    AND o.created_at < c.date_series + INTERVAL 1 DAY
GROUP BY c.date_series
ORDER BY c.date_series DESC;