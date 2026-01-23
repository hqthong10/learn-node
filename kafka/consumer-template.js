import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'order-consumer',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'email-service' });

async function run() {
    await consumer.connect();
    
    await consumer.subscribe({
        topic: 'order_created',
        fromBeginning: true,
        autoCommit: true // bằng false thì chuyển sang chế độ commit tay
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            // xử lý xong
            // KafkaJS mới báo OK cho Kafka
            try {
                const raw = message.value.toString();
                const data = JSON.parse(raw);

                // 1. Xử lý nghiệp vụ
                // nên retry vài lần nếu gặp lỗi để đảm bảo
                console.log('Received order:', data);

                // 2. Nếu tới đây không lỗi
                // KafkaJS sẽ tự báo: message OK
            } catch (err) {
                console.error('Invalid JSON', raw);
            }
        },

        /**
         * dùng khi khai báo autoCommit: false
         * để tự xử lý message đã hoàn thành hay chưa
         */
        eachBatch: async ({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary }) => {
            for (const message of batch.messages) {
                const data = JSON.parse(message.value.toString());

                try {
                    // 1. Xử lý nghiệp vụ
                    await processOrder(data);

                    // 2. Đánh dấu message này đã xong
                    resolveOffset(message.offset);

                    // 3. Commit offset (có thể gom nhiều message)
                    await commitOffsetsIfNecessary();

                    // 4. Báo Kafka là consumer còn sống
                    await heartbeat();
                } catch (err) {
                    console.error('Process failed', err);
                    // ❌ KHÔNG resolveOffset
                    // ❌ KHÔNG commit
                    // → message sẽ được xử lý lại
                    break;
                }
            }
        },

        // example
        eachBatch: async ({ batch, resolveOffset, commitOffsetsIfNecessary }) => {
            for (const message of batch.messages) {
                const event = JSON.parse(message.value.toString());

                try {
                    await db.processed_events.insertOne({ eventId: event.eventId });

                    await processBusiness(event.data);

                    resolveOffset(message.offset);
                    await commitOffsetsIfNecessary();

                } catch (err) {
                    if (err.code === 'DUPLICATE_KEY') {
                        // đã xử lý → commit luôn
                        resolveOffset(message.offset);
                        await commitOffsetsIfNecessary();
                    } else {
                        throw err;
                    }
                }
            }
        }
    });
}

run().catch(console.error);
