Trong MySQL, storage engine (bộ lưu trữ dữ liệu) là thành phần quản lý cách dữ liệu được lưu trữ, truy xuất, và thao tác trong các bảng. Mỗi storage engine có các đặc điểm riêng, phù hợp với các nhu cầu cụ thể. Dưới đây là danh sách các storage engines phổ biến và đặc điểm của chúng:

### InnoDB

- Mô tả:
    + Đây là storage engine mặc định trong MySQL (từ phiên bản 5.5 trở đi).
    + Hỗ trợ ACID transactions (Atomicity, Consistency, Isolation, Durability).
    + Dùng khóa ngoại (foreign key) và duy trì toàn vẹn dữ liệu (referential integrity).

- Ưu điểm:
    + Tối ưu cho các ứng dụng giao dịch (transactional applications).
    + Hỗ trợ row-level locking, phù hợp với các tác vụ ghi và đọc đồng thời.
    + Cơ chế crash recovery (khôi phục sau sự cố).

- Nhược điểm:
    + Sử dụng nhiều bộ nhớ hơn so với các engine đơn giản như MyISAM.

- Sử dụng khi nào:
    + Ứng dụng cần giao dịch hoặc các yêu cầu toàn vẹn dữ liệu.

## MyISAM

- Mô tả:
    + Engine mặc định trong các phiên bản MySQL cũ (trước 5.5).
    + Tập trung vào hiệu suất đọc, không hỗ trợ giao dịch hoặc khóa ngoại.

- Ưu điểm:
    + Nhanh hơn InnoDB trong các tác vụ chỉ đọc hoặc ghi ít.
    + Sử dụng ít bộ nhớ hơn InnoDB.

- Nhược điểm:
    + Không hỗ trợ transactions hoặc foreign key constraints.
    + Khóa cấp bảng (table-level locking) có thể gây xung đột trong các ứng dụng nhiều ghi.

- Sử dụng khi nào:
    + Dữ liệu chỉ đọc hoặc các ứng dụng không cần toàn vẹn dữ liệu cao.

## MEMORY (HEAP)

- Mô tả:
    + Lưu trữ dữ liệu trong RAM để truy xuất cực nhanh.
    + Dữ liệu sẽ mất khi server tắt hoặc khởi động lại.

- Ưu điểm:
    + Tốc độ truy xuất rất nhanh.
    + Phù hợp cho các bảng tạm thời hoặc dữ liệu tạm thời.

- Nhược điểm:
    + Giới hạn bởi dung lượng RAM.
    + Không hỗ trợ transactions hoặc text/blob data types.

- Sử dụng khi nào:
    + Dữ liệu tạm thời hoặc bảng dùng cho các tính toán nhanh.

## CSV

- Mô tả:
    + Lưu trữ dữ liệu trong các file CSV (Comma Separated Values).

- Ưu điểm:
    + Dữ liệu dễ dàng di chuyển và chia sẻ giữa các ứng dụng khác nhau.

- Nhược điểm:
    + Không hỗ trợ indexes, transactions, hoặc bất kỳ tính năng nâng cao nào.
    + Chậm hơn các engine khác.

- Sử dụng khi nào:
    + Dữ liệu cần xuất nhập thường xuyên giữa MySQL và các ứng dụng khác.

## ARCHIVE

- Mô tả:
    + Tối ưu để lưu trữ dữ liệu lớn (chỉ hỗ trợ thêm và đọc, không hỗ trợ sửa hoặc xóa).

- Ưu điểm:
    + Nén dữ liệu để tiết kiệm không gian lưu trữ.
    + Phù hợp với các hệ thống lưu trữ log hoặc lịch sử.

- Nhược điểm:
    + Không hỗ trợ indexes (ngoại trừ primary key).
    + Không thể xóa hoặc sửa dữ liệu.

- Sử dụng khi nào:
    + Lưu trữ log hoặc dữ liệu lịch sử.

## NDB (Clustered)

- Mô tả:
    + Được thiết kế cho MySQL Cluster, cung cấp tính năng phân cụm (clustering).
    + Dữ liệu được phân phối trên nhiều node.

- Ưu điểm:
    + Hỗ trợ high availability (khả năng sẵn sàng cao).
    + Phù hợp với các hệ thống phân tán.

- Nhược điểm:
    + Cấu hình phức tạp.
    + Tốn nhiều tài nguyên.

- Sử dụng khi nào:
    + Ứng dụng cần clustering, high availability.

## FEDERATED

- Mô tả:
    + Cho phép truy cập dữ liệu từ một MySQL server khác mà không cần lưu trữ cục bộ.

- Ưu điểm:
    + Kết nối dễ dàng đến các cơ sở dữ liệu từ xa.

- Nhược điểm:
    + Hiệu suất kém hơn so với các engine khác.
    + Không hỗ trợ indexes trên server từ xa.

- Sử dụng khi nào:
    + Truy cập dữ liệu từ cơ sở dữ liệu từ xa.

## BLACKHOLE
- Mô tả:
    + Mọi dữ liệu được ghi vào sẽ bị "nuốt" mà không được lưu lại.

- Ưu điểm:
    + Phù hợp để kiểm tra hoặc ghi log các query mà không lưu dữ liệu.

- Nhược điểm:
    + Không lưu trữ bất kỳ dữ liệu nào.

- Sử dụng khi nào:
    + Test hiệu suất query hoặc ghi log.


## TokuDB
- Mô tả:
    + Engine thay thế hỗ trợ nén dữ liệu tốt và quản lý khối lượng dữ liệu lớn.

- Ưu điểm:
    + Tiết kiệm dung lượng lưu trữ.
    + Hiệu suất cao với dữ liệu lớn.

- Nhược điểm:
    + Cần cài đặt bổ sung.

- Sử dụng khi nào:
    + Ứng dụng cần xử lý dữ liệu lớn với hiệu suất cao.

### Lựa chọn engine phù hợp:
Use Case  |	Storage Engine
Giao dịch, toàn vẹn dữ liệu |	InnoDB
Dữ liệu chỉ đọc |	MyISAM
Tốc độ truy xuất nhanh |	MEMORY
Lưu log, dữ liệu nén	| ARCHIVE
Phân tán, clustering	| NDB Cluster
Kết nối từ xa	| FEDERATED
