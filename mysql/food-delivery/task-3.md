Sếp báo: API “Top sản phẩm tháng” bị chậm khi:

5M orders
20M order_items


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


🎯 Nhiệm vụ
Phân tích: Query trên sẽ chậm ở đâu?
Đề xuất: Ít nhất 2 cách tối ưu khác nhau, ví dụ:
index
pre-aggregation
cache
materialized table

Phân tích:
- dữ liệu quá nhiều, bản quá lớn làm cho index không còn quá hiệu quả nữa, sẽ làm chậm query, tốn thời gian, tốn RAM, CPU.
- khi có nhiều query “Top sản phẩm tháng” cùng chạy càng làm nặng hệ thống

Đề xuất:
- index đã có, và không còn giúp được nhiều
- materialized table: tạo 1 bảng materialized table chứa riêng dữ liệu tháng này, phục vụ cho query “Top sản phẩm tháng”, theo chu kỳ 5 phút hoăc hơn
- tạo Summary Table, lưu tổng bán ra của từng SP theo ngày, tạo cronjob vào cuối ngày tổng hợp dữ liệu trong ngày lưu vào bảng này.
product_sales_daily (
  date DATE,
  product_id BIGINT,
  total_quantity INT,
  PRIMARY KEY (date, product_id),
  INDEX (product_id)
)

- tạo Partitioning theo tháng
- lưu kết quả query “Top sản phẩm tháng” vào redis có ttl, query 1 lần dùng nhiều lần
