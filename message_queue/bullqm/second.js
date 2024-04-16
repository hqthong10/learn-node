const { Queue, Worker } = require("bullmq");

// Kết nối đến Redis
const queue = new Queue("my_queue", { limiter: { max: 1, duration: 1000 } });

// Tạo worker để xử lý các công việc từ hàng đợi
const worker = new Worker("my_queue", async (job) => {
  console.log(`[Server B] Received job: ${job.name}`);
  return job.data;
});

// Chờ và xử lý công việc từ hàng đợi
worker.on("completed", (job, result) => {
  console.log(
    `[Server B] Job completed: ${job.id}, Result: ${result.someData}`
  );
});
