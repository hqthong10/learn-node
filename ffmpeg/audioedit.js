const { spawn } = require("child_process");

let downm3u8 = [
  "-y",

  "-i",
  "https://cdn.piepme.com/27380/sounds/piep-8xDawi2C17293943514631729394351463.mp3",

  // "-map",
  // "0:v",

  // "-c:v",
  // "copy",

  '-filter:a', "volume=4.0, afftdn", // anlmdn

  // '-b:a', '128k',

  // "-map",
  // "0:a",

  // "-bsf:a",
  // "aac_adtstoasc",

  // "-threads",
  // "2",

  "./out/thanh-trang-lan-nha-6.mp3",
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
