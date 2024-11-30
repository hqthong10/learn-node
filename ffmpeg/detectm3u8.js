const { spawn } = require("child_process");

const newLocal = 'https://livestream.webinaris.co/hls/14071-LIVE-THONGTEST3/480p/index.m3u8';
let downm3u8 = [
  "-y",

  "-i",
  // "../temp/20805-LIVE-00006236/index.full.m3u8",  
  // "https://livestreamcdn.webinaris.co/hlssave/21569-LIVE-00007282/index.mp4",
  // "https://cdn.piepme.com/19968/livestream/19968.ab875dccc9809c38b90f95ee49f19427/index.m3u8",
  // 'https://livestreamcdn.webinaris.co/hlssave/14071-LIVE-00007329/index.mp4',
  // 'https://livestreamcdn.webinaris.co/hls/20052-LIVE-00007344/index.m3u8',
  // 'https://livestreamcdn.webinaris.co/hls/14071-LIVE-THONGTEST5/index.m3u8',
  // 'https://livevncdn.piepme.com/hls/18010.7f57c23c4f05a7ef99bb99aed334b647/720p/index.m3u8',
  // './inp/r-2.mp4',
  // newLocal,
  // 'rtmp://livestream.webinaris.co/hls/14071-LIVE-00007427',

  // "-v", "error", "-show_format", "-show_streams",
  // 'rtmp://livestream.webinaris.co/hls/14071-LIVE-00007506',
  // 'https://livevncdn.piepme.com/hls/29760.6d542494a5f407eafb97b5ff7370cd79/index.m3u8',
  // "https://livevncdn.piepme.com/hls/18010.c3abb5d25cfc1ac65a81a98ef67445e3/index.m3u8",
  "https://cdn.piepme.com/18010/livestream/18010.69e5a76f085f29fc9c55ef3ba916d893/index.m3u8",

  // '-vn',

  // '-s', '0',
  // '-t', '60',
  // "-c:v", "libx264",
  // "-c:a", "copy",
  // '-r', '30', 
  // '-g', '90',

  // '-preset', 'veryfast',
  // '-crf', '23',

  // "-bsf:a",
  // "aac_adtstoasc",


  // "out/thong/thong.m3u8",

  // '2>&1 stream_info.log'

].concat();

// 1792x1008
// 30 tbr
// 90k tbn
// h264
// app 44100 Hz, stereo

// web 48000 Hz, mono

// 1280x720 [SAR 1:1 DAR 16:9]

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
  // console.log("error >>>> ", err);
  // child.kill();
});

child.on("close", function (code) {
  console.log("close >>>> ", code);
});

//
