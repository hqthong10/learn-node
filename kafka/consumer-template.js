import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'order-consumer',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'email-service' });

// Giả lập bảng processed_events có unique index trên eventId
const processedEventIds = new Set();

async function markProcessed(eventId) {
    if (processedEventIds.has(eventId)) {
        const err = new Error('Event already processed');
        err.code = 'DUPLICATE_KEY';
        throw err;
    }
    processedEventIds.add(eventId);
}

async function processOrder(order) {
    console.log('Processing order:', order);
}

async function run() {
    await consumer.connect();
    await consumer.subscribe({
        topics: ['order_created'],
        fromBeginning: true
    });

    await consumer.run({
        autoCommit: false,           // tự commit offset
        eachBatchAutoResolve: false, // tự đánh dấu message đã xử lý
        eachBatch: async ({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary, isRunning, isStale }) => {
            for (const message of batch.messages) {
                // đang rebalance hoặc tắt → dừng, phần còn lại sẽ được đọc lại
                if (!isRunning() || isStale()) break;

                try {
                    const event = JSON.parse(message.value.toString());

                    // 1. Chống xử lý trùng (thực tế: insert cùng transaction với nghiệp vụ)
                    await markProcessed(event.eventId);

                    // 2. Xử lý nghiệp vụ
                    await processOrder(event.data);
                } catch (err) {
                    if (err.code !== 'DUPLICATE_KEY') {
                        console.error('Process failed', err);
                        // ❌ KHÔNG resolveOffset, KHÔNG commit
                        // → message này và các message sau sẽ được xử lý lại
                        break;
                    }
                    // đã xử lý trước đó → coi như xong
                }

                // 3. Đánh dấu message này đã xong
                resolveOffset(message.offset);

                // 4. Báo Kafka là consumer còn sống (batch dài)
                await heartbeat();
            }

            // 5. Commit các offset đã resolve (KafkaJS tự cộng 1)
            await commitOffsetsIfNecessary();
        }
    });
}

run().catch(console.error);
