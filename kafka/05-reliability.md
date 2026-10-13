# 05 — Độ tin cậy: commit, trùng lặp, transaction, retry

[← Mục lục](README.md) · Trước: [04 — Node.js](04-nodejs.md) · Tiếp: [06 — Production](06-production.md)

## 1. Ba mức đảm bảo

| Mức | Ý nghĩa | Khi nào xảy ra |
|---|---|---|
| **At-most-once** | Có thể **mất**, không trùng | Commit offset **trước** khi xử lý |
| **At-least-once** | Không mất, có thể **trùng** | Commit offset **sau** khi xử lý — **mặc định, dùng phổ biến nhất** |
| **Exactly-once** | Không mất, không trùng | Transaction Kafka→Kafka, hoặc at-least-once + idempotent |

> 👉 Thực tế: chấp nhận **at-least-once** và làm consumer **idempotent** (xử lý 2 lần cho kết quả như 1 lần).

---

## 2. Phía producer: không mất, không ghi trùng

| Cấu hình | Giá trị an toàn | Lý do |
|---|---|---|
| `acks` | `-1` (all) | Chờ tất cả replica trong ISR ghi xong |
| `idempotent` | `true` | Broker loại bỏ bản ghi trùng khi producer retry |
| Topic `replication.factor` | `3` | Mất 1 broker vẫn còn dữ liệu |
| Topic `min.insync.replicas` | `2` | Ít nhất 2 bản ghi xong mới coi là thành công |

```js
const producer = kafka.producer({ idempotent: true });
await producer.send({ topic, acks: -1, messages });
```

**Ghi DB và gửi Kafka cùng lúc** (vd tạo đơn rồi bắn `order_created`) — nếu ghi DB xong mà gửi Kafka lỗi, sẽ lệch dữ liệu. Giải pháp: **Outbox pattern**:

```
1. Transaction DB: INSERT orders + INSERT outbox(event)   ← cùng một transaction
2. Worker đọc bảng outbox → gửi Kafka → đánh dấu đã gửi
```

---

## 3. Phía consumer: commit offset

### Auto commit (mặc định)

```js
await consumer.run({
  eachMessage: async ({ message }) => {
    await handle(message);   // không throw → coi như xong
  },
});
```

KafkaJS chỉ commit những message mà `eachMessage` đã chạy xong không lỗi. Nhưng commit được gom định kỳ, nên nếu consumer chết giữa chừng, vài message đã xử lý có thể bị xử lý lại → **vẫn cần idempotent**.

### Commit tay

```js
await consumer.run({
  autoCommit: false,
  eachMessage: async ({ topic, partition, message }) => {
    await handle(message);
    await consumer.commitOffsets([
      { topic, partition, offset: (Number(message.offset) + 1).toString() },
    ]);
  },
});
```

> ⚠️ Offset commit là offset **tiếp theo cần đọc** → luôn `offset + 1`.

Với `eachBatch`: gọi `resolveOffset(message.offset)` cho từng message xong, rồi `commitOffsetsIfNecessary()` — KafkaJS tự cộng 1. Xem [consumer-template.js](consumer-template.js).

---

## 4. Consumer idempotent

Cách phổ biến: lưu `eventId` đã xử lý với **unique index**, trong cùng transaction với nghiệp vụ.

```js
eachMessage: async ({ message }) => {
  const event = JSON.parse(message.value.toString());

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await ProcessedEvent.create([{ _id: event.eventId }], { session });  // trùng → lỗi duplicate key
      await Order.updateOne({ _id: event.data.orderId }, { status: 'paid' }, { session });
    });
  } catch (err) {
    if (err.code === 11000) return;   // đã xử lý rồi → bỏ qua, coi như thành công
    throw err;
  } finally {
    await session.endSession();
  }
};
```

Cách khác: thiết kế thao tác tự nhiên idempotent — `SET status = 'paid'` thay vì `balance = balance + 100`; upsert theo id.

---

## 5. Transaction (exactly-once Kafka → Kafka)

Dùng khi **đọc từ topic A → xử lý → ghi topic B**, muốn "ghi B" và "commit offset A" thành công hoặc thất bại cùng nhau.

```js
const producer = kafka.producer({
  transactionalId: 'order-processor-1',   // duy nhất & cố định cho mỗi instance
  idempotent: true,
  maxInFlightRequests: 1,
});
const consumer = kafka.consumer({ groupId: 'order-processor', readUncommitted: false });

await consumer.run({
  autoCommit: false,
  eachBatch: async ({ batch }) => {
    const tx = await producer.transaction();
    try {
      for (const m of batch.messages) {
        await tx.send({ topic: 'order_processed', messages: [{ value: transform(m.value) }] });
      }
      await tx.sendOffsets({
        consumerGroupId: 'order-processor',
        topics: [{
          topic: batch.topic,
          partitions: [{ partition: batch.partition, offset: (Number(batch.lastOffset()) + 1).toString() }],
        }],
      });
      await tx.commit();
    } catch (err) {
      await tx.abort();
      throw err;
    }
  },
});
```

- `consumerGroupId` trong `sendOffsets` phải **trùng** `groupId` của consumer.
- Consumer phía sau phải đọc với `readUncommitted: false` (mặc định) để không thấy message của transaction bị abort.
- Transaction **không** bao gồm DB bên ngoài → với DB vẫn dùng idempotent / outbox.

Xem ví dụ: [consumer-transaction.js](consumer-transaction.js).

---

## 6. Retry & Dead Letter Queue (DLQ)

Một message lỗi mãi (dữ liệu hỏng, bug) sẽ **chặn cả partition** nếu cứ throw. Phân loại lỗi:

| Loại lỗi | Ví dụ | Xử lý |
|---|---|---|
| Tạm thời | DB timeout, API 503 | Retry có backoff |
| Vĩnh viễn | JSON hỏng, thiếu field, vi phạm nghiệp vụ | Đẩy sang DLQ, commit, đi tiếp |

```js
eachMessage: async ({ topic, partition, message }) => {
  try {
    await withRetry(() => handle(message), { retries: 3, backoffMs: 500 });
  } catch (err) {
    await producer.send({
      topic: `${topic}.dlq`,
      messages: [{
        key: message.key,
        value: message.value,
        headers: {
          'x-error': err.message,
          'x-original-topic': topic,
          'x-original-partition': String(partition),
          'x-original-offset': message.offset,
        },
      }],
    });
    // không throw → offset được commit, partition không bị chặn
  }
};
```

Mô hình nâng cao: `orders` → lỗi → `orders.retry.5m` → lỗi → `orders.retry.1h` → lỗi → `orders.dlq`. Có công cụ/dashboard để xem và đẩy lại message từ DLQ.

---

## 7. Checklist

- [ ] Producer: `idempotent: true`, `acks: -1`
- [ ] Topic: `replication.factor=3`, `min.insync.replicas=2` (production)
- [ ] Message có `eventId` duy nhất
- [ ] Consumer idempotent (unique `eventId` hoặc thao tác tự nhiên idempotent)
- [ ] Lỗi vĩnh viễn → DLQ, không throw vô hạn
- [ ] Ghi DB + gửi event → outbox pattern
- [ ] Tắt app có `consumer.disconnect()`
