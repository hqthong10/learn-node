# Status code

200 OK: Trả về thành công cho những phương thức GET, PUT, PATCH hoặc DELETE.
201 Created: Trả về khi tạo thành công một Resouce.
204 No Content: Trả về khi xóa thành công Resource.
304 Not Modified: Client có thể sử dụng dữ liệu cache.
400 Bad Request: Request không hợp lệ.
401 Unauthorized: Request cần phải có auth.
403 Forbidden: Bị từ chối không cho phép.
404 Not Found: Không tìm thấy resource từ URI.
405 Method Not Allowed: Phương thức không cho phép với user hiện tại.
410 Gone: Resource không còn tồn tại, version cũ không còn hỗ trợ.
415 Unsupported Media Type: Không hỗ trợ kiểu Resource này.
422 Unprocessable Entity: Dữ liệu không được xác thực.
429 Too Many Requests: Request bị từ chối do bị giới hạn.
