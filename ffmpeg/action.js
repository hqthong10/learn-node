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
  // "../temp/20805-LIVE-00006236/index.full.m3u8",
  // "https://livestreamcdn.webinaris.co/hlssave/7584-LIVE-00006376/index.full.m3u8",
  // 'https://cdn.piepme.com/19968/livestream/19968.de636a8d17ceb6a83e234890b19c7db1/720p/index.m3u8',

  'https://livevn.piepme.com/camhls/14789.1b5aa79584634429877ce7beeb68ca3a_720p/index.m3u8',

  "-t",
  "30",

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
  "out/vietnambaygio2.mp4",
].concat();

// m3u8 to aac audio
let args_m3u8_aac = [
  "-y",
  "-i",
  // "https://storage.googleapis.com/as-piepme/19802/livestream/19802.675cefecf6c8afd0792e197fc18b4801/index.m3u8",
  // "https://cdn.piepme.com/19802/livestream/19802.4a7a566bf2aab82c9259a26bdee39447/index.m3u8",
  "https://cdn.piepme.com/19802/livestream/19802.04260b7836685cb2aa680114f395e7fa/index.m3u8",
  "-vn",
  "-acodec",
  "copy",
  "khi-ban-la-phai-nu.aac",
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
  "lam-the-nao-de-quyen-gop-dung-cach.mp3",
].concat();

let args_m3u8_mp3 = [
  "-y",
  "-i",
  // "https://cdn.piepme.com/19802/livestream/19802.4a7a566bf2aab82c9259a26bdee39447/index.m3u8",
  // "https://cdn.piepme.com/26207/livestream/26207.019b1d411d9bd4f5f974778d37c27994/index.m3u8",
  // "https://cdn.piepme.com/26787/livestream/26787.b4e1d4d996f5cc634a04768205b60f0b/index.m3u8",
  "https://cdn.piepme.com/26792/livestream/26792.8dea3edb213e94f3a016738aa243544e/index.m3u8",

  "-vn",
  // "-acodec",
  // "copy",
  // "-acodec",
  // "libmp3lame",
  // "-ss",
  // "00:09:55",
  "-ss",
  "851",

  // "-t",
  // "64",
  "-t",
  "37",

  // "labannho-tinh-ao.mp3",
  "maybeo-docsach-tamtruyen.mp3",
].concat();

let args_mp3_img_mp4 = [
  "-y",
  "-loop",
  "1",
  "-framerate",
  "1",
  "-i",
  "piepaudio.png",
  "-i",
  "maybeo-docsach-tamtruyen.mp3",
  
  "-vf",
  "scale=150:150",
  
  // "scale=150:150,pad=150:150:-1:-1:color=black",

  "-c:v",
  "libx264",
  "-c:a",
  "aac",
  "-b:a", '128k', 
  "-shortest", 
  "-pix_fmt", "yuv420p",
  "-t",
  "37",

  "maybeo-docsach-tamtruyen.mp4",
].concat();

// tao audio cho marketing
const args_audio_img__mp4 =  [
  "-y",
  // giây bắt đầu
  "-ss", '10:04', // 576
  "-vn",
  "-i", 
  // "https://cdn.piepme.com/26792/livestream/26792.8dea3edb213e94f3a016738aa243544e/index.m3u8",
  "https://cdn.piepme.com/21118/livestream/21118.36e4e3c35b84148e22172fe2522f1210/index.m3u8",

  "-stream_loop", "100",
  // "-i", "piepaudio.jpg",
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
  "-t", "39",
  "livevoice-loanloan.mp4"
];

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
  // "https://cdn.piepme.com/28917/videos/piep-HiBwQAcg17146945651261714694565126/hls/720p.m3u8",
  "https://cdn.piepme.com/29266/videos/piep-Jz4PV1Uo17215324565681721532456568/hls/720p.m3u8",

  "-vf",
  "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black",

  "-c:a",
  "copy",

  "VietHungLoius-di-do-di-day.mp4",
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
  // 'https://cdn.piepme.com/26833/sounds/piep-e6MYGppU17189392178761718939217876.mp3',
  "https://cdn.piepme.com/26792/livestream/26792.8dea3edb213e94f3a016738aa243544e/index.m3u8",
  

  "-af",
  "volume=1.5",
  // `
  // volume=1.5, 
  // equalizer=f=100:t=q:w=1:g=-10, 
  // afftdn, 
  // acompressor=threshold=-21dB:ratio=9:attack=200:release=1000, 
  // aecho=0.8:0.9:1000:0.3
  // `,

  "-b:a",
  "160k",

  "-ar",
  "48000",
  
  "-ac",
  "2",

  // "tramvy-dongluc-doikhi-chila-suyeuthuong-fixed.mp3",
  'maybeo-docsach-tamtruyen.mp3'
].concat();

let args_m3u8_audio = [
  "-y",
  // '-vn',
  "-i",
  // "https://cdn.piepme.com/hls/18010.bfedc1fc3f678dfcc2c1e7c0b1ccaa4c/720p/index.m3u8",
  'https://cdn.piepme.com/18010/livestream/18010.bfedc1fc3f678dfcc2c1e7c0b1ccaa4c/720p/index.m3u8',
  
  "-f", 'lavfi',
  "-i", "color=c=blue:s=16x16",
  // "-shortest",

  '-map', '0:a',
  '-map', '1:v',


  '-c:a', "aac",

  "-r", '30',
  '-g', '90',
  '-sc_threshold', '0',
  '-strict', '-2',
  '-threads', '2',
  
  '-b:a', '128k',
  '-ar', '44100',

  '-pix_fmt', 'yuv420p',

  // '-f', 'flv',

  "-f", "hls",
  "-hls_time", "2",
  "-hls_list_size","0",

  './out/audio/index.m3u8'
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

runCommand("step1", args_m3u8_mp4, () => {
  // runCommand("step2", args_2, () => {
  //   runCommand("step3", args_3, () => {});
  // });
});
