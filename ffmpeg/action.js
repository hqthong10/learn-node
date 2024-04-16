const { spawn } = require("child_process");

// 720x1280 to 1280x720
let args_720x1280_1280x720 = [
  "-y",
  "-i",
  "720-1280.mp4",
  "-vf",
  "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black",
  "1280-720.mp4",
].concat();

// resize video
let args_resize = [
  "-y",
  "-i",
  "in.mp4",
  "-vf",
  "scale='if(gt(iw,ih),1280,-2)':'if(gt(iw,ih),-2,1280)'",
  "out.mp4",
].concat();

// convert m3u8 to mp4
let args_m3u8_mp4 = [
  "-y",
  "-i",
  "../temp/20805-LIVE-00006236/index.full.m3u8",
  // "https://livestreamcdn.webinaris.co/hlssave/7584-LIVE-00006376/index.full.m3u8",
  "-map",
  "0:v",
  "-c:v",
  "copy",
  "-map",
  "0:a",
  "-c:a",
  "copy",
  "-bsf:a",
  "aac_adtstoasc",
  "-threads",
  "2",
  "../temp/20805-LIVE-00006236.mp4",
].concat();

// let ffmpeg_args = [
//   "-y",

//   "-i",
//   "https://storage.googleapis.com/as-piepme/19802/livestream/19802.bb782e98994e9205179c3bce0c6ca18e/index.m3u8",
//   // "-vn",

//   "-loop",
//   "1",
//   "-i",
//   "https://cdn.piepme.com/19540/images/s720-piep-LREskoY316922670555831692267055583.jpeg",

//   "-c",
//   "copy",
//   "-c:a",
//   "aac",
//   "-bsf:a",
//   "aac_adtstoasc",
//   "-c:v",
//   "libx264",
//   "-aspect",
//   "16:9",
//   "-s",
//   "1280x720",
//   "-b:a",
//   "128k",
//   "-strict",
//   "experimental",
//   "-crf",
//   "24",
//   "final.mp4",
// ].concat();

// step 1
// let ffmpeg_args = [
//   "-y",
//   "-i",
//   "https://storage.googleapis.com/as-piepme/19802/livestream/19802.675cefecf6c8afd0792e197fc18b4801/index.m3u8",
//   "-vn",
//   "-acodec",
//   "copy",
//   "output.aac",
// ].concat();

// step 2
// let ffmpeg_args = [
//   "-y",
//   "-loop",
//   "1",
//   "-framerate",
//   "1",
//   "-i",
//   "https://cdn.piepme.com/2553/images/piep-skoU9IGP17003632887051700363288705.jpeg",
//   "-i",
//   "output.aac",
//   "-tune",
//   "stillimage",
//   "-vf",
//   "scale=1280:720",
//   "-c:v",
//   "libx264",
//   "-c:a",
//   "aac",
//   // "-r", "30",
//   "-t",
//   "5359",
//   "co-bau-truoc-khi-cuoi-piepaudio.mp4",
// ].concat();

// let ffmpeg_args = [
//   "-y",
//   "-i",
//   "output.aac",
//   "-acodec",
//   "libmp3lame",
//   "neu-ca-doi-khong-ket-hon.mp3",
// ].concat();

// let ffmpeg_args = [
//   "-y",
//   "-i",
//   "https://cdn.piepme.com/21118/sounds/piep-29N0bjGh16997596827871699759682787.m4a",
//   "-vn",
//   "-acodec",
//   "libmp3lame",
//   "han-gan-vet-thuong-sau-chia-ly.mp3",
// ].concat();

let args_1 = [
  "-y",
  "-i",
  "https://storage.googleapis.com/as-piepme/19968/livestream/19968.45e067b9e79baf58cf11b8c5193a6ac9/720p/index.m3u8",
  "-c",
  "copy",
  "-ss",
  "0",
  "-t",
  "600",
  "video3.mp4",
].concat();

let args_2 = [
  "-y",
  "-i",
  // "https://cdn.piepme.com/26183/videos/piep-TWJ9txUO17108260792431710826079243/hls/720p.m3u8",
  // "https://cdn.piepme.com/28917/videos/piep-Oqoqz8Jq17129186432671712918643267/hls/720p.m3u8",
  "https://cdn.piepme.com/21118/videos/piep-0cPDgero17130215609101713021560910/hls/720p.m3u8",
  // "video2.mp4",
  // "-c",
  // "copy",

  // "-c:v",
  // "libx264",
  // "-c:a",
  // "aac",
  // "-af",
  // "volume=2",

  "-vf",
  "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black",

  "-c:a",
  "copy",

  "video3.mp4",
].concat();

let args_aa = [
  "-y",

  "-i",
  "../temp/0116.mp4",

  "-i",
  "https://cdn.piepme.com/1414/sound/piep-yFnhFiO617060691316541706069131654.mp3",

  // "-c:v",
  // "copy",

  // "-c:a",
  // "aac",

  // "-af",
  // "volume=0.9",

  // "-map",
  // "0:v:0",

  // "-map",
  // "1:a:0",

  // "-ss",
  // "0",

  // "-t",
  // "60",

  // "-strict",
  // "experimental",

  "-ss",
  "0",
  "-t",
  "60",
  "-c:v",
  "copy",
  "-c:a",
  "aac",
  "-filter_complex",
  "[0:1]volume=0.8[a0];[1:0]volume=0.8[a1];[a0][a1]amerge=inputs=2",

  "output.mp4",
].concat();

let args_copy_a = [
  "-y",

  "-i",
  "https://cdn.piepme.com/28045/sounds/piep-LA6e7QJN17130021479421713002147942.mp3",
  // "https://cdn.piepme.com/29062/sounds/piep-BqT1Vrrq17129973145461712997314546.mp3",
  // "toi-nghi-chung-ta-chi-la-ban.mp3",

  "-af",
  "volume=1.5",

  "-b:a",
  "160k",

  "-ar",
  "48000",
  // "44100",

  "-ac",
  "2",

  "cau-chuyen-ty-tuoi-hoc-tro-cua-minh-2.mp3",
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

runCommand("step1", args_copy_a, () => {
  // runCommand("step2", args_2, () => {
  //   runCommand("step3", args_3, () => {});
  // });
});
