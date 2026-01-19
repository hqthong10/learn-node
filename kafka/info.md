# Partition
Partition = một hàng dữ liệu

Ví dụ:
Topic: order_created

Partition 0:  A → B → C → D
Partition 1:  E → F → G
Partition 2:  H → I

📌 Một topic luôn có ≥ 1 partition

❗ Trong 1 partition:
Message luôn có thứ tự
Không bị đảo lộn

❗ Giữa các partition:
Kafka KHÔNG đảm bảo thứ tự

- Vì sao Kafka cần Partition?
Nếu chỉ 1 partition:
    + 1 consumer đọc
    + Nhanh có giới hạn

Nếu nhiều partition:
    + Nhiều consumer đọc song song
    + Xử lý nhanh hơn rất nhiều

📌 Partition = khả năng scale

# Consumer Group
Consumer Group = nhóm backend cùng làm một việc

Ví dụ:
+ 3 server gửi email
+ Cùng đọc topic order_created
+ Cùng group email-service

Partition 0 → Consumer A
Partition 1 → Consumer B
Partition 2 → Consumer C

📌 Mỗi partition chỉ có 1 consumer trong group đọc
📌 Consumer Group giúp không đọc trùng dữ liệu

✔ groupId = nhóm consumer
✔ Cùng group → chia việc
✔ Khác group → mỗi bên nhận đủ
✔ Sai groupId = sai kiến trúc

