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
// let ffmpeg_args = [
//   "-y",
//   "-i",
//   "https://storage.googleapis.com/as-piepme/19802/livestream/19802.e9cf347c58fb9a0606d54cd52ec62bd0/index.m3u8",
//   "-vn",
//   "-acodec",
//   "copy",
//   "output.aac",
// ].concat();

// step 2
let ffmpeg_args = [
  "-y",
  "-loop",
  "1",
  "-framerate",
  "1",
  "-i",
  "https://cdn.piepme.com/2553/images/piep-8CldRiib16968201874871696820187487.jpeg",
  "-i",
  "output.aac",
  "-tune",
  "stillimage",
  // "-s", "1280x720",
  "-vf",
  "scale=1280:720",
  "-c:v",
  "libx264",
  "-c:a",
  "aac",
  // "-r", "30",
  "-t",
  "5359",
  "neu-ca-doi-khong-ket-hon.mp4",
].concat();

// let ffmpeg_args = [
//   "-y",
//   "-i",
//   "output.aac",
//   "-acodec",
//   "libmp3lame",
//   "neu-ca-doi-khong-ket-hon.mp3",
// ].concat();

let child = spawn("ffmpeg", ffmpeg_args);
child.stderr.setEncoding("utf8");

child.stderr.on("data", function (data) {
  console.log("data >>>> ", data);
});

child.on("error", function (err) {
  console.log("error >>>> ", err);
});

child.on("close", function (code) {
  console.log("close >>>> ", code);
});
