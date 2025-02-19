exports.allowedSticker = ['json', 'jpg', 'jpeg', 'png', 'gif', 'zip']
exports.allowedImageExt = ['jpg', 'jpeg', 'png', 'gif']
exports.allowedSoundExt = ['mp3', 'wav', 'acc', 'm4a', 'flac', 'amr', 'aac']
exports.allowedVideoExt = ['mp4', 'mov', '3gpp', 'mpg', 'mpeg', 'mkv']
exports.allowedDocumentExt = ['svg', 'sketch', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'prc', 'epub', 'js', 'html', 'css', 'htm', 'java', 'cpp', 'eot', 'otf', 'ttf', 'woff', 'woff2', 'json', 'zip', 'prc', 'epub', 'svg', 'rar', 'zip', 'tiff', 'psd', 'ai', 'eps', 'indd', 'cdr', 'csv', 'tsv', 'riv']
exports.allowedExt = [...this.allowedSoundExt, ...this.allowedVideoExt, ...this.allowedImageExt, ...this.allowedDocumentExt]
exports.randomRequiredExt = ['gif', ...this.allowedSoundExt, ...this.allowedVideoExt, ...this.allowedDocumentExt]

exports.removeUnicode = _str => {
  return _str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|Ä|ä)/g, 'a')
    .replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
    .replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
    .replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ö|ö)/g, 'o')
    .replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
    .replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
    .replace(/(đ)/g, "d")
    .replace(/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/g, 'A')
    .replace(/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/g, 'E')
    .replace(/(Ì|Í|Ị|Ỉ|Ĩ)/g, 'I')
    .replace(/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/g, 'O')
    .replace(/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ|Ü|ü)/g, 'U')
    .replace(/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/g, 'Y')
    .replace(/(Đ)/g, 'D')
    .replace(/ /g, '+');
}

exports.removeUnicodeV2 = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

exports.convertSecNoToHMS = (seconds, toObj = false) => {//s in number -> [hh:]mm:ss
  seconds = ~~seconds
  let h = ~~(seconds / 3600),
    m = ~~((seconds % 3600) / 60),
    s = seconds - h * 3600 - m * 60
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s
  return toObj ? { h, m, s }
    : (!!+h ? `${h}:` : '') + `${m}:${s}`
}

exports.getFilesizeAsKB = filename => {
  const stats = fs.statSync(filename),
    fsizeByte = stats.size,
    fsizeInKB = calcInKB(fsizeByte)
  return fsizeInKB
}

exports.getFilesize = filename => {
  const stats = fs.statSync(filename),
    fsizeByte = stats.size,
    fsizeInGB = calcInGB(fsizeByte),
    fsizeInMB = calcInMB(fsizeByte),
    fsizeInKB = calcInKB(fsizeByte)
  return fsizeInGB > 1 ? fsizeInGB + 'GB'
    : fsizeInMB > 1 ? fsizeInMB + 'MB'
      : fsizeInKB > 1 ? fsizeInKB + 'KB'
        : fsizeByte + 'byte'
}

const calcInGB = fsize => Math.round(fsize / 1e9 * 100) / 100
const calcInMB = fsize => Math.round(fsize / 1e6 * 100) / 100
const calcInKB = fsize => ~~(fsize / 1e3)

exports.getImageRatio = (filepath, cb) => {
  const gm = require('gm');
  try {
    gm(filepath)
      .size((err, size) => {
        if (err) throw new Error(err)
        cb(size.height / size.width);
      });
  } catch (e) {
    console.log(e);
    cb(1)
  }
}