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

// m3u8 to aac audio
let args_m3u8_aac = [
  "-y",
  "-i",
  "https://storage.googleapis.com/as-piepme/19802/livestream/19802.675cefecf6c8afd0792e197fc18b4801/index.m3u8",
  "-vn",
  "-acodec",
  "copy",
  "output.aac",
].concat();

// acc + image => mp4
let args_aac_img_mp4 = [
  "-y",
  "-loop",
  "1",
  "-framerate",
  "1",
  "-i",
  "https://cdn.piepme.com/2553/images/piep-skoU9IGP17003632887051700363288705.jpeg",
  "-i",
  "output.aac",
  "-tune",
  "stillimage",
  "-vf",
  "scale=1280:720",
  "-c:v",
  "libx264",
  "-c:a",
  "aac",
  // "-r", "30",
  "-t",
  "5359",
  "co-bau-truoc-khi-cuoi-piepaudio.mp4",
].concat();

// aac to mp3
let args_aac_mp3 = [
  "-y",
  "-i",
  "output.aac",
  "-acodec",
  "libmp3lame",
  "neu-ca-doi-khong-ket-hon.mp3",
].concat();

// m4a to mp3
let args_m4a_mp3 = [
  "-y",
  "-i",
  "https://cdn.piepme.com/21118/sounds/piep-29N0bjGh16997596827871699759682787.m4a",
  "-vn",
  "-acodec",
  "libmp3lame",
  "han-gan-vet-thuong-sau-chia-ly.mp3",
].concat();

// m3u8 to mp4 with duration
let args_m3u8_duration_mp4 = [
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

// m3u8 to mp4 vertical
let args_m3u8_vertical_mp4 = [
  "-y",
  "-i",
  "https://cdn.piepme.com/28917/videos/piep-HiBwQAcg17146945651261714694565126/hls/720p.m3u8",

  "-vf",
  "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black",

  "-c:a",
  "copy",

  "video-vertical.mp4",
].concat();

// add mp3 to mp3 make to mp4
let args_mp4_mp3_mp4 = [
  "-y",

  "-i",
  "../temp/0116.mp4",

  "-i",
  "https://cdn.piepme.com/1414/sound/piep-yFnhFiO617060691316541706069131654.mp3",

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

let args_download_mp3 = [
  "-y",
  "-i",
  // "https://cdn.piepme.com/29062/sounds/piep-oOCJemFK17136607520501713660752050.mp3",
  // "https://cdn.piepme.com/26987/sounds/piep-iMClITkY17147996350371714799635037.mp3",
  "https://cdn.piepme.com/26589/sounds/piep-jEww2SZx17149069492631714906949263.mp3",

  "-af",
  "volume=1.5",

  "-b:a",
  "160k",

  "-ar",
  "48000",
  // "44100",

  "-ac",
  "2",

  "muahexanh-cuanhungnamdo.mp3",
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

runCommand("step1", args_download_mp3, () => {
  // runCommand("step2", args_2, () => {
  //   runCommand("step3", args_3, () => {});
  // });
});
