import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'order-admin',
    brokers: ['localhost:9092']
});

const admin = kafka.admin();

await admin.connect();

await admin.createTopics({
    topics: [
        {
            topic: 'order_created',
            numPartitions: 3,
            replicationFactor: 1
        }
    ]
});

console.log('Topics:', await admin.listTopics());

await admin.disconnect();
