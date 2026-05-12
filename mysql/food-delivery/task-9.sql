-- Lấy danh sách order của user (pagination)

-- Yêu cầu
-- page, limit
-- sort theo created_at DESC
-- data lớn: 10M orders

-- Bẫy
-- OFFSET chậm
-- pagination sai
-- index không dùng được

-- Đây là bài:
-- 100% gặp ngoài đời
-- rất nhiều dev làm sai


SELECT id, user_id, restaurant_name, total_amount, discount_amount, final_amount, status, created_at
FROM orders 
WHERE user_id = ?
  AND (
    created_at < ?
    OR (created_at = ? AND id < ?)
  )
ORDER BY created_at DESC, id DESC 
LIMIT 10;

CREATE INDEX idx_orders_user_created_id 
ON orders(user_id, created_at DESC, id DESC);

[userId, lastCreatedAt, lastId]


-- => best 
SELECT id, user_id, restaurant_name
       , total_amount, discount_amount, final_amount
       , status, created_at
FROM orders
WHERE user_id = ?
  AND (
    created_at < ?
    OR (created_at = ? AND id < ?)
  )
ORDER BY created_at DESC, id DESC
LIMIT 10;
