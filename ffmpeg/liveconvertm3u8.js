const { spawn } = require("child_process");
const fs = require("fs");
const readline = require("readline");

async function _rebuildM3u8(name) {
  let duration = 0;
  try {
    // let data = fs.readFileSync(`media/hlssave/${name}/index.m3u8`, {encoding: 'utf8', flag: 'r'});
    // data += `#EXT-X-ENDLIST`;
    // fs.writeFileSync(`media/hlssave/${name}/index.full.m3u8`, data, {mode: 0o775});

    const pathFolder = `../temp/14071-LIVE-00005157`;
    const rl = readline.createInterface({
      input: fs.createReadStream(`${pathFolder}/index.m3u8`),
      crlfDelay: Infinity,
    });
    let allts = "",
      fullm3u8 = "";
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      if (line.indexOf(".ts") > 0) {
        // 1234.ts
        if (allts) {
          allts += `\nfile ${line}`;
        } else {
          allts = `file ${line}`;
        }
      } else if (line.indexOf("EXTINF:") > 0) {
        // #EXTINF:1.021,
        duration += +line.replace("#EXTINF:", "").replace(",", "") || 0;
      }

      if (fullm3u8) {
        fullm3u8 += `\n${line}`;
      } else {
        fullm3u8 = `${line}`;
      }
    }
    fullm3u8 += "\n#EXT-X-ENDLIST";

    fs.writeFileSync(`${pathFolder}/index.hybrid.m3u8`, fullm3u8, {
      mode: 0o775,
    });
  } catch (err) {
    console.error(" >>> ERR _rebuildM3u8", err);
  }
  return Math.floor(duration);
}

// Tạo ra quy trình để tách file A thành 2 phần
const lvl_args_1 = [
  "-y",
  "-i",
  "../temp/thong/index.full.m3u8",
  "-ss",
  "0",
  "-t",
  "100",
  "-c",
  "copy",
  "-bsf:v",
  "h264_mp4toannexb",
  "-f",
  "mpegts",
  "../temp/thong/out1.ts",
];

// Tạo ra quy trình để tách file A phần còn lại
const lvl_args_2 = [
  "-y",
  "-i",
  "../temp/thong/index.full.m3u8",
  "-ss",
  "100",
  "-c",
  "copy",
  "-bsf:v",
  "h264_mp4toannexb",
  "-f",
  "mpegts",
  "../temp/thong/out3.ts",
];

// Tạo ra quy trình để đổi tên file B thành out3.ts (nếu cần)
const lvl_args_3 = [
  "-y",
  "-i",
  "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",
  "-c",
  "copy",
  "-bsf:v",
  "h264_mp4toannexb",
  "-b:v",
  "2500k",
  "-f",
  "mpegts",
  "../temp/thong/out2.ts",
];

// Tạo ra quy trình để concat các file ts
const lvl_args_4 = [
  "-y",
  "-i",
  "concat:../temp/thong/out1.ts|../temp/thong/out2.ts|../temp/thong/out3.ts",

  "-c:a",
  "aac",

  "-c:v",
  "libx264",

  "-maxrate",
  "2000k",

  "-s",
  "1920:1080",

  "-strict",
  "2",
  // "../temp/thong/output-pipe.mp4",

  "-hls_time",
  "2",

  "-hls_list_size",
  "0",

  "-hls_segment_filename",
  "../temp/thong/h_%01d.ts",

  "../temp/thong/htemp.m3u8",
];

const lvl_args_5 = [
  "-y",
  "-i",
  "../temp/thong/htemp.m3u8",
  "-c",
  "copy",
  "-v",
  "copy",
  "../temp/thong/hybrid.mp4",
];

// const lv_args_1 = [
//   "-y",
//   "-i",
//   "../temp/14071-LIVE-00005157/index.full.m3u8",
//   "-c",
//   "copy",
//   "-bsf:v",
//   "h264_mp4toannexb",
//   "-f",
//   "mpegts",
//   "out1.ts",
// ];

// const lv_args_2 = [
//   "-y",
//   "-i",
//   "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",

//   "-c",
//   "copy",

//   "-bsf:v",
//   "h264_mp4toannexb",

