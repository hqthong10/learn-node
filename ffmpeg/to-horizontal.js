const { spawn } = require("child_process");



// m3u8 to mp4 vertical
let args_m3u8_vertical_mp4 = [
  "-y",
  
  "-i",
  "https://cdn.piepme.com/29185/videos/piep-3KayXVt117466199563071746619956307/hls/406p.m3u8",
  
  "-ss",
  "0",
  "-t",
  `60`,

  "-vf",
  "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black",

  "-c:a",
  "copy",

  "./out/sunny-ha.mp4",
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
