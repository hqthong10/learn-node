const fs = require('fs');
const url = require('url');
const { gotoTrashbin } = require('./util');
const { AWS_KEY, AWS_SECRET, AWS_REGION } = require('../converter/constant.converter');
const AWS_CLOUND_FRONT = {
    bonevo: 'cdn.bonevo.net', // 'd12xa84yzblgni.cloudfront.net'
    piepme: 'cdn.piepme.com', // 'd1yr3mzis030jk.cloudfront.net'
    piepjob: 'static.piepjobs.com',
    piepjobs: 'static.piepjobs.com',
    piepcom: 'cdn.piepcom.com' // d2g4hlu5oqqwfm.cloudfront.net
};
const { getMimeByPath, compressUsingGM } = require('./util');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { wLog } = require('../config/winston.config');

module.exports = class s3ManagerV3 {
    constructor() {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: AWS_KEY,
                secretAccessKey: AWS_SECRET
            },
            region: AWS_REGION,
            apiVersion: '2006-03-01'
        });
    }

    /**
     * @param {*} localPath : temp path in server 
     * @param {*} s3RestTargetPath : path after domain - piepme/fo100/document/fname.ext
     * @param {*} mimetype 
     * @param {*} callback 
     */
    upload({ from, to, Bucket = 'piepme', mime = '', dontRmvFrom = false }, callback) {
        try {
            wLog.info(`s3.upload start => ${from}`);
            Bucket = Bucket === 'piepjobs' ? 'piepjob' : Bucket === 'pieplive' ? 'piepme' : Bucket;
            const mimetype = !mime || mime === 'application/octet-stream' ? getMimeByPath(from) : mime;
            const uploadParams = {
                Bucket: Bucket,
                Key: to,
                ACL: 'public-read',
                Body: fs.readFileSync(from) || null,
                ContentType: mimetype
            };

            const parallelUpload = new Upload({
                client: this.s3Client,
                params: uploadParams,
                leavePartsOnError: false, // Tùy chọn này sẽ xoá các phần tải lên thất bại
            });

            parallelUpload.on('httpUploadProgress', (progress) => {
                // wLog.info(`progress ${to} ${progress.total > 0 ? Math.floor(progress.loaded / progress.total * 100) : 0}%`);
                // log.info('progress', to, `${progress.total > 0 ? Math.floor(progress.loaded / progress.total * 100) : 0}%`);
            });

            parallelUpload.done()
            .then((data) => {
                // wLog.info(`s3.upload.then => ${JSON.stringify(data)}`);
                const urlObj = url.parse(data.Location, true);
                if (!dontRmvFrom) gotoTrashbin(from);
                callback({
                    s3Url: data.Location,
                    clfUrl: data.Location.replace(urlObj.hostname, AWS_CLOUND_FRONT[Bucket])
                });
            })
            .catch((err) => {
                wLog.error(`s3 upload => ${err}`);
                // log.error(err)
                callback({
                    s3Url: '',
                    clfUrl: ''
                });
            });
      
        } catch (err) {
            wLog.error(`s3 upload catch => ${err}`);
            callback({
                s3Url: '',
                clfUrl: ''
            });
        }
    }

    /**
     * @param {*} localPath : temp path in server 
     * @param {*} s3RestTargetPath : path after domain - piepme/fo100/document/fname.ext
     * @param {*} mimetype 
     * @param {*} callback 
     */
    uploadWithCompress({ from, to, Bucket = 'piepme', mime = '' }, callback) {
        compressUsingGM(from, () => {
            wLog.info(`compress success ${from}`);
            this.upload(
                {
                    from,
                    to,
                    Bucket,
                    mime
                }, 
                callback
            );
        });
    }
}
