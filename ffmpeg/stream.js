const { spawn } = require("child_process");

let ffmpeg_args = [
    "-y",
    "-i", 
    "electroncapture://vdo.ninja/?scene&room=thong&password=123",

    // "-async", "1",
    // "-vsync", "-1",

    "-c:v", "libx264",
    "-c:a", "aac",
    "-r", "30",
    "-g", "120",
    "-sc_threshold", "0",
    "-strict", "-2",
    "-threads", "2",
    "-b:a", "128k",
    "-ar", "44100",
    "-b:v", "1920k",
    "-maxrate", "2000k",
    "-bufsize", "5000k",
    "-pix_fmt", "yuv420p",
    "-vf", "scale=-2:1008",
    "-tune", "zerolatency",
    "-preset", "veryfast",
    "-crf", "23",
    "-f", "flv", 
    "rtmp://livestream.webinaris.co/live/14071-LIVE-THONGTEST?k=LIVE-THONGTEST&vf=49be728cd623d3a3119ff9d4f4f6ffb3&login=Thong",
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

runCommand("step1", ffmpeg_args, () => {});
