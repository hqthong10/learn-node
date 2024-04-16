const { spawn } = require("child_process");
const fs = require("fs");
const readline = require("readline");

let myArgs = process.argv;
console.log(`Worker ${process.pid} started`, myArgs);
let name = myArgs[2];

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

// const m3u8link = "../temp/14071-LIVE-00005516/index.full.m3u8";
// const m3u8link = "../temp/20322-LIVE-00005476/index.full.m3u8";
const m3u8link =
  "https://livestreamcdn.webinaris.co/hlssave/14071-LIVE-00005784/index.full.m3u8";

// const m3u8link =
//   "https://livestreamcdn.webinaris.co/hlssave/21043-LIVE-00005641/index.full.m3u8";

const videolink =
  "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4";

const vduration = 313;
const posStart = 63;

const lvl_args_1 = [
  "-y",
  "-i",
  `${m3u8link}`,

  "-ss",
  "0",
  "-t",
  `${posStart}`,

  "-c",
  "copy",

  "-preset",
  "ultrafast",

  "-f",
  "mpegts",

  "-threads",
  "2",

  "../temp/out/out1.ts",

  "-ss",
  `${posStart}`,

  "-c",
  "copy",

  "-preset",
  "ultrafast",

  "-f",
  "mpegts",

  "-threads",
  "2",

  "../temp/out/out3.ts",
];

const lvl_args_2 = [
  "-y",
  "-i",
  `${videolink}`,

  "-ss",
  "0",

  "-t",
  `${vduration}`,

  "-c",
  "copy",

  "-preset",
  "ultrafast",

  "-threads",
  "2",

  "-f",
  "mpegts",

  "../temp/out/out2.ts",
];

// Tạo ra quy trình để concat các file ts
const lvl_args_3 = [
  "-y",

  "-i",
  "concat:../temp/out/out1.ts|../temp/out/out2.ts",

  // "-fps_mode",
  // "cfr",

  "-c:a",
  "aac",

  "-c:v",
  "libx264",

  "-maxrate",
  "2000k",

  "-s",
  "1920:1080",

  "-preset",
  "ultrafast",

  "-strict",
  "-2",
  "-f",
  "hls",
  "-hls_time",
  "2",
  "-hls_list_size",
  "0",

  "-hls_segment_filename",
  "../temp/out/v_%01d.ts",
  "../temp/out/vtemp.m3u8",
];

const lvl_args_4 = [
  "-y",

  "-i",
  "../temp/out/vtemp.m3u8",

  "-c",
  "copy",

  "-preset",
  "ultrafast",

  "-threads",
  "2",

  `../temp/out/output-${name}.mp4`,
];

// const lvl_args_5 = ["-y", "-i", `${m3u8link}`];

// runCommand("single threads", lvl_args_4, () => {
//   console.log("end");
// });

// runCommand("step1", lvl_args_1, () => {
//   runCommand("step3", lvl_args_3, () => {
//     console.log("end");
//   });
// });

runCommand("step1", lvl_args_1, () => {
  runCommand("step2", lvl_args_2, () => {
    runCommand("step3", lvl_args_3, () => {
      runCommand("step4", lvl_args_4, () => {
        console.log("All processes completed.");
      });
    });
  });
});
