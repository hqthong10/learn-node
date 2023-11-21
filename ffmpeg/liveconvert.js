const { spawn } = require("child_process");
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

  "-i",
  "14071-LIVE-00004963/index.full.m3u8",

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
  `
  [0:v]scale=1792:1008[v];
  [1:v]scale=1792:1008[pv2];
  [v][pv2]concat=n=2:v=1:a=0[outv];
  `,

  // [1:a]copy[pa2];
  // [v]split=1[tv1];
  // [tv1]trim=end=120[pv1];
  // [pv1][pv2]concat=n=2:v=1:a=0:unsafe=1[outv];
  // [tv2]trim=start=120[pv3];
  // [0:a]asplit=2[ta1][ta2];
  // [ta1]atrim=end=120,asetpts=PTS-STARTPTS[pa1];
  // [ta2]atrim=start=120,asetpts=PTS-STARTPTS[pa3];
  // [pa1][1:a][pa3]concat=n=3:v=0:a=1:unsafe=1[outa];

  "-map",
  "[outv]",

  // "-map",
  // "[pa2]",

  "-c:v",
  "libx264",

  "-crf",
  "23",

  "-preset",
  "veryfast",

  "-b:v",
  "4000k",

  "-c:a",
  "aac",
  "-b:a",
  "128k",

  "output.mp4",
].concat();

let child = spawn("ffmpeg", ffmpeg_args);
child.stderr.setEncoding("utf8");

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
