# [v] Database là gì? Các loại Database phổ biến?
# [v] So sánh SQL vs NoSQL? Khi nào nên dùng SQL, khi nào dùng NoSQL?
# So sánh PostgreSQL với MySQL?
- Kiến trúc:
    + PostgreSQL: Hỗ trợ cả SQL và NoSQL
    + MySQL: Chỉ hỗ trợ SQL
- Kiểu dữ liệu
    + PostgreSQL: JSON, XML, Array, UUID, Hstore…
    + MySQL: Hạn chế hơn
- Chỉ mục
    + PostgreSQL: B-tree, Hash, GIN, GiST (đa dạng hơn)
    + MySQL: B-tree, Hash
- ACID
    + PostgreSQL: Hỗ trợ đầy đủ
    + MySQL: Hỗ trợ nhưng không mạnh bằng
- Mở rộng:
    + PostgreSQL: Hỗ trợ sharding, partitioning tốt hơn
    + MySQL: Kém hơn
- Ứng dụng
    + PostgreSQL: Hệ thống lớn, AI, Big Data, Blockchain
    + MySQL: Web, ứng dụng nhỏ & vừa

# ACID trong Database là gì?
- ACID là một tập hợp các thuộc tính đảm bảo rằng các giao dịch cơ sở dữ liệu được thực hiện một cách đáng tin cậy.

- A: Atomicity (Nguyên tử)
    + Atomicity đảm bảo rằng mỗi giao dịch là một đơn vị công việc nguyên tử.
    + Điều này có nghĩa là hoặc tất cả các hoạt động trong giao dịch đều được thực hiện, hoặc không có hoạt động nào được thực hiện cả.
    + Nếu một phần của giao dịch thất bại, toàn bộ giao dịch sẽ bị hủy bỏ, và cơ sở dữ liệu sẽ trở về trạng thái trước khi giao dịch được thực hiện.
    => (Nếu bất kỳ lệnh UPDATE nào thất bại, toàn bộ giao dịch sẽ bị hủy.)

- C: Consistency (Nhất quán)
    + Consistency đảm bảo rằng giao dịch đưa cơ sở dữ liệu từ một trạng thái hợp lệ này sang một trạng thái hợp lệ khác.
    + Các quy tắc toàn vẹn dữ liệu (constraints, triggers, etc.) phải được duy trì trước và sau giao dịch.
    => (Ràng buộc dữ liệu sẽ đảm bảo rằng tổng số tiền trong hệ thống không bị thay đổi.)

- I:  Isolation (Cô lập)
    + Isolation đảm bảo rằng các giao dịch thực hiện độc lập với nhau.
    + Kết quả của giao dịch này không bị ảnh hưởng bởi các giao dịch khác đang chạy đồng thời. 
    + Các mức cô lập (isolation levels) khác nhau quy định mức độ các giao dịch có thể thấy hoặc bị ảnh hưởng bởi các thay đổi của giao dịch khác.
    => (Nếu có giao dịch khác thực hiện đồng thời, mỗi giao dịch sẽ không ảnh hưởng đến kết quả của giao dịch còn lại.)

- D: Durability (Bền vững)
    + Durability đảm bảo rằng khi giao dịch đã được cam kết (committed), thay đổi sẽ được lưu trữ vĩnh viễn trong cơ sở dữ liệu, ngay cả khi có sự cố như mất điện hay hệ thống bị sập.
    => (Sau khi giao dịch được cam kết, thay đổi sẽ được lưu trữ vĩnh viễn ngay cả khi hệ thống gặp sự cố.)

# BASE trong NoSQL là gì?
- BASE là một mô hình nhất quán trong các hệ thống NoSQL, trái ngược với mô hình ACID của cơ sở dữ liệu quan hệ (RDBMS).
- BASE viết tắt cho:
    + Basically Available (Khả dụng cơ bản)
    + Soft state (Trạng thái mềm)
    + Eventual consistency (Nhất quán cuối cùng)
