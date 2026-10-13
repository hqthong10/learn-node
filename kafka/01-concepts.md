# 01 — Khái niệm cốt lõi

[← Mục lục](README.md) · Tiếp: [02 — Cài đặt](02-setup.md)

## 1. Kafka là gì

**Apache Kafka** là nền tảng **event streaming**: một "cuốn sổ nhật ký" phân tán, chỉ ghi thêm (append-only), nhiều hệ thống cùng ghi và cùng đọc.

| | Message queue truyền thống (RabbitMQ...) | Kafka |
|---|---|---|
| Sau khi đọc | Message bị xóa | Message **vẫn được giữ** (theo retention) |
| Đọc lại | Không | Có, tua offset về bất kỳ đâu |
| Nhiều bên cùng đọc | Phải nhân bản queue | Mỗi consumer group đọc độc lập |
| Thông lượng | Vừa | Rất cao (hàng triệu msg/s) |
| Phù hợp | Task queue, RPC, routing phức tạp | Event-driven, log, analytics, đồng bộ dữ liệu |

**Dùng Kafka khi:** một sự kiện (vd `order_created`) cần được nhiều service xử lý (email, hóa đơn, thống kê), cần đọc lại lịch sử, hoặc lưu lượng lớn.

---

## 2. Các thành phần

| Thuật ngữ | Ý nghĩa |
|---|---|
| **Broker** | Một server Kafka. Nhiều broker = **cluster** |
| **Topic** | Kênh chứa message cùng loại, vd `order_created` |
| **Partition** | Topic được chia thành nhiều partition — đơn vị lưu trữ và song song |
| **Offset** | Số thứ tự của message trong một partition (0, 1, 2...) |
| **Message / Record** | Gồm `key`, `value`, `headers`, `timestamp` |
| **Producer** | Bên ghi message |
| **Consumer** | Bên đọc message |
| **Consumer group** | Nhóm consumer cùng làm một việc, chia nhau partition |
| **Replica** | Bản sao partition trên broker khác, chống mất dữ liệu |
| **Controller (KRaft)** | Quản lý metadata cluster. Thay thế ZooKeeper từ Kafka 3.3+, Kafka 4.0 bỏ hẳn ZooKeeper |

---

## 3. Partition & thứ tự

```
Topic: order_created

Partition 0:  A → B → C → D      offset 0,1,2,3
Partition 1:  E → F → G          offset 0,1,2
Partition 2:  H → I              offset 0,1
```

- Một topic luôn có **≥ 1 partition**.
- **Trong một partition**: message luôn đúng thứ tự.
- **Giữa các partition**: Kafka **không** đảm bảo thứ tự.

**Vì sao cần partition?** Một partition chỉ được một consumer trong group đọc → nhiều partition = nhiều consumer đọc song song = scale.

**Message vào partition nào?**

| Trường hợp | Cách chọn |
|---|---|
| Có `key` | `hash(key) % số_partition` → cùng key luôn vào cùng partition |
| Không có `key` | Rải đều (sticky / round-robin) |

> 👉 Cần thứ tự cho từng đơn hàng → dùng `key: orderId`. Mọi event của đơn đó vào cùng partition, đúng thứ tự.

---

## 4. Consumer group

Consumer group = nhóm backend cùng làm một việc. Kafka chia partition cho các thành viên:

```
Topic 3 partition, group "email-service":

1 consumer:   C1 ← P0, P1, P2
2 consumer:   C1 ← P0, P1     C2 ← P2
3 consumer:   C1 ← P0   C2 ← P1   C3 ← P2
4 consumer:   C1 ← P0   C2 ← P1   C3 ← P2   C4 (ngồi chơi)
```

- Mỗi partition chỉ có **1 consumer trong group** đọc → không xử lý trùng.
- Số consumer > số partition → consumer thừa không làm gì.
- **Cùng group → chia việc. Khác group → mỗi group nhận đủ toàn bộ message.**
- Đặt sai `groupId` = sai kiến trúc (vd hai service khác nhau dùng chung group sẽ "giành" message của nhau).

Mỗi group lưu **offset đã commit** cho từng partition (trong topic nội bộ `__consumer_offsets`) → biết lần sau đọc tiếp từ đâu.

```
Partition 0:  [0][1][2][3][4][5][6][7]
                          ▲           ▲
              committed offset    log end offset
                          └── lag = 4 ┘
```

**Lag** = số message chưa xử lý. Lag tăng liên tục = consumer xử lý không kịp.

---

## 5. Replication

```
Partition 0 (replication-factor = 3)
  Broker 1: Leader    ◄── producer ghi, consumer đọc
  Broker 2: Follower  (copy từ leader)
  Broker 3: Follower
```

- **Leader** nhận mọi ghi/đọc; **follower** sao chép.
- **ISR** (In-Sync Replicas): các replica đang bắt kịp leader.
- Leader chết → một follower trong ISR lên làm leader.
- Dev local: `replication-factor 1`. Production: thường `3`.

---

## 6. Lưu trữ

- Message được ghi xuống đĩa, giữ theo **retention** (mặc định 7 ngày), đọc rồi vẫn còn.
- Hai chính sách dọn dẹp:
  - `delete`: xóa message cũ theo thời gian/dung lượng.
  - `compact`: chỉ giữ message **mới nhất cho mỗi key** (dùng cho trạng thái, vd profile user).

Chi tiết ở [06 — Production](06-production.md).
