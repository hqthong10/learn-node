const { spawn } = require("child_process");

// let ffmpeg_args = [
//     '-f', 'concat',
//     '-y',
//     '-i', `media/hlssave/${name}/allts.pri.txt`,
//     '-c', "copy",
//     '-threads', '2',
//     `media/hlssave/${name}/index.mp4`,
// ].concat();

let ffmpeg_args = [
  "-y",

  "-vsync",
  "vfr",

  "-i",
  "../temp/14071-LIVE-00005157/index.full.m3u8",

  "-i",
  "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",

  "-filter_complex",

  // LV
  `[0:v]scale=1792:-2[v1];[1:v]scale=1792:-2[v2];[v1][0:a][v2][1:a]concat=n=2:v=1:a=1[v][a]`,

  // VL
  // `[0:v]scale=1792:-2[v1];[1:v]scale=1792:-2[v2];[v2][1:a][v1][0:a]concat=n=2:v=1:a=1[v][a]`,

  // LVL
  // `
  // [0:v]trim=0:100,setpts=PTS-STARTPTS,scale=1792:-2[v0];
  // [0:a]atrim=0:100,asetpts=PTS-STARTPTS[a0];
  // [0:v]trim=100,setpts=PTS-STARTPTS,scale=1792:-2[v1];
  // [0:a]atrim=100,asetpts=PTS-STARTPTS[a1];
  // [1:v]scale=1792:-2[v2];
  // [1:a]aformat=sample_fmts=fltp:channel_layouts=stereo:sample_rates=44100[a2];
  // [v0][a0][v2][a2][v1][a1]concat=n=3:v=1:a=1[v][a]
  // `,

  "-map",
  "[v]",

  "-map",
  "[a]",

  "-maxrate",
  "2500k",

  "-c:a",
  "aac",

  "-c:v",
  "libx264",

  // "-strict",
  // "2",

  "output.mp4",
].concat();

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
