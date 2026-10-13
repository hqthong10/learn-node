# 06 — Production: rebalance, lưu trữ, cluster, sự cố

[← Mục lục](README.md) · Trước: [05 — Độ tin cậy](05-reliability.md)

## 1. Rebalance — vì sao consumer đột nhiên dừng

**Rebalance** = group chia lại partition cho các consumer. Trong lúc rebalance, các consumer liên quan **tạm dừng đọc**.

Xảy ra khi:
- Consumer join (deploy, scale up) hoặc rời group (tắt, crash).
- Consumer **không gửi heartbeat** kịp `sessionTimeout`.
- Thời gian xử lý giữa hai lần poll vượt giới hạn → bị coi là chết, bị đá khỏi group.
- Số partition của topic thay đổi.

Cấu hình KafkaJS liên quan:

```js
kafka.consumer({
  groupId: 'email-service',
  sessionTimeout: 30000,       // không heartbeat trong 30s → bị đá khỏi group
  heartbeatInterval: 3000,     // gửi heartbeat mỗi 3s (≤ 1/3 sessionTimeout)
  rebalanceTimeout: 60000,     // thời gian chờ các thành viên join lại
});
```

Giảm rebalance:

| Vấn đề | Cách xử lý |
|---|---|
| Xử lý một message/batch quá lâu | Gọi `heartbeat()` trong vòng lặp, giảm kích thước batch, hoặc tăng `sessionTimeout` |
| Deploy làm rebalance nhiều lần | Rolling deploy từ từ; tắt app có `consumer.disconnect()` |
| Consumer crash liên tục | Bắt lỗi đúng chỗ, đẩy message lỗi sang DLQ (file 05) |
| Rebalance "stop-the-world" | Dùng assignor cooperative-sticky / giao thức consumer group mới (Kafka 4.0, client hỗ trợ) |

---

## 2. Retention & lưu trữ

Mỗi partition là một chuỗi file **segment** trên đĩa. Kafka xóa theo **segment**, không theo từng message.

| Config (topic) | Mặc định | Ý nghĩa |
|---|---|---|
| `retention.ms` | 7 ngày | Giữ message bao lâu. `-1` = mãi mãi |
| `retention.bytes` | -1 (không giới hạn) | Giới hạn dung lượng mỗi partition |
| `segment.ms` / `segment.bytes` | 7 ngày / 1GB | Khi nào đóng segment để có thể xóa |
| `cleanup.policy` | `delete` | `delete` / `compact` / `compact,delete` |

Broker: `log.retention.hours` (mặc định 168) áp dụng cho topic không đặt riêng.

### Log compaction

Chỉ giữ message **mới nhất của mỗi key** — Kafka thành "bảng key-value" có lịch sử thay đổi gần nhất.

```
Trước:  [u1:A] [u2:B] [u1:C] [u3:D] [u2:E]
Sau:                  [u1:C] [u3:D] [u2:E]
```

- Dùng cho: trạng thái user, cấu hình, cache, CDC.
- Xóa hẳn một key: gửi message `value = null` (**tombstone**).
- Message **bắt buộc có key**.

```bash
kafka-topics $BS --create --topic user-state --partitions 3 --replication-factor 1 \
  --config cleanup.policy=compact
```

**Ước tính dung lượng:** `msg/s × kích thước × retention (s) × replication-factor`.
Vd: 1000 msg/s × 1KB × 7 ngày × 3 ≈ **1.8 TB**.

---

## 3. Kiến trúc cluster production

```
         ┌───────── Controller quorum (KRaft, 3 node) ─────────┐
         │       quản lý metadata, bầu leader partition         │
         └──────────────────────────────────────────────────────┘
   Broker 1 (AZ-a)        Broker 2 (AZ-b)        Broker 3 (AZ-c)
   P0 Leader              P0 Follower            P0 Follower
   P1 Follower            P1 Leader              P1 Follower
   P2 Follower            P2 Follower            P2 Leader
```

| Thành phần | Khuyến nghị |
|---|---|
| Broker | ≥ 3, rải trên nhiều zone/rack (`broker.rack`) |
| Controller | 3 (hoặc 5) node KRaft, số lẻ |
| Replication | `default.replication.factor=3`, `min.insync.replicas=2` |
| Topic tự tạo | `auto.create.topics.enable=false` |
| Leader sạch | `unclean.leader.election.enable=false` (mặc định) — không cho replica lạc hậu làm leader |
| Bảo mật | TLS + SASL (SCRAM/OAuth), ACL theo service |

