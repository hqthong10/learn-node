const { spawn } = require("child_process");

let ffmpeg_args = [
  "-y",

  "-i",
  "../temp/input.mp4",

  "-map",
  "0:v:0",
  "-map",
  "0:a:0",

  "-map",
  "0:v:0",
  "-map",
  "0:a:0",

  "-map",
  "0:v:0",
  "-map",
  "0:a:0",

  "-c:v",
  "libx264",

  "-crf",
  "22",

  "-c:a",
  "aac",

  "-ar",
  "44100",

  "-filter:v:0",
  "scale=-2:360",
  "-maxrate:v:0",
  "600k",
  "-b:a:0",
  "500k",

  "-filter:v:1",
  "scale=-2:480",
  "-maxrate:v:1",
  "1500k",
  "-b:a:1",
  "1000k",

  "-filter:v:2",
  "scale=-2:720",
  "-maxrate:v:2",
  "3000k",
  "-b:a:2",
  "2000k",

  "-var_stream_map",
  "v:0,a:0,name:360p v:1,a:1,name:480p v:2,a:2,name:720p",

  "-preset",
  "fast",

  "-master_pl_name",
  "livestream.m3u8",

  "-f",
  "hls",

  "-hls_time",
  "4",

  "-hls_flags",
  "independent_segments",

  "-hls_playlist_type",
  "vod",

  "-hls_segment_filename",
  "../temp/ll/output_%v_%03d.ts",
  "../temp/ll/livestream-%v.m3u8",
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

runCommand("step1", ffmpeg_args, () => {
  // runCommand("step2", args_2, () => {
  //   runCommand("step3", args_3, () => {});
  // });
});
