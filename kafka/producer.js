import { randomUUID } from 'node:crypto';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'order-producer',
    brokers: ['localhost:9092']
});

// idempotent: broker loại bỏ bản ghi trùng khi producer retry
const producer = kafka.producer({ idempotent: true });

function toMessage(order) {
    const event = {
        eventId: randomUUID(), // consumer dùng để chống xử lý trùng
        eventType: 'order.created',
        version: 1,
        occurredAt: new Date().toISOString(),
        data: order
    };

    // cùng key → cùng partition → giữ đúng thứ tự cho từng đơn hàng
    return { key: order.orderId, value: JSON.stringify(event) };
}

async function run() {
    await producer.connect();

    const orders = [
        { orderId: 'o123', userId: 'u01', amount: 500000 },
        { orderId: 'o124', userId: 'u01', amount: 500000 }
    ];

    await producer.send({
        topic: 'order_created',
        acks: -1, // chờ tất cả replica ghi xong
        messages: orders.map(toMessage)
    });

    console.log('Message sent');
    await producer.disconnect();
}

run().catch(console.error);
