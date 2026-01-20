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
        eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
            const transaction = await producer.transaction();

            try {
                for (const message of batch.messages) {
                    const input = JSON.parse(message.value.toString());

                    const output = transform(input);

                    await transaction.send({
                        topic: 'order_processed',
                        messages: [{ value: JSON.stringify(output) }]
                    });

                    resolveOffset(message.offset);
                }

                await transaction.sendOffsets({
                    consumerGroupId: 'order-group',
                    topics: [
                        {
                            topic: batch.topic,
                            partitions: [
                                {
                                    partition: batch.partition,
                                    offset: batch.lastOffset()
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
