# Kafka — Hướng dẫn sử dụng

> Người mới: đọc lần lượt 01 → 04. Người đã biết: xem [05](05-reliability.md), [06](06-production.md) và [Bảng tra nhanh](#bảng-tra-nhanh) bên dưới.

## Lộ trình

| File | Nội dung | Dành cho |
|---|---|---|
| [01-concepts.md](01-concepts.md) | Kafka là gì, topic, partition, offset, consumer group, broker | Người mới |
| [02-setup.md](02-setup.md) | Chạy Kafka bằng Docker (KRaft), cài CLI | Người mới |
| [03-cli.md](03-cli.md) | Lệnh CLI: topic, produce/consume, group, offset, config | Mọi người |
| [04-nodejs.md](04-nodejs.md) | Code Node.js với KafkaJS: producer, consumer, admin | Mọi người |
| [05-reliability.md](05-reliability.md) | Commit offset, at-least-once, idempotent, transaction, retry & DLQ | Đã biết |
| [06-production.md](06-production.md) | Rebalance, retention, compaction, cluster, giám sát, sự cố | Chuyên nghiệp |

Code mẫu trong thư mục này: [producer.js](producer.js), [consumer.js](consumer.js), [consumer-template.js](consumer-template.js), [consumer-transaction.js](consumer-transaction.js), [admin.js](admin.js).

---

## Kafka trong 30 giây

```
Producer ──► Topic "order_created"                     ┌─► Group "email-service"   (mỗi group nhận đủ)
             ├─ Partition 0: [0][1][2][3] ──►          │
             ├─ Partition 1: [0][1][2]    ──► Broker ──┼─► Group "invoice-service"
             └─ Partition 2: [0][1]       ──►          │
                                                       └─► Group "analytics"
```

- **Producer** ghi message vào **topic**. Topic chia thành nhiều **partition** để scale.
- Message được **lưu lại trên đĩa** (không mất sau khi đọc), mỗi message có số thứ tự **offset**.
- **Consumer** đọc theo **group**: cùng group thì chia nhau xử lý, khác group thì mỗi group nhận đủ.

---

## Bảng tra nhanh

CLI (chạy trong container: thêm `docker exec -it kafka` phía trước, `BS=--bootstrap-server localhost:9092`):

| Việc cần làm | Lệnh |
|---|---|
| Liệt kê topic | `kafka-topics $BS --list` |
| Tạo topic | `kafka-topics $BS --create --topic t --partitions 3 --replication-factor 1` |
| Xem chi tiết topic | `kafka-topics $BS --describe --topic t` |
| Tăng partition | `kafka-topics $BS --alter --topic t --partitions 6` |
| Xóa topic | `kafka-topics $BS --delete --topic t` |
| Gửi message | `kafka-console-producer $BS --topic t` |
| Đọc từ đầu | `kafka-console-consumer $BS --topic t --from-beginning` |
| Liệt kê group | `kafka-consumer-groups $BS --list` |
| Xem lag | `kafka-consumer-groups $BS --describe --group g` |
| Đọc lại từ đầu | `kafka-consumer-groups $BS --group g --topic t --reset-offsets --to-earliest --execute` |
| Đổi retention | `kafka-configs $BS --entity-type topics --entity-name t --alter --add-config retention.ms=86400000` |

Ghi nhớ:

| Quy tắc | |
|---|---|
| Thứ tự | Chỉ đảm bảo **trong một partition**. Cần thứ tự theo user/order → dùng cùng `key` |
| Song song tối đa | Số consumer hữu ích trong một group = số partition |
| Partition | Chỉ **tăng**, không giảm. Tăng sẽ làm thay đổi key → partition |
| Mặc định | **At-least-once** → consumer phải xử lý **idempotent** (chịu được trùng) |
| Mất message | Producer dùng `acks: -1` (all) + topic `replication-factor ≥ 3`, `min.insync.replicas = 2` |
