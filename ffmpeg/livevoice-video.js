const { spawn } = require("child_process");

const timeToSecond = (time) => {
  const arr = time.trim().split(":");
  const sum = arr.reduce((total, num, idx, ls) => {
    return total = (parseInt(num) * (60 ** (ls.length - (idx + 1)))) + total;
  }, 0)
  return sum;
}

// tao audio cho marketing
const audio = "https://cdn.piepme.com/26874/livestream/26874.f66e4913b9377f68719b6ed4417ee3d7/index.m3u8";
const image = "https://cdn.piepme.com/26874/images/s720-piep-41B85Tjl17211416895601721141689560.jpeg";
const tstart = '09:36';
const tstop = '10:20';
const duration = timeToSecond(tstop) - timeToSecond(tstart);
const outname = 'livevoice-december-radio.mp4';
const isHD = true;

const args_audio_video__mp4 =  [
  "-y",

  // giây bắt đầu
  "-ss", tstart,

  "-vn",
  "-i", audio,

  "-stream_loop", "100",
  "-i", "livevoice.mp4",

  "-vf",
  "scale=150:150",
  
  "-c:v", "libx264",
  "-c:a", "aac",
  "-b:a", "192k",

  "-shortest",
  "-pix_fmt",
  "yuv420p",

  // tổng thời giây của video
  "-t", duration,

  `out/${outname}`
];

const args_audio_img__mp4 =  [
  "-y",

  // giây bắt đầu
  "-ss", tstart,

  "-vn",
  "-i", 
  audio,

  // image
  "-loop",
  "1",
  "-framerate",
  "1",
  "-i", image,


  "-vf",
  "scale=1280:720",
  
  "-c:v", "libx264",
  "-c:a", "aac",
  "-b:a", "192k",

  "-shortest",
  "-pix_fmt",
  "yuv420p",

  // tổng thời giây của video
  "-t", duration,

  "out/livevoice-step1.mp4"
];

// tao audio cho marketing
const args_audio_img__mp4_step2 =  [
  "-y",

  "-i", 
  "out/livevoice-step1.mp4",

  // video
  "-stream_loop", "100",
  "-i", "livevoice.mp4",
  
  "-filter_complex",
  "[1]scale=150:150 [wm]; [0][wm] overlay=10:main_h-overlay_h-10",
  
  "-c:a", "copy",
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
  runCommand("step1", args_audio_img__mp4, () => {
    runCommand("step2", args_audio_img__mp4_step2, () => {});
  });
} else {
  // 150x150
  runCommand("step1", args_audio_video__mp4, () => {});
}