//   "-f",
//   "mpegts",
//   "out2.ts",
// ];

// const lv_args_3 = [
//   "-y",
//   "-i",
//   "concat:out1.ts|out2.ts",
//   "-c:a",
//   "aac",
//   "-c:v",
//   "libx264",
//   "output-pipe.mp4",
// ];

// const vl_args_3 = [
//   "-y",
//   "-i",
//   "concat:out1.ts|out2.ts",
//   "-c:a",
//   "aac",
//   "-c:v",
//   "libx264",
//   "output-pipe.mp4",
// ];

// const try_args_1 = [
//   "-y",
//   "-i",
//   "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",

//   "-c",
//   "copy",

//   "-t",
//   "100",
//   "-bsf:v",
//   "h264_mp4toannexb",
//   "-f",
//   "mpegts",
//   "output_part1.ts",
// ];

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

runCommand("step1", lvl_args_1, () => {
  runCommand("step2", lvl_args_2, () => {
    runCommand("step3", lvl_args_3, () => {
      runCommand("step4", lvl_args_4, () => {
        runCommand("step5", lvl_args_5, () => {
          console.log("All processes completed.");
          if (fs.existsSync("out1.ts")) fs.unlinkSync("out1.ts");
          if (fs.existsSync("out2.ts")) fs.unlinkSync("out2.ts");
          if (fs.existsSync("out3.ts")) fs.unlinkSync("out3.ts");
        });
      });
    });
  });
});

// runCommand("step1", lv_args_1, () => {
//   runCommand("step2", lv_args_2, () => {
//     runCommand("step3", lv_args_3, () => {
//       console.log("All processes completed.");
//       // if (fs.existsSync("out1.ts")) fs.unlinkSync("out1.ts");
//       // if (fs.existsSync("out2.ts")) fs.unlinkSync("out2.ts");
//     });
//   });
// });

// runCommand("step1", lv_args_1, () => {
//   runCommand("step2", lv_args_2, () => {
//     runCommand("step3", vl_args_3, () => {
//       console.log("All processes completed.");
//       // if (fs.existsSync("out1.ts")) fs.unlinkSync("out1.ts");
//       // if (fs.existsSync("out2.ts")) fs.unlinkSync("out2.ts");
//     });
//   });
// });

// const try_arg = [
//   "-y",
//   "-i",
//   "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",

//   "-c:a",
//   "aac",
//   "-c:v",
//   "libx264",
//   // "-s",
//   // "1920:1080",
//   "-vf",
//   "scale=1920:1080",
//   "-maxrate",
//   "2500k",
//   "-hls_time",
//   "2",
//   "-hls_list_size",
//   "0",
//   "-hls_segment_filename",
//   "../temp/thong/v_%01d.ts",
//   "../temp/thong/vtemp.m3u8",
// ];

const lv_args_2_1 = [
  "-y",

  "-i",
  "https://2bewebinaris-fra.s3.amazonaws.com/20062/1676604802908.mp4",

  // "-c",
  // "copy",
  // "-bsf:v",
  // "h264_mp4toannexb",

  "-c:a",
  "aac",

  "-c:v",
  "libx264",

  "-s",
  "1792:1008",

  "-maxrate",
  "1500k",

  "-hls_time",
  "2",

  "-hls_list_size",
  "0",

  "-hls_segment_filename",
  "../temp/thong/v_%01d.ts",

  "../temp/thong/vtemp.m3u8",
];

// const lv_args_2_2 = [
//   "-y",

//   "-i",
//   "concat:../temp/14071-LIVE-00005157/index.full.m3u8|../temp/thong/vtemp.m3u8",

//   "-c",
//   "copy",

//   // "-bsf:v",
//   // "h264_mp4toannexb",

//   // "-s",
//   // "1920:1080",

//   // "-maxrate",
//   // "2500k",

//   "-hls_time",
//   "2",

//   "-hls_list_size",
//   "0",

//   "-hls_segment_filename",
//   "../temp/thong/h_%01d.ts",

//   "../temp/thong/htemp.m3u8",
// ];

// runCommand("step 2", lv_args_2_1, () => {
//   console.log("end");
// });
