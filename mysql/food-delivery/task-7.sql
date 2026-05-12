-- Tìm top 3 khách hàng chi tiêu nhiều nhất trong 3 tháng gần nhất

-- REQUIREMENTS
-- Tổng final_amount
-- Chỉ tính: status = completed
-- Output:  user_id | total_spent

-- Bẫy
-- sai time range
-- group by sai
-- index không dùng được
-- query chậm khi data lớn

-- Bài này sẽ bắt đầu đụng:
-- aggregation lớn
-- index composite
-- tối ưu thật sự

-- index (status, created_at, user_id, o.final_amount)

SELECT user_id, SUM(final_amount) as total_spent
FROM orders
WHERE status = 3 and created_at >= CURDATE() - INTERVAL 3 MONTH
GROUP BY user_id
ORDER BY total_spent DESC
LIMIT 3