**Chọn số partition:**
- Partition ≥ số consumer tối đa bạn muốn chạy song song trong một group.
- Ước lượng: `max(thông lượng mục tiêu / thông lượng 1 partition phía producer, ... phía consumer)`.
- Chọn dư một chút ngay từ đầu (vd 6, 12) vì tăng sau sẽ đảo thứ tự theo key. Quá nhiều partition cũng tốn tài nguyên.

> Không muốn tự vận hành: dùng dịch vụ managed (Confluent Cloud, AWS MSK, Aiven, Redpanda Cloud...).

---

## 4. Giám sát

| Chỉ số | Ý nghĩa | Cảnh báo khi |
|---|---|---|
| **Consumer lag** | Số message chưa xử lý | Tăng liên tục |
| `UnderReplicatedPartitions` | Partition thiếu replica đồng bộ | > 0 |
| `OfflinePartitionsCount` | Partition không có leader | > 0 (nghiêm trọng) |
| `ActiveControllerCount` | Số controller đang hoạt động | ≠ 1 |
| Request latency, network | Hiệu năng broker | Tăng đột biến |
| Dung lượng đĩa | | > 70–80% |
| Tần suất rebalance | | Rebalance liên tục |

Công cụ: Kafka UI / AKHQ / Redpanda Console (xem dữ liệu), Prometheus + JMX exporter + Grafana (metrics), Burrow / kafka-lag-exporter (lag).

Kiểm tra nhanh bằng CLI:

```bash
kafka-consumer-groups $BS --describe --group email-service           # lag
kafka-topics $BS --describe --under-replicated-partitions            # partition thiếu replica
kafka-topics $BS --describe --unavailable-partitions                 # partition không có leader
```

---

## 5. Xử lý sự cố

| Triệu chứng | Nguyên nhân thường gặp / Cách xử lý |
|---|---|
| Client treo, `Connection refused` tới host lạ | Sai `ADVERTISED_LISTENERS` (xem [02](02-setup.md#2-hiểu-listener-hay-gây-lỗi-nhất)) |
| Consumer chạy nhưng không nhận message | Group đã có offset ở cuối → `fromBeginning` không tác dụng; reset offset hoặc đổi group |
| Hai service "giành" message của nhau | Dùng chung `groupId` → mỗi service một group |
| Thêm consumer mà không nhanh hơn | Số consumer ≥ số partition → tăng partition |
| Lag tăng liên tục | Xử lý chậm → tối ưu, scale consumer (≤ partition), `partitionsConsumedConcurrently`, xử lý theo batch |
| Một partition lag, các partition khác bình thường | Key bị lệch (hot key) hoặc message lỗi chặn partition → DLQ |
| Message bị xử lý trùng | Bình thường với at-least-once (rebalance, crash) → consumer idempotent |
| Rebalance liên tục | Xử lý quá lâu, thiếu heartbeat, consumer crash loop (mục 1) |
| `The group is rebalancing` khi reset offset | Còn consumer đang chạy → tắt hết trước |
| `MESSAGE_TOO_LARGE` | Message > `max.message.bytes` → gửi URL thay vì nội dung lớn |
| `NOT_ENOUGH_REPLICAS` | Số replica trong ISR < `min.insync.replicas` → kiểm tra broker chết |
| Đĩa đầy | Retention quá dài / quá nhiều dữ liệu → giảm `retention.ms`, thêm đĩa/broker |
| `InvalidReplicationFactor` khi tạo topic | `replication-factor` > số broker |

---

## 6. Hệ sinh thái

| Công cụ | Dùng để |
|---|---|
| **Kafka Connect** | Đồng bộ dữ liệu Kafka ↔ DB/S3/Elasticsearch mà không viết code (connector) |
| **Debezium** | CDC: bắt thay đổi từ MySQL/Postgres/Mongo thành event Kafka |
| **Schema Registry** | Quản lý schema (Avro/Protobuf/JSON Schema), kiểm tra tương thích khi đổi cấu trúc |
| **Kafka Streams / ksqlDB / Flink** | Xử lý stream: lọc, join, tổng hợp theo cửa sổ thời gian |
| **MirrorMaker 2** | Sao chép dữ liệu giữa các cluster (DR, multi-region) |
