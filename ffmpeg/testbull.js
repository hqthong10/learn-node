const Bull = require("bull");
const { spawn } = require("child_process");

const testQueue = new Bull("BullTest2", {
  redis: { port: 6379, host: "127.0.0.1", password: "" },
  //   limiter: {
  //     max: 1,
  //     duration: 500, // Đơn vị là milliseconds, thời gian đợi giữa các công việc mới.
  //   },
});

testQueue.process(1, (job, done) => {
  const name = job.data.name;
  console.log("vao cong viec", name);
  //   done(null, "ok");
  const _childConvert = spawn("node", ["liveconvertLVLE.js", name]);

  _childConvert.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  _childConvert.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  _childConvert.on("close", async (code) => {
    console.log(`child process exited with code ${code}`);

    done(null, `child process exited with code ${code}`);
  });
});

testQueue.on("completed", function (job, result) {
  console.log("completed", job.data ?? "", result ?? "");
});

testQueue.add({ name: "1" });

testQueue.add({ name: "2" });

testQueue.add({ name: "3" });
