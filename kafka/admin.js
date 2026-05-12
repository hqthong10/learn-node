import { Kafka } from 'kafkajs';

const admin = kafka.admin();

await admin.connect();

await admin.createTopics({
  topics: [
    {
      topic: "order-events",
      numPartitions: 3,
      replicationFactor: 1
    }
  ]
});

await admin.disconnect();