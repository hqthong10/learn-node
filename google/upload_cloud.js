// const { Storage } = import "@google-cloud/storage";
const Storage = require("@google-cloud/storage");
const fs = require("fs-extra");
const path = require("path");
const projectId = "piepme-161803";
const bucketName = "as-piepme";
const storageManual = new Storage({
  projectId,
  keyFilename: "./piepme-161803-9515671d392c.json", // new 10/09/2022
});

const bucketManual = storageManual.bucket(bucketName);

let TOTAL_REUP = 0;

function uploadFileToGCManual(
  keyFileOnStorage,
  pathString,
  cb,
  isNocache = false
) {
  const opts = {
    destination: keyFileOnStorage,
    public: true,
    metadata: {},
  };
  if (isNocache) {
    opts.metadata.cacheControl = "no-cache";
  }
  bucketManual.upload(pathString, opts, function (err, file) {
    if (err) {
      console.error(`Error uploadFileToGC => ${keyFileOnStorage}`, err);
      // Slack.sendError({ title: `Error uploadFileToGC => ${keyFileOnStorage}`, error: err });
    } else {
      console.log(`Upload success file => ${keyFileOnStorage}`);
    }
    // console.log(`https://storage.googleapis.com/${file.bucket.name}/${file.name}`);
    cb(err, file);
  });
}

function _reupMuti(cb) {
  // const pathf = `${config.hls_folder}${tk}`;
  const pathf = `./files/`;

  fs.readdir(pathf, (err, files) => {
    if (!err && files) {
      files.forEach((file) => {
        if (file.indexOf("index.m3u8") !== -1) return;

        const [FO100, name, type] = file.split(".");
        const tk = `${FO100}.${name}`;

        const absolutePath = path.join(pathf, file);
        console.log("path ", absolutePath);
        console.log(" + GCS ", `${FO100}/livestream/${tk}/${file}`);

        // Chỗ này quan trọng nên nếu lỗi thì cho nó chạy lại (3 lần)
        uploadFileToGCManual(
          `${FO100}/livestream/${tk}/index.mp4`,
          absolutePath,
          (err, file) => {
            // try again
            if (err) {
              uploadFileToGCManual(
                `${FO100}/livestream/${tk}/${file}`,
                absolutePath,
                (err, file) => {
                  if (err) {
                    console.log("err", err);
                  } else {
                    console.log(" => TOTAL_REUP: ", ++TOTAL_REUP);
                  }
                }
              );
            } else {
              TOTAL_REUP++;
              console.log(" => TOTAL_REUP: ", ++TOTAL_REUP);
            }
          }
        );
      });
    }
  });
}

_reupMuti();
