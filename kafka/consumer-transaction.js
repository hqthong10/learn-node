import { Kafka } from 'kafkajs';

// Đọc order_created → xử lý → ghi order_processed.
// "Ghi order_processed" và "commit offset order_created" thành công hoặc thất bại cùng nhau.

const GROUP_ID = 'order-processor';

const kafka = new Kafka({
    clientId: 'order-processor',
    brokers: ['localhost:9092']
});

const producer = kafka.producer({
    transactionalId: 'order-processor-1', // duy nhất & cố định cho mỗi instance
    idempotent: true,
    maxInFlightRequests: 1
});

// readUncommitted: false (mặc định) → không thấy message của transaction bị abort
const consumer = kafka.consumer({ groupId: GROUP_ID });

function transform(order) {
    return { ...order, processedAt: new Date().toISOString() };
}

async function run() {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
        topics: ['order_created'],
        fromBeginning: true
    });

    await consumer.run({
        autoCommit: false, // offset được commit trong transaction
        eachBatch: async ({ batch, heartbeat }) => {
            const transaction = await producer.transaction();

            try {
                for (const message of batch.messages) {
                    const input = JSON.parse(message.value.toString());
                    const output = transform(input);

                    await transaction.send({
                        topic: 'order_processed',
                        messages: [{ key: message.key, value: JSON.stringify(output) }]
                    });
                }

                await transaction.sendOffsets({
                    consumerGroupId: GROUP_ID, // phải trùng groupId của consumer
                    topics: [
                        {
                            topic: batch.topic,
                            partitions: [
                                {
                                    partition: batch.partition,
                                    // offset commit = offset tiếp theo cần đọc
                                    offset: (Number(batch.lastOffset()) + 1).toString()
                                }
                            ]
                        }
                    ]
                });

                await transaction.commit();
                await heartbeat();
            } catch (err) {
                await transaction.abort();
                throw err;
            }
        }
    });
}

run().catch(console.error);
