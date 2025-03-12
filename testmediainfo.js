const mediaInfoFactory = require('mediainfo.js');

async function getFileDuration(filePath) {
    const mediaInfo = await mediaInfoFactory({})
  
    return mediaInfo
      .analyzeData(() => file, file.size)
      .then(result => {
        const duration = result.media.track[0].Duration; // Duration is in milliseconds
        return duration;
      });
}
  
  getFileDuration('temp/0.ts')
    .then(duration => {
      console.log('Duration (milliseconds):', duration);
    })
    .catch(error => {
      console.error('Error:', error);
    });