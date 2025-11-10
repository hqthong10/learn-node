- Products
GET	/api/products	?q=, ?category=, ?page=, ?limit=	[ { id, name, sku, unit_price, quantity_in_stock, ... } ]	Danh sách sản phẩm
GET	/api/products/:id	–	{ id, name, sku, category, unit_price, cost_price, supplier_id, quantity_in_stock }	Lấy chi tiết sản phẩm
POST	/api/products	{ sku, name, category, cost_price, unit_price, quantity_in_stock, supplier_id }	{ id, ... }	Thêm sản phẩm mới
PUT	/api/products/:id	{ name?, category?, unit_price?, cost_price?, supplier_id? }	{ updated: true }	Cập nhật sản phẩm
DELETE	/api/products/:id	–	{ deleted: true }	Xóa sản phẩm
PATCH	/api/products/:id/stock	{ quantity_change }	{ id, quantity_in_stock }	Điều chỉnh tồn kho
GET	/api/products/low-stock	?threshold=10	[ { id, name, quantity_in_stock } ]	Sản phẩm sắp hết hàng

- Suppliers
GET	/api/suppliers	–	[ { id, name, phone, address } ]	Danh sách nhà cung cấp
GET	/api/suppliers/:id	–	{ id, name, phone, address }	Lấy chi tiết
POST	/api/suppliers	{ name, phone, address }	{ id }	Thêm mới
PUT	/api/suppliers/:id	{ name?, phone?, address? }	{ updated: true }	Cập nhật
DELETE	/api/suppliers/:id	–	{ deleted: true }	Xóa

- Customers
GET	/api/customers	?q=, ?page=	[ { id, name, phone, points } ]	Danh sách khách hàng
GET	/api/customers/:id	–	{ id, name, phone, points }	Chi tiết khách hàng
POST	/api/customers	{ name, phone }	{ id }	Đăng ký khách hàng
PUT	/api/customers/:id	{ name?, phone? }	{ updated: true }	Cập nhật
DELETE	/api/customers/:id	–	{ deleted: true }	Xóa khách hàng
GET	/api/customers/:id/history	–	[ { id, points_change, reason, created_at } ]	Lịch sử tích điểm

- Invoices
GET	/api/invoices	?from=2025-01-01&to=...&status=	[ { id, invoice_no, total_amount, customer_id, employee_id, status, created_at } ]	Danh sách hóa đơn
GET	/api/invoices/:id	–	{ id, invoice_no, items: [...], total_amount, payment_method, customer, employee }	Chi tiết hóa đơn
POST	/api/invoices/checkout	{ employee_id, customer_id?, payment_method, use_points?, items: [ { product_id, quantity, unit_price } ] }	{ invoice_id, subtotal, discount, total_amount, status }	Checkout bán hàng (gọi procedure checkout_with_items)
POST	/api/invoices/cancel/:id	{ reason }	{ result: 'cancelled:123' }	Hủy hóa đơn (gọi cancel_invoice)

- Import / Inventory (Nhập hàng & tồn kho)
GET	/api/imports	?from=...&to=...	[ { id, receipt_no, total_amount, supplier, employee, created_at } ]	Danh sách phiếu nhập
GET	/api/imports/:id	–	{ id, supplier, items: [...], total_amount }	Chi tiết phiếu nhập
POST	/api/imports	{ supplier_id, employee_id, receipt_no, items: [ { product_id, quantity, import_price } ] }	{ receipt_id, total_amount }	Gọi CALL import_stock_from_json()

- Reports (Báo cáo & thống kê)
GET	/api/reports/sales-summary	?from=&to=	[ { day, total_sales } ]	Doanh thu theo ngày
GET	/api/reports/monthly-sales	?year=2025	[ { month, total_sales } ]	Doanh thu theo tháng
GET	/api/reports/top-products	?limit=10	[ { product_id, name, total_sold } ]	Sản phẩm bán chạy
GET	/api/reports/inventory-value	–	[ { product_id, name, quantity_in_stock, total_value } ]	Giá trị tồn kho
GET	/api/reports/top-customers	?limit=10	[ { id, name, total_points } ]	Khách hàng thân thiết
GET	/api/reports/employee-sales	?from=&to=	[ { employee_id, name, total_sales } ]

- Employees (Nhân viên & phân quyền)
GET	/api/employees	–	[ { id, name, username, role } ]	Danh sách nhân viên
GET	/api/employees/:id	–	{ id, name, username, role }	Thông tin nhân viên
POST	/api/employees	{ name, username, password, role }	{ id }	Tạo nhân viên
PUT	/api/employees/:id	{ name?, role?, active? }	{ updated: true }	Cập nhật thông tin
DELETE	/api/employees/:id	–	{ deleted: true }	Xóa nhân viên

- Settings (Cấu hình hệ thống)
GET	/api/settings	–	{ point_rate: 1000, currency: 'VND' }	Lấy cấu hình hệ thống
PUT	/api/settings/loyalty	{ point_rate }	{ updated: true }	Cập nhật quy tắc tích điểm
GET	/api/system/health	–	{ db: 'ok', uptime: '1234s' }

- Bonus: Các API đặc biệt (cho POS / nâng cao)
/api/scan/:code	GET	Quét mã barcode / QR → trả thông tin sản phẩm	Dùng camera / scanner
/api/checkout/preview	POST	Gửi danh sách sản phẩm → nhận tổng tiền, điểm tích được	Preview hóa đơn
/api/sync/push	POST	Đồng bộ dữ liệu local → LAN / Cloud	Cho offline POS
/api/sync/pull	GET	Lấy dữ liệu từ server về local	Cho Electron app