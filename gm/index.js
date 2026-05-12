const gm = require('gm')

// Nếu bạn sử dụng ImageMagick thay vì GraphicsMagick, bạn cần khởi tạo như sau:
//const gm = require('gm').subClass({imageMagick: true});

// Common Methods
// resize(width, height): Resize the image to the specified dimensions.

// crop(width, height, x, y): Crop the image to the specified width, height, and coordinates.

// rotate(color, degrees): Rotate the image by the specified degrees.

// blur(radius, sigma): Apply a blur effect to the image.

// write(outputPath, callback): Write the processed image to a file

// gm('path/to/image.jpg') .setFormat('png') : convert jpg to png

// .noProfile() // Xóa thông tin EXIF để giảm dung lượng

gm('../ffmpeg/piepaudio.png')
    .resize(40, 40)
    .write('./output.png', (err) => {
        if (err) console.error(err);
        else console.log('Image converted');
      });
