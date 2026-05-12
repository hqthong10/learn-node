Bạn là senior fullstack engineer với kinh nghiệm xây dựng hệ thống production.

Nhiệm vụ:
Xây dựng một hệ thống quản lý bãi giữ xe cho chung cư.

======================
1. Mục tiêu hệ thống
======================
- Quản lý xe ra/vào
- Nhận diện biển số xe
- Quản lý thẻ xe
- Tính phí theo thời gian
- Thống kê và báo cáo

======================
2. Tech stack bắt buộc
======================
- Backend: NestJS (Node.js)
- Database: MongoDB (Mongoose)
- Desktop app: Electron
- AI nhận diện: EasyOCR

======================
3. Functional requirements
======================
- Khi xe vào:
  + Chụp ảnh xe
  + Nhận diện biển số
  + Lưu thời gian vào
- Khi xe ra:
  + Nhận diện lại biển số
  + Tính phí dựa trên thời gian
- Phân biệt:
  + Xe đăng ký (có thẻ)
  + Xe khách (không thẻ)
- Quản lý:
  + Nhân viên
  + Danh sách xe
  + Thẻ xe
- Lưu ảnh tại máy local

======================
4. Non-functional requirements
======================
- Code rõ ràng, dễ maintain
- Tách module theo domain
- Có logging
- Có error handling đầy đủ
- Thiết kế để có thể mở rộng (scalable)
- Không viết code kiểu demo, phải theo hướng production

======================
5. Kiến trúc hệ thống
======================
- Hỗ trợ mô hình:
  local → LAN server → cloud sync
- Ưu tiên chạy local trước, sau đó đồng bộ

======================
6. Yêu cầu output
======================
- Không trả lời tất cả trong một lần
- Chia thành từng bước rõ ràng
- Mỗi bước gồm:
  + Giải thích ngắn gọn
  + Code hoặc thiết kế cụ thể

======================
7. Quy trình thực hiện
======================
Thực hiện theo thứ tự:
1. Thiết kế database schema (MongoDB)
2. Thiết kế API (REST)
3. Thiết kế architecture tổng thể
4. Viết code backend (NestJS)
5. Tích hợp nhận diện biển số (EasyOCR)
6. Gợi ý tích hợp Electron

Sau mỗi bước:
- Dừng lại
- Chờ tôi xác nhận mới làm tiếp

======================
8. Ràng buộc
======================
- Không thêm tính năng ngoài yêu cầu
- Không giả định nếu thiếu thông tin → hãy hỏi lại
- Không sử dụng framework ngoài danh sách
- Giữ code sạch, dễ đọc

======================
Bắt đầu với bước 1:
Thiết kế database schema cho MongoDB.