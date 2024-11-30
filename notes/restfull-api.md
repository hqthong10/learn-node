# Methob
GET (SELECT): Trả về một Resource hoặc một danh sách Resource.
POST (CREATE): Tạo mới một Resource.
PUT (UPDATE): Cập nhật thông tin cho Resource.
DELETE (DELETE): Xoá một Resource.

GET: được sử dụng để lấy thông tin từ server theo URI đã cung cấp.
HEAD: giống với GET nhưng response trả về không có body, chỉ có header.
POST: gửi thông tin tới sever thông qua các biểu mẫu http.
PUT: ghi đè tất cả thông tin của đối tượng với những gì được gửi lên.
PATCH: ghi đè các thông tin được thay đổi của đối tượng.
DELETE: xóa tài nguyên trên server.
CONNECT: thiết lập một kết nối tới server theo URI.
OPTIONS: mô tả các tùy chọn giao tiếp cho resource.
TRACE: thực hiện một bài test loop – back theo đường dẫn đến resource.

# Status
200 OK – Trả về thành công cho những phương thức GET, PUT, PATCH hoặc DELETE.
201 Created – Trả về khi một Resouce vừa được tạo thành công.
202 Accepted: Yêu cầu đã được chấp nhận để xử lý, nhưng xử lý chưa hoàn thành.
204 No Content: Yêu cầu đã thành công nhưng không có nội dung trả về. Thường được sử dụng với phương thức DELETE.
304 Not Modified – Client có thể sử dụng dữ liệu cache.
400 Bad Request: Yêu cầu không hợp lệ do lỗi cú pháp hoặc dữ liệu không đúng.
401 Unauthorized – Request cần có auth.
403 Forbidden: Máy chủ hiểu yêu cầu nhưng từ chối thực hiện.
404 Not Found: Tài nguyên yêu cầu không tồn tại.
405 Method Not Allowed: Phương thức HTTP được sử dụng không được hỗ trợ cho tài nguyên yêu cầu.
409 Conflict: Yêu cầu không thể được hoàn thành do xung đột với trạng thái hiện tại của tài nguyên.
409 Conflict: Đây là mã trạng thái được khuyến nghị và chuẩn mực để trả về khi một tài nguyên đã tồn tại.
410 Gone – Resource không còn tồn tại, Version cũ đã không còn hỗ trợ.
415 Unsupported Media Type – Không hỗ trợ kiểu Resource này.
422 Unprocessable Entity: Yêu cầu hợp lệ nhưng không thể xử lý do lỗi trong nội dung yêu cầu.
429 Too Many Requests – Request bị từ chối do bị giới hạn
500 Internal Server Error: Máy chủ gặp lỗi không xác định và không thể hoàn thành yêu cầu.
501 Not Implemented: Máy chủ không hỗ trợ chức năng yêu cầu.
502 Bad Gateway: Máy chủ nhận phản hồi không hợp lệ từ máy chủ ngược dòng.
503 Service Unavailable: Máy chủ hiện không có sẵn (ví dụ: do quá tải hoặc bảo trì).
504 Gateway Timeout: Máy chủ không nhận được phản hồi kịp thời từ máy chủ ngược dòng.
