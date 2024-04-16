const { spawn } = require("child_process");

let downm3u8 = [
  "-y",

  "-i",
  "../temp/20805-LIVE-00006236/index.full.m3u8",
  // "https://livestreamcdn.webinaris.co/hlssave/7584-LIVE-00006376/index.full.m3u8",

  "-map",
  "0:v",

  "-c:v",
  "copy",

  "-map",
  "0:a",

  "-bsf:a",
  "aac_adtstoasc",

  "-threads",
  "2",

  "../temp/20805-LIVE-00006236.mp4",
].concat();

let child = spawn("ffmpeg", downm3u8);
// let child = spawn("ffprobe", downm3u8);
child.stderr.setEncoding("utf8");

child.stdout.on("data", (data) => {
  console.log(`Đầu ra từ FFmpeg: ${data}`);
});

child.stderr.on("data", function (data) {
  console.log("data >>>> ", data);
});

child.on("error", function (err) {
  console.log("error >>>> ", err);
  // child.kill();
});

child.on("close", function (code) {
  console.log("close >>>> ", code);
});

//
