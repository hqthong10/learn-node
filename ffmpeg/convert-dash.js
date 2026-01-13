const { spawn } = require("child_process");




let ffmpeg_args = [
  "-y",
  "-i", "inp/1761914028149.mp4",
  
  '-threads', '2',
  '-preset', 'veryfast',
  '-min_seg_duration', '5000',
  '-use_timeline', '1',
  '-use_template', '1',
  '-adaptation_sets', "id=0,streams=v id=1,streams=a",
  '-media_seg_name', "seg-\$RepresentationID\$-\$Number%05d\$.m4s",
  '-f', 'dash',
  'out/dash/manifest.mpd'
].concat();

// let child = spawn("ffprobe", ffmpeg_args);
let child = spawn("ffmpeg", ffmpeg_args);

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