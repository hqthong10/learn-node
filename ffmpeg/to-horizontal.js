const { spawn } = require("child_process");



// m3u8 to mp4 vertical
let args_m3u8_vertical_mp4 = [
  "-y",
  
  "-i",
  // "https://cdn.piepme.com/28638/videos/piep-ehmHprnF17301714484321730171448432/hls/720p.m3u8",
  // "https://cdn.piepme.com/27130/videos/piep-rmcjcqhJ17325046891121732504689112/hls/720p.m3u8",
  "./inp/marshall.png",
  
  // "-ss",
  // "0",
  // "-t",
  // `40`,

  "-vf",
  "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black",

  "-c:a",
  "copy",

  "marshall.png",
].concat();


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

runCommand("step1", args_m3u8_vertical_mp4, () => {});