- BASE được thiết kế để ưu tiên tính sẵn sàng và khả năng mở rộng, thay vì đảm bảo tính nhất quán ngay lập tức.
1. Basically Available (Khả dụng cơ bản)
- Hệ thống luôn sẵn sàng phục vụ các yêu cầu, ngay cả khi có lỗi hoặc gián đoạn.
- Dữ liệu có thể chưa được cập nhật tức thì, nhưng hệ thống vẫn hoạt động.
Ví dụ: Nếu một node trong database cluster bị lỗi, hệ thống vẫn có thể trả về dữ liệu từ các node khác.
2. Soft state (Trạng thái mềm)
- Trạng thái của hệ thống có thể thay đổi theo thời gian, ngay cả khi không có yêu cầu cập nhật.
- Điều này là do dữ liệu có thể được đồng bộ dần giữa các node, thay vì đồng bộ ngay lập tức.
Ví dụ: Một hệ thống phân tán có thể lưu dữ liệu tạm thời trên cache trước khi cập nhật vào database chính.
3. Eventual consistency (Nhất quán cuối cùng)
- Dữ liệu không cần nhất quán ngay lập tức, nhưng sẽ dần trở nên nhất quán theo thời gian.
- Điều này giúp hệ thống NoSQL hoạt động nhanh và chịu tải tốt hơn.
Ví dụ: Trong Cassandra, nếu hai người cùng cập nhật một dữ liệu, hệ thống sẽ xử lý sự khác biệt và hợp nhất chúng theo một logic cụ thể.

# [v] Sự khác nhau giữa Schema, Table, View?
- Schema là một không gian chứa các đối tượng cơ sở dữ liệu
- Table là một cấu trúc sữ liệu vật lý trong database, lưu trữ dữ liệu vĩnh viễn trên ổ đĩa
- View là 1 câu truy vấn ảo dựa trên một hoặc nhiều Table, không lưu trữ dữ liệu mà chỉ hiển thị dữ liệu dựa trên truy vấn gốc.

# [v] Primary Key, Foreign Key, Unique Key là gì?

# Index là gì? Khi nào nên sử dụng Index?
- Index (chỉ mục) trong database là một cấu trúc dữ liệu giúp tăng tốc truy vấn bằng cách lưu trữ một bản sao có tổ chức của một phần dữ liệu trong bảng. Nó hoạt động giống như mục lục trong một cuốn sách, giúp tìm kiếm dữ liệu nhanh hơn thay vì quét toàn bộ bảng.
- Nên dùng Index khi:
    + Tìm kiếm dữ liệu nhanh hơn (dùng cho SELECT WHERE, JOIN).
    + Sắp xếp (ORDER BY hoặc GROUP BY) nhanh hơn.
    + Duy trì tính toàn vẹn của dữ liệu (dùng Unique Index).
    + Tăng tốc truy vấn trên các cột thường được lọc (WHERE, JOIN, ORDER BY, GROUP BY).

# Các kiểu dữ liệu phổ biến trong SQL?

# [v] Sự khác biệt giữa VARCHAR, TEXT, CHAR?

# Các loại Join trong SQL: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN?
- INNER JOIN (JOIN) – Lấy dữ liệu trùng nhau
    + Chỉ lấy dữ liệu có giá trị trùng khớp giữa 2 bảng.
    + Dùng khi: Cần lấy dữ liệu chung giữa hai bảng.
- LEFT JOIN (LEFT OUTER JOIN) – Lấy tất cả từ bảng trái
    + Lấy toàn bộ dữ liệu từ bảng bên trái, dù có hoặc không có dữ liệu tương ứng từ bảng bên phải. Nếu không có dữ liệu từ bảng phải, sẽ trả về NULL.
    + Dùng khi: Muốn lấy tất cả người dùng, kể cả chưa có đơn hàng.
- RIGHT JOIN (RIGHT OUTER JOIN) – Lấy tất cả từ bảng phải
    + Giống LEFT JOIN nhưng ưu tiên bảng bên phải.
    + Dùng khi: Muốn lấy tất cả đơn hàng, kể cả đơn không có user tương ứng (hiếm khi dùng).
