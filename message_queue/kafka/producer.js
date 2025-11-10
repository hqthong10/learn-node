// producer.js
const { Kafka } = require("kafkajs");

// 1. Kết nối tới Kafka broker
const kafka = new Kafka({
  clientId: "parking-producer",
  brokers: ["localhost:9092"], // địa chỉ Kafka
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  // 2. Gửi message (giống như xe vào bãi)
  const message = {
    licensePlate: "59A-123.45",
    time: new Date().toISOString(),
    type: "car_in",
  };

  await producer.send({
    topic: "vehicle-events",
    messages: [
      { value: JSON.stringify(message) },
    ],
  });

  console.log("✅ Gửi thành công:", message);

  await producer.disconnect();
};

run().catch(console.error);
