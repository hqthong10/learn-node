const { spawn } = require("child_process");
// let ffmpeg_args = [
//   "-y",

//   "-i",
//   "https://storage.googleapis.com/as-piepme/19802/livestream/19802.bb782e98994e9205179c3bce0c6ca18e/index.m3u8",
//   // "-vn",

//   "-loop",
//   "1",
//   "-i",
//   "https://cdn.piepme.com/19540/images/s720-piep-LREskoY316922670555831692267055583.jpeg",

//   "-c",
//   "copy",
//   "-c:a",
//   "aac",
//   "-bsf:a",
//   "aac_adtstoasc",
//   "-c:v",
//   "libx264",
//   "-aspect",
//   "16:9",
//   "-s",
//   "1280x720",
//   "-b:a",
//   "128k",
//   "-strict",
//   "experimental",
//   "-crf",
//   "24",
//   "final.mp4",
// ].concat();

// step 1
let ffmpeg_args = [
  "-y",
  "-i",
  "https://storage.googleapis.com/as-piepme/19802/livestream/19802.bb782e98994e9205179c3bce0c6ca18e/index.m3u8",
  "-vn",
  "-acodec",
  "copy",
  "output.aac",
].concat();

// step 2
// let ffmpeg_args = [
//   "-y",
//   "-loop",
//   "1",
//   "-i",
//   "https://cdn.piepme.com/19540/images/piep-LREskoY316922670555831692267055583.jpeg",
//   "-i",
//   "output.aac",
//   "-c:v",
//   "libx264",
//   "-c:a",
//   "aac",
//   // "-strict",
//   // "experimental",
//   // "-b:a",
//   // "192k",
//   // "-shortest",
//   "output2.mp4",
// ].concat();

let child = spawn("ffmpeg", ffmpeg_args);
child.stderr.setEncoding("utf8");

child.stderr.on("data", function (data) {
  // Example data: frame= 8026 fps= 20 q=28.0 size=   61296kB time=00:06:38.46 bitrate=1260.2kbits/s speed=1.01x
  console.log("data >>>> ", data);
});

child.on("error", function (err) {
  console.log("error >>>> ", err);
});

child.on("close", function (code) {
  console.log("close >>>> ", code);
});
