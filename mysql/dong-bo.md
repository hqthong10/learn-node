# Replication (Sao chép dữ liệu)
Replication là quá trình sao chép dữ liệu từ một cơ sở dữ liệu chính (master) sang một hoặc nhiều cơ sở dữ liệu phụ (slave). Dữ liệu được đồng bộ gần như thời gian thực từ master đến slave(s).

- Loại hình replication:
    + Master-Slave Replication: Các thay đổi chỉ được thực hiện trên master và sau đó được sao chép tự động sang slave. Đây là mô hình dễ quản lý và phổ biến.
    + Master-Master Replication: Cả hai cơ sở dữ liệu đều có quyền ghi dữ liệu và đồng bộ hóa với nhau. Mô hình này phức tạp hơn nhưng phù hợp với những ứng dụng yêu cầu tính sẵn sàng cao và chịu tải lớn.

- Ưu điểm:
    + Cập nhật thời gian thực hoặc gần thời gian thực.
    + Giảm tải cho máy chủ chính.

- Nhược điểm: Khó xử lý xung đột khi nhiều máy chủ có quyền ghi (master-master).

- Công cụ:
    + MySQL Replication: MySQL có hỗ trợ tích hợp cho replication giữa các cơ sở dữ liệu. Đây là giải pháp phổ biến cho việc sao chép dữ liệu từ master đến slave(s).
    + PostgreSQL Replication: PostgreSQL cũng cung cấp tính năng replication mạnh mẽ thông qua streaming replication.

# ETL (Extract, Transform, Load)
ETL là quy trình phổ biến để đồng bộ dữ liệu giữa các hệ thống. Nó bao gồm ba bước:

- Extract: Trích xuất dữ liệu từ một hoặc nhiều nguồn.
- Transform: Biến đổi dữ liệu thành định dạng cần thiết.
- Load: Tải dữ liệu đã biến đổi vào cơ sở dữ liệu đích.

ETL thường được sử dụng khi cần đồng bộ dữ liệu giữa các hệ thống khác nhau, hoặc khi dữ liệu cần qua bước chuyển đổi trước khi được nhập vào cơ sở dữ liệu đích.

- Ưu điểm:
    + Linh hoạt, phù hợp với việc đồng bộ dữ liệu từ nhiều nguồn khác nhau.
    + Quản lý tốt các trường hợp dữ liệu phức tạp.

- Nhược điểm: Thời gian đồng bộ không phải thời gian thực (thường là theo lịch định kỳ).

- Công cụ ETL:
    + Apache Nifi
    + Talend
    + Pentaho
    + Informatica
    + Airflow

# CDC (Change Data Capture)
CDC là phương pháp theo dõi và ghi nhận tất cả những thay đổi xảy ra trong cơ sở dữ liệu. Nó chỉ đồng bộ những thay đổi (insert, update, delete) thay vì toàn bộ dữ liệu.

- Ưu điểm:
    + Chỉ đồng bộ dữ liệu thay đổi, tiết kiệm băng thông và tài nguyên.
    + Hỗ trợ đồng bộ dữ liệu gần thời gian thực.

- Nhược điểm: Đòi hỏi cấu hình và công cụ hỗ trợ phức tạp.

- Công cụ:
    + Debezium: Một công cụ mã nguồn mở giúp theo dõi thay đổi từ các cơ sở dữ liệu như MySQL, PostgreSQL, MongoDB, và đồng bộ hóa theo thời gian thực.
    + Kafka Connect: Kết hợp với Debezium để truyền tải và đồng bộ hóa dữ liệu giữa các hệ thống.

# Database Triggers
Triggers là cách để tự động kích hoạt các hành động khi một sự kiện như insert, update, hoặc delete xảy ra. Bạn có thể thiết lập triggers để ghi nhận các thay đổi và đồng bộ dữ liệu sang các cơ sở dữ liệu khác.

- Ưu điểm:
    + Đồng bộ hóa ngay khi dữ liệu thay đổi (thời gian thực).
    + Đơn giản và tích hợp trực tiếp vào cơ sở dữ liệu.

- Nhược điểm:
    + Triggers phức tạp có thể làm chậm hiệu suất cơ sở dữ liệu.
    + Khó bảo trì nếu cơ sở dữ liệu lớn và có nhiều bảng.

# Data Streaming (Luồng dữ liệu)
Data streaming là giải pháp đồng bộ hóa dữ liệu trong thời gian thực thông qua việc truyền tải liên tục các sự kiện hoặc thay đổi dữ liệu từ hệ thống nguồn đến hệ thống đích. Các nền tảng stream thường sử dụng cho các hệ thống yêu cầu xử lý và đồng bộ dữ liệu thời gian thực.

- Ưu điểm:
    + Đồng bộ hóa dữ liệu theo thời gian thực.
    + Xử lý được khối lượng dữ liệu lớn.

- Nhược điểm: Cần tích hợp phức tạp và đòi hỏi tài nguyên lớn.

- Công cụ:
    + Apache Kafka: Là nền tảng phổ biến để quản lý luồng dữ liệu, có thể dùng để đồng bộ hóa dữ liệu giữa các cơ sở dữ liệu khác nhau.
    + AWS Kinesis: Dịch vụ của Amazon Web Services giúp truyền tải dữ liệu theo thời gian thực.

# Database Backup & Restore
Đối với các hệ thống cần đồng bộ định kỳ hoặc toàn bộ dữ liệu, có thể sử dụng phương pháp sao lưu (backup) từ cơ sở dữ liệu nguồn và phục hồi (restore) vào cơ sở dữ liệu đích.

- Ưu điểm: Đồng bộ toàn bộ dữ liệu từ một nguồn sang nguồn khác.

- Nhược điểm:
    + Không phù hợp với các hệ thống lớn hoặc cần đồng bộ liên tục.
    + Đòi hỏi thời gian và dung lượng để thực hiện backup và restore.

# API-based Synchronization (Đồng bộ hóa qua API)
Một phương pháp phổ biến để đồng bộ dữ liệu giữa các cơ sở dữ liệu là sử dụng các API REST hoặc GraphQL. Cách tiếp cận này cho phép đồng bộ hóa dữ liệu giữa các dịch vụ thông qua việc gửi các yêu cầu HTTP qua lại giữa các hệ thống.

- Ưu điểm:
    + Linh hoạt và có thể tích hợp với bất kỳ hệ thống nào hỗ trợ API.
    + Dễ mở rộng và bảo trì.

- Nhược điểm:
    + Cần quản lý truy cập, bảo mật.
    + Có thể không hiệu quả trong các hệ thống cần đồng bộ dữ liệu lớn.