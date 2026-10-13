# 03 — CLI

[← Mục lục](README.md) · Trước: [02 — Cài đặt](02-setup.md) · Tiếp: [04 — Node.js](04-nodejs.md)

Mọi lệnh dưới đây chạy trong container:

```bash
docker exec -it kafka <lệnh>
```

Để gọn, ví dụ dưới bỏ phần `docker exec -it kafka` và viết tắt `--bootstrap-server localhost:9092` thành `$BS`:

```bash
BS="--bootstrap-server localhost:9092"
```

Hoặc vào hẳn shell của container: `docker exec -it kafka bash`.

---

## 1. Topic

```bash
kafka-topics $BS --list                                  # liệt kê

kafka-topics $BS --create --topic order_created \
  --partitions 3 --replication-factor 1                  # tạo

kafka-topics $BS --describe --topic order_created        # chi tiết: partition, leader, ISR

kafka-topics $BS --alter --topic order_created \
  --partitions 6                                         # tăng partition

kafka-topics $BS --delete --topic order_created          # xóa
```

> - Partition **chỉ tăng, không giảm**. Tăng sẽ làm key rơi vào partition khác → mất thứ tự với dữ liệu cũ.
> - `replication-factor` không được lớn hơn số broker.
> - Xóa topic cần broker bật `delete.topic.enable=true` (mặc định đã bật).

Tạo topic kèm cấu hình:

```bash
kafka-topics $BS --create --topic user-state --partitions 3 --replication-factor 1 \
  --config cleanup.policy=compact \
  --config retention.ms=604800000
```

---

## 2. Gửi message (producer)

```bash
kafka-console-producer $BS --topic order_created
> hello
> order 1
> order 2
# Ctrl+C để thoát
```

Gửi kèm key (định dạng `key:value`):

```bash
kafka-console-producer $BS --topic order_created \
  --property parse.key=true --property key.separator=:
> o123:{"orderId":"o123","amount":500000}
```

Gửi từ file:

```bash
kafka-console-producer $BS --topic order_created < orders.txt
```

---

## 3. Đọc message (consumer)

```bash
kafka-console-consumer $BS --topic order_created                    # chỉ message mới
kafka-console-consumer $BS --topic order_created --from-beginning   # đọc từ đầu
kafka-console-consumer $BS --topic order_created --group test-group # đọc theo group (có commit offset)
kafka-console-consumer $BS --topic order_created --max-messages 10  # đọc 10 cái rồi dừng
```

Hiện key, partition, offset, thời gian:

```bash
kafka-console-consumer $BS --topic order_created --from-beginning \
  --property print.key=true \
  --property print.partition=true \
  --property print.offset=true \
  --property print.timestamp=true
```

Đọc một partition / offset cụ thể:

```bash
kafka-console-consumer $BS --topic order_created --partition 0 --offset 5
```

---

## 4. Consumer group & lag

```bash
kafka-consumer-groups $BS --list                          # liệt kê group
kafka-consumer-groups $BS --describe --group email-service
kafka-consumer-groups $BS --describe --group email-service --members   # ai đang giữ partition nào
```

Kết quả `--describe`:

```
GROUP          TOPIC          PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG  CONSUMER-ID
email-service  order_created  0          120             125             5    consumer-1-...
email-service  order_created  1          98              98              0    consumer-2-...
```

| Cột | Ý nghĩa |
|---|---|
| `CURRENT-OFFSET` | Offset group đã commit |
| `LOG-END-OFFSET` | Offset mới nhất của partition |
| `LAG` | Số message chưa xử lý — **chỉ số quan trọng nhất khi debug** |
| `CONSUMER-ID` trống | Không có consumer nào đang chạy cho partition đó |

Xóa group (group phải không còn consumer chạy):

```bash
kafka-consumer-groups $BS --delete --group test-group
```

---

## 5. Reset offset (đọc lại / bỏ qua)

> ⚠️ Phải **dừng toàn bộ consumer** của group trước. Luôn chạy `--dry-run` xem trước, rồi mới `--execute`.

```bash
kafka-consumer-groups $BS --group email-service --topic order_created \
  --reset-offsets --to-earliest --dry-run      # xem trước

kafka-consumer-groups $BS --group email-service --topic order_created \
  --reset-offsets --to-earliest --execute      # thực hiện
```

| Tùy chọn | Ý nghĩa |
|---|---|
| `--to-earliest` | Về đầu topic (đọc lại tất cả) |
| `--to-latest` | Về cuối (bỏ qua message cũ) |
| `--to-offset 100` | Về offset cụ thể |
| `--shift-by -10` | Lùi 10 message |
| `--to-datetime 2026-10-01T00:00:00.000` | Về thời điểm |
| `--all-topics` | Áp dụng mọi topic của group (thay cho `--topic`) |
| `--topic order_created:0,1` | Chỉ partition 0 và 1 |

---

## 6. Cấu hình topic

```bash
# Xem cấu hình
kafka-configs $BS --entity-type topics --entity-name order_created --describe

# Giữ message 1 ngày
kafka-configs $BS --entity-type topics --entity-name order_created \
  --alter --add-config retention.ms=86400000

# Bỏ cấu hình riêng, quay về mặc định
kafka-configs $BS --entity-type topics --entity-name order_created \
  --alter --delete-config retention.ms
```

Cấu hình topic hay dùng:

| Config | Ý nghĩa |
|---|---|
| `retention.ms` | Giữ message bao lâu (ms). `-1` = mãi mãi |
| `retention.bytes` | Giới hạn dung lượng mỗi partition |
| `cleanup.policy` | `delete` (mặc định) / `compact` / `compact,delete` |
| `min.insync.replicas` | Số replica tối thiểu phải ghi xong khi producer dùng `acks=all` |
| `max.message.bytes` | Kích thước message tối đa (mặc định ~1MB) |

---

## 7. Cluster & khác

```bash
kafka-broker-api-versions $BS                 # kiểm tra kết nối broker, phiên bản API
kafka-metadata-quorum $BS describe --status   # trạng thái controller (KRaft)
kafka-get-offsets $BS --topic order_created   # offset cuối của từng partition (Kafka 3.0+)
```

Đo hiệu năng:

```bash
kafka-producer-perf-test --topic perf --num-records 100000 --record-size 1000 \
  --throughput -1 --producer-props bootstrap.servers=localhost:9092

kafka-consumer-perf-test $BS --topic perf --messages 100000
```
