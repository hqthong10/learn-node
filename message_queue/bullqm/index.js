const { Queue, Worker } = require("bullmq");

// Kết nối đến Redis
const queue = new Queue("my_queue", { limiter: { max: 1, duration: 1000 } });

// Tạo worker để xử lý các công việc từ hàng đợi
const worker = new Worker("my_queue", async (job) => {
  console.log(`[Server A] Received job: ${job.name}`);
  return job.data;
});

// Gửi công việc đến hàng đợi
async function sendJob() {
  const job = await queue.add("myJob", { someData: "Hello, Server B!" });
  console.log(`[Server A] Job sent: ${job.id}`);
}

// Thực hiện việc gửi công việc
sendJob();
