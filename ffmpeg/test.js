const { spawn } = require("child_process");


let ffmpeg_args = [
  "-y",

  "-i", "../temp/test.mp4",
  "-map", "0:v", // "-map", "0:a",
  "-map", "0:v", // "-map", "0:a",
  "-map", "0:v", // "-map", "0:a",
  "-filter:v:0", "scale=-2:480",
  "-filter:v:1", "scale=-2:720",
  "-filter:v:2", "scale=-2:1080",
  "-maxrate:v:0", "800000",
  "-maxrate:v:1", "1500000",
  "-maxrate:v:2", "3000000",
  "-bufsize:v:0", "800000",
  "-bufsize:v:1", "1500000",
  "-bufsize:v:2", "3000000",
  "-hls_playlist_type", "vod",
  "-hls_time", "6",
  "-hls_flags", "independent_segments",
  "-master_pl_name", "index.m3u8",
  // "-var_stream_map", "v:0,name:480p v:1,name:720p v:2,name:1080p",
  "-var_stream_map", "v:0,name:480p v:1,name:720p v:2,name:1080p",
  "../temp/hls/%v.m3u8"
].concat();

let ffmpeg_args2 = [
  "-y",
  "-i", "../temp/test.mp4",

  "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
  // "-preset", "veryfast",
  // "-c:v", "h264",
  // "-pix_fmt", "yuv420p" ,
  // "-crf", "25",
  // "-g", "30",
  "-map", "0:v",
  // "-filter:v:0", "scale=-2:406",
  "-filter:v:0", "scale=-2:406",
  "-maxrate:v:0", "800000",
  // "-bufsize:v:0", "800000",
  "-hls_playlist_type", "vod",
  "-hls_time", "3", 
  "-hls_flags", "independent_segments",
  "-master_pl_name", 'index.m3u8', 
  "-var_stream_map", "v:0,name:406p",
  "../temp/hls/%v.m3u8"
].concat();

let ffmpeg_args3 = [
  "-y",
  "-i", "../temp/thuysinh.mp4", 
  
  
  "-filter_complex", "[0:v]split=2[v1][v2];[v1]scale=w=640:h=406[v1out];[v2]scale=w=640:h=360[v2out]",
  "-map", "[v1out]", "-c:v:0", "h264", "-b:v:0", "800k", "-g", "48", "-hls_time", "10", "-hls_segment_filename", "../temp/hls/406p_%03d.ts", "-hls_playlist_type", "vod", "../temp/hls/406p.m3u8",
  "-map", "[v2out]", "-c:v:1", "h264", "-b:v:1", "600k", "-g", "48", "-hls_time", "10", "-hls_segment_filename", "../temp/hls/360p_%03d.ts", "-hls_playlist_type", "vod", "../temp/hls/360p.m3u8",
  "-master_pl_name", "index.m3u8", "-f", "hls",
  "-var_stream_map", "a:0,v:0 a:0,v:1",


  // "-filter:v:0", "scale=-2:406",
  // "-hls_playlist_type", "vod",
  // "-hls_time", "3", 
  // "-hls_flags", "independent_segments",
  // "-var_stream_map", "v:0,name:406p",
  // "-master_pl_name", 'index.m3u8', 
  // "../temp/hls/%v.m3u8"
].concat();

let child = spawn("ffmpeg", ffmpeg_args2);
child.stderr.setEncoding("utf8");

child.stdout.on("data", (data) => {
  console.log(`Đầu ra từ FFmpeg: ${data}`);
});

child.stderr.on("data", function (data) {
  console.log("data >>>> ", data);
});

child.on("error", function (err) {
  console.log("error >>>> ", err);
  // child.kill();
});

child.on("close", function (code) {
  console.log("close >>>> ", code);
});
