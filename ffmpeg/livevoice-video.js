const { spawn } = require("child_process");

const timeToSecond = (time) => {
  const arr = time.trim().split(":");
  const sum = arr.reduce((total, num, idx, ls) => {
    return total = (parseInt(num) * (60 ** (ls.length - (idx + 1)))) + total;
  }, 0)
  return sum;
}

// tao audio cho marketing
// const audio = "https://cdn.piepme.com/22244/livestream/22244.b12e2ce44b58493e3b3ba913bc84b9e5/index.m3u8";
// const image = "./inp/hinh.png";
// const tstart = '00:46';
// const tstop = '01:36';
// const outname = 'livevoice-loan-loan.mp4';
// const outname = 'truyenaudio-suoi-lac-lung-chung-nui.mp4';

// const audio = "https://cdn.piepme.com/22788/livestream/22788.c6e8b088fd4fcb7b4b8b5990a351cbd1/index.m3u8";
// const image = "inp/nhungnguyen.jpg";
// const tstart = '10:53';
// const tstop = '11:27';
// const outname = 'livevoice-nhung-nguyen.mp4';

const audio = "https://vnso-zn-23-tf-a128-z3.zmdcdn.me/0dea771ca2baa02d5656651f41e5a9a5?authen=exp=1729421042~acl=/0dea771ca2baa02d5656651f41e5a9a5*~hmac=a771557c1c0d7d433a83820098d66efb";
const image = "./inp/9.png";
const tstart = '00:40';
const tstop = '01:30';
const outname = 'livevoice-cau-9.mp4';

const duration = timeToSecond(tstop) - timeToSecond(tstart);
const isHD = true;

const args_step_1 =  [
  "-y",

  "-i", audio,

  // giây bắt đầu
  "-ss", tstart,

  // tổng thời giây của video
  "-to", tstop,

  "-c", "copy",

  // aac lỗi thì dùng mp3
  "./out/step1.mp3"
];

const args_step_2 =  [
  "-y",

  // image
  "-loop", "1",
  "-i", image,

  "-i", "./out/step1.mp3",
  
  "-c:v", "libx264",
  "-b:v", '2000k',

  "-c:a", "aac",
  
  "-vf",
  "scale=1280:720",

  "-pix_fmt",
  "yuv420p",
  "-shortest",

  // tổng thời giây của video
  "-t", duration,

  "./out/step2.mp4"
];

const args_step_3 =  [
  "-y",

  "-i", 
  "out/step2.mp4",

  // video
  "-stream_loop", "100",
  "-an",
  "-i", "inp/livevoice.mp4",
  
  "-filter_complex",
  "[1]scale=150:150 [wm]; [0][wm] overlay=10:main_h-overlay_h-10",
  
  "-c:a", "copy",

  "-t", duration,

  `out/${outname}`
];

const args_step_150 =  [
  "-y",

  "-i", 
  "out/step1.aac",

  "-stream_loop", "100",
  "-an",
  "-i", "inp/livevoice.mp4",

  "-vf",
  "scale=150:150",

  "-c:v", "libx264",
  "-c:a", "aac",

  "-pix_fmt",
  "yuv420p",
  "-shortest",

  "-t", duration,

  `out/${outname}`
];

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

if(isHD) {
  // 1280x720
  runCommand("step1", args_step_1, () => {
    runCommand("step2", args_step_2, () => {
      runCommand("step3", args_step_3, () => {});
    });
  });
} else {
  // 150x150
  runCommand("step1", args_step_1, () => {
    runCommand("step2", args_step_150, () => {

    });
  });
}
