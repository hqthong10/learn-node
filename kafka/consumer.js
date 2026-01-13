const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'order-consumer',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'email-service' });

async function run() {
    await consumer.connect();
    await consumer.subscribe({
        topic: 'order_created',
        fromBeginning: true
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const raw = message.value.toString();
            const data = JSON.parse(raw);

            console.log('Received order:', data);
        }
    });
}

run().catch(console.error);
