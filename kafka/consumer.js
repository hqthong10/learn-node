import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'order-consumer',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'email-service' });

async function run() {
    await consumer.connect();
    await consumer.subscribe({
        topics: ['order_created'],
        fromBeginning: true // chỉ có tác dụng với group chưa có offset
    });

    await consumer.run({
        // autoCommit mặc định true: hàm chạy xong không throw → KafkaJS coi message đã xử lý
        eachMessage: async ({ partition, message }) => {
            const raw = message.value.toString();

            let event;
            try {
                event = JSON.parse(raw);
            } catch {
                // lỗi vĩnh viễn: không throw, nếu không message này sẽ chặn cả partition
                console.error('Invalid JSON', raw);
                return;
            }

            // xử lý nghiệp vụ; throw ở đây → KafkaJS retry rồi restart consumer
            console.log(`Received order (partition ${partition}, offset ${message.offset}):`, event);
        }
    });
}

const shutdown = async () => {
    try {
        await consumer.disconnect(); // commit offset, rời group ngay → rebalance nhanh
    } finally {
        process.exit(0);
    }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

run().catch(console.error);
