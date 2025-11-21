Khách hàng yêu cầu hệ thống quản lý đặt phòng với các nghiệp vụ:
- Quản lý khách hàng (Customer)
- Quản lý phòng (Room) – mỗi phòng có loại, giá, trạng thái
- Ghi nhận đặt phòng (Booking): ngày check-in, check-out, tổng tiền
- Thống kê doanh thu, công suất phòng, top khách hàng, tình trạng phòng
- Lọc theo thời gian, loại phòng, doanh thu, trạng thái.

1️⃣	Tính tổng doanh thu theo từng ngày	GROUP BY DATE(check_out)
2️⃣	Thống kê doanh thu theo loại phòng	JOIN + GROUP
3️⃣	Tìm khách hàng chi tiêu nhiều nhất	SUM() + ORDER BY
4️⃣	Tìm phòng đang được sử dụng	JOIN + WHERE status
5️⃣	Tính công suất sử dụng phòng trong 7 ngày	COUNT(active bookings) / total rooms
6️⃣	Tính tổng số đêm trung bình của khách VIP	AVG(DATEDIFF(check_out, check_in))
7️⃣	Top 3 phòng doanh thu cao nhất tháng	GROUP + ORDER LIMIT
8️⃣	So sánh doanh thu từng ngày với ngày trước đó (window)	LAG(), OVER(PARTITION)