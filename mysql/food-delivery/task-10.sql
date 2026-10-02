-- Tìm kiếm danh sách đơn hàng của user
--
-- REQUIREMENTS
-- Input: 
-- user_id, status (optional), keyword (optional):
-- tìm theo: order.code, restaurant_name
-- thời gian: from_date, to_date (optional)

-- 📤 Output:
-- pagination (keyset, không dùng OFFSET)
-- sort: created_at DESC, id DESC

-- DATA SCALE
-- orders: 20M rows

-- ĐÂY LÀ CÁI KHÓ
-- Query phải handle:

-- filter động:
-- có thể có hoặc không status
-- có thể có hoặc không keyword
-- có thể có hoặc không date range

-- nhưng vẫn phải:
-- dùng index tốt
-- không full scan

-- BẪY (99% dev dính)
-- dùng: WHERE (status = ? OR ? IS NULL)
-- → ❌ kill index

-- dùng: LIKE '%keyword%'
-- → ❌ scan toàn table

-- Go

SELECT user_id, o.id, o.restaurant_name, o.status, o.created_at, o.final_amount
FROM orders o
WHERE o.user_id = @user_id
    AND (@status IS NULL OR o.status = @status)
    AND (
        @keyword IS NULL 
        OR code = @keyword 
        OR restaurant_name LIKE CONCAT('%', @keyword, '%')
    )
    AND (@from_date IS NULL OR created_at >= @from_date)
    AND (@to_date IS NULL OR created_at < @to_date + INTERVAL 1 DAY)
    AND (
        (@last_created_at IS NULL AND @last_id IS NULL)
        OR (created_at < @last_created_at)
        OR (created_at = @last_created_at AND id < @last_id)
    )
ORDER BY created_at DESC, id DESC
LIMIT @limit_size;

CREATE INDEX idx_user_filters_pagination 
ON orders(user_id, status, created_at, id);