const { spawn } = require("child_process");



// m3u8 to mp4 vertical
let args_m3u8_vertical_mp4 = [
  "-y",
  
  "-i",
  "./inp/v11.mp4",
  // "./out/do-hai-yen.mp4",
  
  // "-ss",
  // "0",
  // "-t",
  // `40`,

  "-vf",
  // "fps=1", // 1 frame per second
  "fps=1/0.1", // 1 frame per 0.1 seconds
  // "fps=1/60", // 1 frame per minute
  // "fps=1/600", // 1 frame per 10 minutes
  // "fps=1/2", // 1 frame per 2 seconds 
  // "select='between(t,2,6)+between(t,15,24)'", // select frames between 2-6 and 15-24 seconds

  "./out/v11/im%d.jpg",
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
