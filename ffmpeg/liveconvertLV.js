const { spawn } = require("child_process");
const fs = require("fs");

const m3u8link = "../temp/14071-LIVE-00005516/index.full.m3u8";

const videolink =
  "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4";

const vduration = 313;

const lv_args_1 = [
  "-y",
  "-i",
  `${m3u8link}`,
  "-c",
  "copy",
  "-threads",
  "2",
  "-f",
  "mpegts",
  "../temp/out/out1.ts",
];

const lv_args_2 = [
  "-y",
  "-i",
  `${videolink}`,

  "-ss",
  "0",
  "-t",
  `${vduration}`,

  // "-c",
  // "copy",

  "-c:a",
  "copy",
  "-vf",
  "scale=1920:1080::flags=fast_bilinear",

  "-preset",
  "ultrafast",

  "-f",
  "mpegts",
  "../temp/out/out2.ts",
];

function renderStep3(input1, input2) {
  return [
    "-y",
    "-i",
    `concat:${input1}|${input2}`,

    "-c",
    "copy",

    "-maxrate",
    "2500k",

    "-threads",
    "2",

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
}

const lv_args_4 = [
  "-y",
  "-i",
  "../temp/out/vtemp.m3u8",

  "-c:a",
  "aac",
  "-c:v",
  "libx264",

  "-preset",
  "ultrafast",

  "../temp/out/output.mp4",
];

const lv_args_3 = renderStep3("../temp/out/out1.ts", "../temp/out/out2.ts");
const vl_args_3 = renderStep3("../temp/out/out2.ts", "../temp/out/out1.ts");

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

// runCommand("step 2", lv_args_2, () => {
//   console.log("end");
// });

runCommand("step1", lv_args_1, () => {
  runCommand("step2", lv_args_2, () => {
    runCommand("step3", vl_args_3, () => {
      runCommand("step4", lv_args_4, () => {
        console.log("All processes completed.");
        // if (fs.existsSync("out1.ts")) fs.unlinkSync("out1.ts");
        // if (fs.existsSync("out2.ts")) fs.unlinkSync("out2.ts");
      });
    });
  });
});
