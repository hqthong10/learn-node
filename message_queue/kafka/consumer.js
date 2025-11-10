// consumer.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "parking-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "parking-group" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "vehicle-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`📥 Nhận từ topic [${topic}]:`, value);
    },
  });
};

run().catch(console.error);