- FULL JOIN (FULL OUTER JOIN) – Lấy tất cả từ cả hai bảng
    + Lấy tất cả dữ liệu từ cả hai bảng, nếu không có dữ liệu tương ứng thì trả về NULL.
    + Dùng khi: Cần lấy tất cả users và tất cả orders, kể cả những dữ liệu không có mối liên hệ.
    + Lưu ý: FULL JOIN không hỗ trợ trong MySQL, phải dùng UNION để thay thế.
- CROSS JOIN – Nhân chéo hai bảng (Cartesian Join)
    + Tạo tất cả các cặp kết hợp có thể giữa hai bảng (không có điều kiện JOIN).
    + Dùng khi: Cần kết hợp tất cả các bản ghi giữa 2 bảng (hiếm khi dùng vì có thể tạo ra bảng quá lớn).

# Cách tối ưu hóa truy vấn SQL?

# B-Tree Index, Hash Index, GIN Index, BRIN Index là gì?

# Làm sao kiểm tra truy vấn SQL có chạy hiệu quả không? (EXPLAIN ANALYZE)

# Transaction Isolation Level là gì? Các mức Isolation phổ biến?
- Transaction Isolation Level (Mức cô lập giao dịch) là một cơ chế trong database transactions để kiểm soát cách các giao dịch ảnh hưởng đến nhau khi chúng chạy đồng thời.
    + Tránh các lỗi do truy cập đồng thời như Dirty Read, Non-repeatable Read, Phantom Read.
    + Cân bằng giữa hiệu suất và tính nhất quán của dữ liệu.
- Các mức Isolation phổ biến
    + Read Uncommitted: Dirty Read, Non-repeatable Read, Phantom Read, Rất nhanh
    + Read Committed: Non-repeatable Read, Phantom Read, Nhanh
    + Repeatable Read: Phantom Read, Trung bình
    + Serializable: Chậm (chắc chắn nhất)
- Giải thích các lỗi có thể xảy ra:
    + Dirty Read: Đọc dữ liệu chưa commit từ transaction khác.
    + Non-repeatable Read: Cùng một query nhưng đọc dữ liệu khác nhau giữa các lần trong một transaction.
    + Phantom Read: Dữ liệu mới được thêm vào bởi transaction khác khi transaction hiện tại vẫn đang chạy.


# Sự khác nhau giữa Optimistic Locking và Pessimistic Locking?
- Optimistic Locking (Khóa lạc quan)
🔹 Cách hoạt động:
    + Không khóa dữ liệu ngay lập tức.
    + Cho phép nhiều transaction đọc dữ liệu cùng lúc.
    + Khi cập nhật, kiểm tra dữ liệu có bị thay đổi bởi transaction khác hay không.
    + Nếu dữ liệu đã bị thay đổi, transaction bị từ chối (rollback) và phải thử lại.
🔹 Cách triển khai:
    + Sử dụng version number hoặc timestamp để kiểm tra thay đổi.

- Pessimistic Locking (Khóa bi quan)
🔹 Cách hoạt động:
    + Khóa dữ liệu ngay khi một transaction đọc dữ liệu để ngăn chặn transaction khác sửa đổi.
    + Các transaction khác phải chờ hoặc bị từ chối nếu cố gắng truy cập bản ghi đang bị khóa.
🔹 Cách triển khai:
    + Sử dụng SELECT ... FOR UPDATE để khóa hàng.
    + Sử dụng LOCK TABLE để khóa bảng (hiếm khi dùng vì hiệu suất thấp).


# SELECT FOR UPDATE hoạt động như thế nào?

# Replication là gì? Có những loại Replication nào?

# Khi nào nên sử dụng Sharding? Cách hoạt động của Horizontal vs Vertical Sharding?

# CAP Theorem là gì?

# Redis có phải là Database không? Redis hoạt động như thế nào?

# Khi nào nên sử dụng Redis thay vì SQL?

# Câu hỏi thực hành SQL
1. Lấy danh sách khách hàng có tổng số tiền mua hàng lớn nhất?
2. Lấy 5 sản phẩm bán chạy nhất trong tháng trước?
3. Tìm tất cả các khách hàng không có đơn hàng nào?
4. Tìm nhân viên có mức lương cao thứ 2 trong công ty?