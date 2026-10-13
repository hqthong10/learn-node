# 04 — Node.js với KafkaJS

[← Mục lục](README.md) · Trước: [03 — CLI](03-cli.md) · Tiếp: [05 — Độ tin cậy](05-reliability.md)

```bash
npm install kafkajs
```

> KafkaJS dễ dùng, thuần JS, phổ biến nhất để học. Nó gần như không còn được phát triển tích cực; dự án production mới có thể cân nhắc `@confluentinc/kafka-javascript` (API gần giống KafkaJS, chạy trên librdkafka).

## 1. Kết nối

```js
import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092'],
  logLevel: logLevel.WARN,
});
```

Tách ra một file `kafka.js` và `import` lại ở producer/consumer/admin.

---

## 2. Producer

```js
const producer = kafka.producer();
await producer.connect();

await producer.send({
  topic: 'order_created',
  messages: [
    {
      key: 'o123',                                   // cùng key → cùng partition → đúng thứ tự
      value: JSON.stringify({ orderId: 'o123', amount: 500000 }),
      headers: { 'event-type': 'order.created' },
    },
  ],
});

await producer.disconnect();
```

Ghi chú:
- `value` (và `key`) phải là **string hoặc Buffer** → luôn `JSON.stringify`.
- **Connect một lần** khi app khởi động, dùng lại suốt vòng đời; đừng connect/disconnect mỗi request.
- Gửi nhiều message trong một `send` (mảng `messages`) nhanh hơn gọi `send` nhiều lần.
- Gửi tới nhiều topic một lần: `producer.sendBatch({ topicMessages: [...] })`.

Tùy chọn quan trọng:

```js
const producer = kafka.producer({
  idempotent: true,          // chống ghi trùng khi retry (xem file 05)
  maxInFlightRequests: 5,
});

await producer.send({
  topic: 'order_created',
  acks: -1,                  // -1 = all (an toàn nhất, mặc định) | 1 = chỉ leader | 0 = không chờ
  compression: CompressionTypes.GZIP,   // import { CompressionTypes } from 'kafkajs'
  messages: [...],
});
```

Xem ví dụ: [producer.js](producer.js).

---

## 3. Consumer

```js
const consumer = kafka.consumer({ groupId: 'email-service' });

await consumer.connect();
await consumer.subscribe({ topics: ['order_created'], fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message, heartbeat }) => {
    const data = JSON.parse(message.value.toString());
    const key = message.key?.toString();

    await sendEmail(data);
    // hàm return không lỗi → KafkaJS đánh dấu message đã xử lý (auto commit)
    // hàm throw → KafkaJS retry, rồi consumer sẽ bị restart
  },
});
```

| Tùy chọn | Đặt ở đâu | Ý nghĩa |
|---|---|---|
| `groupId` | `kafka.consumer()` | Bắt buộc. Xác định group |
| `fromBeginning` | `subscribe()` | Group **mới** (chưa có offset) đọc từ đầu thay vì chỉ message mới. Group đã có offset thì không có tác dụng |
| `topics` | `subscribe()` | Mảng tên hoặc regex: `[/^order_.*/]` |
| `autoCommit` | `consumer.run()` | Mặc định `true`. `false` = tự commit (xem file 05) |
| `partitionsConsumedConcurrently` | `consumer.run()` | Xử lý song song nhiều partition trong 1 consumer (mặc định 1) |

> ⚠️ Lỗi hay gặp:
> - `autoCommit` đặt trong `consumer.run()`, **không phải** `subscribe()` — đặt ở `subscribe` sẽ bị bỏ qua.
> - Chỉ dùng **một** trong `eachMessage` hoặc `eachBatch`, không dùng cả hai.
> - Biến khai báo trong `try` không dùng được trong `catch` → khai báo `raw` bên ngoài `try` nếu muốn log.

### `eachBatch` — xử lý theo lô

Dùng khi cần ghi DB hàng loạt, hoặc tự kiểm soát offset:

```js
await consumer.run({
  eachBatchAutoResolve: false,
  eachBatch: async ({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary, isRunning, isStale }) => {
    for (const message of batch.messages) {
      if (!isRunning() || isStale()) break;      // đang rebalance/tắt → dừng

      await process(JSON.parse(message.value.toString()));

      resolveOffset(message.offset);             // đánh dấu đã xử lý
      await heartbeat();                         // báo còn sống (batch dài)
    }
    await commitOffsetsIfNecessary();
  },
});
```

Xem ví dụ đầy đủ: [consumer-template.js](consumer-template.js).

### Pause / resume / seek

```js
consumer.pause([{ topic: 'order_created' }]);    // tạm dừng (vd DB quá tải)
consumer.resume([{ topic: 'order_created' }]);
consumer.seek({ topic: 'order_created', partition: 0, offset: '100' });  // nhảy tới offset
```

---

## 4. Admin

```js
const admin = kafka.admin();
await admin.connect();

await admin.createTopics({
  topics: [{ topic: 'order_created', numPartitions: 3, replicationFactor: 1 }],
});

await admin.listTopics();
await admin.fetchTopicMetadata({ topics: ['order_created'] });
await admin.fetchTopicOffsets('order_created');
await admin.fetchOffsets({ groupId: 'email-service', topics: ['order_created'] });   // tính lag
await admin.deleteTopics({ topics: ['order_created'] });

await admin.disconnect();
```

> Production nên tắt tự tạo topic (`auto.create.topics.enable=false`) và tạo topic có chủ đích bằng admin/CLI/IaC, để kiểm soát số partition và replication.

Xem ví dụ: [admin.js](admin.js).

---

## 5. Tắt app gọn gàng

Không disconnect → group phải chờ timeout mới rebalance, message đang xử lý dở có thể bị xử lý lại.

```js
const shutdown = async () => {
  try {
    await consumer.disconnect();   // commit offset, rời group ngay
    await producer.disconnect();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
```

---

## 6. Sự kiện (instrumentation)

```js
consumer.on(consumer.events.CRASH, (e) => console.error('crash', e.payload.error));
consumer.on(consumer.events.GROUP_JOIN, (e) => console.log('assigned', e.payload.memberAssignment));
consumer.on(consumer.events.REBALANCING, () => console.log('rebalancing...'));
```

---

## 7. Thiết kế message

```json
{
  "eventId": "9f1c...-uuid",
  "eventType": "order.created",
  "version": 1,
  "occurredAt": "2026-10-13T08:00:00Z",
  "data": { "orderId": "o123", "userId": "u01", "amount": 500000 }
}
```

- **`eventId`** duy nhất → consumer dùng để chống xử lý trùng.
- **`version`** → thay đổi cấu trúc mà không làm vỡ consumer cũ.
- **Tên topic**: danh từ + quá khứ, nhất quán: `order_created`, `payment_failed` (hoặc `orders.created`).
- **Key**: id của thực thể cần giữ thứ tự (`orderId`, `userId`).
- Message nhỏ (< 1MB). File lớn → upload lên storage, message chỉ chứa URL.
