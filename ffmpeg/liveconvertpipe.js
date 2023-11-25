const { spawn } = require("child_process");
const fs = require("fs");

// Tạo ra quy trình để tách file A thành 2 phần
const lvl_args_1 = [
  "-y",
  "-i",
  "../temp/14071-LIVE-00004957/index.full.m3u8",
  "-ss",
  "0",
  "-t",
  "100",
  "-c",
  "copy",
  "-bsf:v",
  "h264_mp4toannexb",
  "-f",
  "mpegts",
  "out1.ts",
];

// Tạo ra quy trình để tách file A phần còn lại
const lvl_args_2 = [
  "-y",
  "-i",
  "../temp/14071-LIVE-00004957/index.full.m3u8",
  "-ss",
  "100",
  "-c",
  "copy",
  "-bsf:v",
  "h264_mp4toannexb",
  "-f",
  "mpegts",
  "out3.ts",
];

// Tạo ra quy trình để đổi tên file B thành out3.ts (nếu cần)
const lvl_args_3 = [
  "-y",
  "-i",
  "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",
  "-c",
  "copy",
  "-bsf:v",
  "h264_mp4toannexb",
  "-b:v",
  "2500k",
  "-f",
  "mpegts",
  "out2.ts",
];

// Tạo ra quy trình để concat các file ts
const lvl_args_4 = [
  "-y",
  "-i",
  "concat:out1.ts|out2.ts|out3.ts",
  "-c",
  "copy",
  "-bsf:a",
  "aac_adtstoasc",
  "-s",
  "1920:1080",
  "-b:v",
  "2500k",
  "-strict",
  "experimental",
  "output.mp4",
];

const lv_args_1 = [
  "-y",
  "-i",
  "../temp/14071-LIVE-00004957/index.full.m3u8",
  "-c",
  "copy",
  "-s",
  "1792:1008",
  "-bsf:v",
  "h264_mp4toannexb",
  "-f",
  "mpegts",
  "out1.ts",
];

const lv_args_2 = [
  "-y",
  "-i",
  "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",
  "-c",
  "copy",
  "-bsf:v",
  "h264_mp4toannexb",
  "-b:v",
  "2500k",
  "-f",
  "mpegts",
  "out2.ts",
];

const lv_args_3 = [
  "-y",
  "-i",
  "concat:out1.ts|out2.ts",
  "-c",
  "copy",
  "-bsf:a",
  "aac_adtstoasc",

  "-b:v",
  "2500k",

  // "-c:v",
  // "libx264",

  "-strict",
  "experimental",

  "output.mp4",
];

function runCommand(step, args, callback) {
  const process = spawn("ffmpeg", args);

  process.on("close", (code) => {
    console.log(`${step} process exited with code ${code}`);
    callback();
  });

  process.stderr.on("data", (data) => {
    console.error(`data ${step}: ${data}`);
  });
  return process;
}

// runCommand("step1", lvl_args_1, () => {
//   runCommand("step2", lvl_args_2, () => {
//     runCommand("step3", lvl_args_3, () => {
//       runCommand("step4", lvl_args_4, () => {
//         console.log("All processes completed.");
//         if (fs.existsSync("out1.ts")) fs.unlinkSync("out1.ts");
//         if (fs.existsSync("out2.ts")) fs.unlinkSync("out2.ts");
//         if (fs.existsSync("out3.ts")) fs.unlinkSync("out3.ts");
//       });
//     });
//   });
// });

runCommand("step1", lv_args_1, () => {
  runCommand("step2", lv_args_2, () => {
    runCommand("step3", lv_args_3, () => {
      console.log("All processes completed.");
      if (fs.existsSync("out1.ts")) fs.unlinkSync("out1.ts");
      if (fs.existsSync("out2.ts")) fs.unlinkSync("out2.ts");
    });
  });
});
