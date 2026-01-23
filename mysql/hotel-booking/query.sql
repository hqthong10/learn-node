-- Bài 1: Tổng doanh thu theo ngày
SELECT DATE(check_out) AS date, SUM(total_price) AS revenue
FROM bookings
WHERE status = 'checked_out'
GROUP BY DATE(check_out)
ORDER BY DATE(check_out);

-- typeorm
-- const data = await dataSource
--   .getRepository(Booking)
--   .createQueryBuilder('b')
--   .select('DATE(b.check_out)', 'date')
--   .addSelect('SUM(b.total_price)', 'revenue')
--   .where("b.status = 'checked_out'")
--   .groupBy('DATE(b.check_out)')
--   .orderBy('DATE(b.check_out)', 'ASC')
--   .getRawMany();

-- Bài 2: Doanh thu theo loại phòng
SELECT r.type, SUM(b.total_price) as revenue
FROM bookings b
LEFT JOIN room r ON r.id = b.room_id
WHERE b.status = 'checked_out'
GROUP BY r.type;

-- const data = await datasource.getRepository(Booking)
--     .createQueryBuilder('b')
--     .leftJoin('b.room', 'r')
--     .select('r.type', 'type')
--     .addSelect('SUM(b.total_price)', 'revenue')
--     .where("b.status = 'checked_out'")
--     .groupBy('r.type')
--     .getRawMany();
    
-- Bài 3: Khách hàng chi tiêu nhiều nhất
Select c.name, SUM(b.total_price), RANK() OVER (PARTITION BY c.id ORDER BY SUM(b.total_price) DESC) AS rank 
FROM customers c
Join bookings b ON c.id = b.customer_id
WHERE b.status = 'checked_out' ADD rank = 1
GROUP BY c.id


-- Phòng đang được sử dụng
SELECT r.name
FROM bookings b
LEFT JOIN room r ON r.id = b.room_id
WHERE b.status = 'checked_in';
