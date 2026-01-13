import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'order-producer',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function run() {
    await producer.connect();

    const order = {
        orderId: 'o123',
        userId: 'u01',
        amount: 500000,
        createdAt: new Date().toISOString()
    };
    const order2 = {
        orderId: 'o124',
        userId: 'u01',
        amount: 500000,
        createdAt: new Date().toISOString()
    };

    await producer.send({
        topic: 'order_created',
        messages: [
            { value: JSON.stringify(order) },
            { value: JSON.stringify(order2) }
        ]
    });

    console.log('Message sent');
    await producer.disconnect();
}

run().catch(console.error);
