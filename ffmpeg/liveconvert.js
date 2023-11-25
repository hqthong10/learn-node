const { spawn } = require("child_process");

// let ffmpeg_args = [
//     '-f', 'concat',
//     '-y',
//     '-i', `media/hlssave/${name}/allts.pri.txt`,
//     '-c', "copy",
//     '-threads', '2',
//     `media/hlssave/${name}/index.mp4`,
// ].concat();

// LVE || VLE
// "[0:v]scale=1792:-2[v1];[1:v]scale=1792:-2[v2];[v1][0:a][v2][1:a]concat=n=2:v=1:a=1[outv][outa]",

// LVLE
// `[0:v]scale=1792:-2[v];
// [1:v]scale=1792:-2[pv2];
// [v]split=2[tv1][tv2];
// [tv1]select='lt(t,120)',setpts=PTS-STARTPTS[pv1];
// [tv2]select='gte(t,120)',setpts=PTS-STARTPTS[pv3];
// [0:a]asplit=2[ta1][ta2];
// [ta1]aselect='lt(t,120)',asetpts=PTS-STARTPTS[pa1];
// [ta2]aselect='gte(t,120)',asetpts=PTS-STARTPTS[pa3];
// [pv1][pv2][pv3]concat=n=3:v=1:a=0[outv];
// [pa1][1:a][pa3]concat=n=3:v=0:a=1[outa];`,

let ffmpeg_args = [
  "-y",

  "-vsync",
  "vfr",

  "-i",
  "../temp/14071-LIVE-00004957/index.full.m3u8",

  "-i",
  "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",

  "-filter_complex",

  // [v]split=2[tv1][tv2];
  // [tv1]select='lt(t,120)',setpts=PTS-STARTPTS[pv1];
  // [tv2]select='gte(t,120)',setpts=PTS-STARTPTS[pv3];

  // [0:a]asplit=2[ta1][ta2];
  // [ta1]aselect='lt(t,120)',asetpts=PTS-STARTPTS[pa1];
  // [ta2]aselect='gte(t,120)',asetpts=PTS-STARTPTS[pa3];
  // [pv1][pv2][pv3]concat=n=3:v=1:a=0[outv];
  // [pa1][1:a][pa3]concat=n=3:v=0:a=1[outa];

  // [v][0:a] [pv2][1:a] concat=n=2:v=1:a=1[outv][outa]
  // ,setpts=PTS-STARTPTS
  //
  // [0:v]scale=1792:1008,setsar=1[v0];

  // [0:v]trim=end=100,setpts=PTS-STARTPTS[v0];
  // [0:a]atrim=end=100,asetpts=PTS-STARTPTS[a0];
  // [0:v]trim=start=100,setpts=PTS-STARTPTS[v1];
  // [0:a]atrim=start=100,asetpts=PTS-STARTPTS[a1];
  // [v0][a0][1:v][1:a][v1][a1]concat=n=3:v=1:a=1[v][a];

  // [0:v]trim=0:100,setpts=PTS-STARTPTS,scale=1792:1008[v0];
  // [0:a]atrim=0:100,asetpts=PTS-STARTPTS[a0];
  // [0:v]trim=100,setpts=PTS-STARTPTS,scale=1792:1008[v1];
  // [0:a]atrim=100,asetpts=PTS-STARTPTS[a1];
  // [1:v]scale=1792:1008[v2];
  // [v0][a0][v2][1:a][v1][a1]concat=n=3:v=1:a=1[v][a]
  `
  [0:v]scale=1792:-2[v1];[1:v]scale=1792:-2[v2];[v1][0:a][v2][1:a]concat=n=2:v=1:a=1[v][a]
  `,
  // [1:a]aformat=sample_fmts=fltp:channel_layouts=stereo:sample_rates=44100[a2];

  "-map",
  "[v]",

  "-map",
  "[a]",

  "-crf",
  "23",

  "-b:v",
  "3000k",

  "-c:a",
  "aac",

  "-b:a",
  "128k",

  "-strict",
  "experimental",

  "../temp/output.mp4",
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

// `
// -i input.mp4 -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename temp/output_%03d.ts temp/output.m3u8 \
//        -i input2.mp4 -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename temp/output2_%03d.ts temp/output2.m3u8 \
//        -filter_complex "[0:v:0][1:v:0]concat=n=2:v=1:a=0[outv]" -map "[outv]" -c copy -bsf:a aac_adtstoasc output_combined.m3u8
// `;
