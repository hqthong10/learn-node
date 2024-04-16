const Queue = require("bull");

const audioQueue = new Queue("audio Transcoding", {
  redis: { port: 6379, host: "127.0.0.1", password: "" },
});

// audioQueue.process(function (job) {
//   // don't forget to remove the done callback!
//   // Simply return a promise
//   return fetchVideo(job.data.url).then(transcodeVideo);

//   // Handles promise rejection
//   return Promise.reject(new Error("error transcoding"));

//   // Passes the value the promise is resolved with to the "completed" event
//   return Promise.resolve({ framerate: 29.5 /* etc... */ });

//   // If the job throws an unhandled exception it is also handled correctly
//   throw new Error("some unexpected error");
//   // same as
//   return Promise.reject(new Error("some unexpected error"));
// });

// videoQueue.add({ video: "http://example.com/video1.mov" });

// Single process:
// queue.process("./processor.js");

audioQueue.on("completed", function (job, result) {
  // Job completed with output result!
  console.log("completed", result);
});

audioQueue.on("failed", function (error) {
  // An error occured.
  console.log(error);
});

// You can use concurrency as well:
console.log(__dirname);
audioQueue.process(1, __dirname + "/processor.js");
// audioQueue.process(
//   "~/Documents/projects/hqthong/learn-node/message_queue/bull/processor.js"
// );

// and named processors:
// queue.process("my processor", 5, "./processor.js");

// use like cronjob
// Repeat payment job once every day at 3:15 (am)
// paymentsQueue.add(paymentsData, { repeat: { cron: "15 3 * * *" } });

audioQueue.add({ audio: "http://example.com/audio1.mp3" });
