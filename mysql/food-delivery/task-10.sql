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

