const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const fileType = require('file-type');

const app = express();
const PORT = 3000;

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const allowedExtensions = ['.jpg', '.png', '.pdf'];

const checkType = () => {
    fs.readFile(file.filepath, async (err, buffer) => {
        if (err) throw err;
        const type = await fileType.fromBuffer(buffer);
        if (!type || !allowedMimeTypes.includes(type.mime)) {
            console.log('Invalid file content!');
            fs.unlinkSync(file.filepath);
        }
    });
};

// Endpoint để upload file
app.post('/upload', (req, res) => {
    // Khởi tạo Formidable
    const form = new formidable.IncomingForm();

    // Cấu hình thư mục lưu trữ file upload
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir); // Tạo thư mục nếu chưa tồn tại
    }

    form.uploadDir = uploadDir;
    form.keepExtensions = true; // Giữ nguyên phần mở rộng của file
    form.maxFileSize = 10 * 1024 * 1024; // 10MB

    // thong
    form.on('file', (name, file) => {
        // Kiểm tra mime type
        if (!allowedMimeTypes.includes(file.mimetype)) {
            console.log('File type not allowed:', file.mimetype);
            // Xóa file ngay nếu không hợp lệ
            fs.unlinkSync(file.filepath);
        }

        // Kiểm tra extension
        const ext = path.extname(file.originalFilename).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            console.log('File extension not allowed:', ext);
            fs.unlinkSync(file.filepath);
        }
    });

    // thong
    form.on('error', (err) => {
        if (err.code === 'LIMIT_FILE_SIZE') {
            console.log('File size too large!');
        }
    });

    // thong
    form.on('part', (part) => {
        if (part.headers['content-disposition']) {
            // Kiểm tra tính hợp lệ
        }
    });

    // Xử lý upload
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error while parsing the file:', err);
            return res.status(500).send('Upload failed');
        }

        const uploadedFile = files.file; // 'file' là tên key từ client gửi lên
        if (!uploadedFile) {
            return res.status(400).send('No file uploaded');
        }

        // Đổi tên file để tránh ghi đè
        const newFilePath = path.join(uploadDir, uploadedFile.originalFilename || 'uploaded_file');
        fs.rename(uploadedFile.filepath, newFilePath, (renameErr) => {
            if (renameErr) {
                console.error('Error while renaming the file:', renameErr);
                return res.status(500).send('Error saving the file');
            }

            res.status(200).send({
                message: 'File uploaded successfully',
                fileName: path.basename(newFilePath),
                filePath: `/uploads/${path.basename(newFilePath)}`
            });
        });
    });
});

// Endpoint để kiểm tra server
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Static route để truy cập file upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Bật server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Lưu ý:
// Kiểm tra kỹ các file tải lên để tránh nhận file nguy hiểm như mã độc.
// 1. Kiểm tra loại file (MIME Type)
// 2. Kiểm tra đuôi file
// 3. Kiểm tra kích thước file
// 4. Kiểm tra nội dung file, sử dụng file-type
// 5. Dùng phần mềm diệt virus. ClamAV or VirusTotal API
// 6. Sử dụng sandbox (môi trường cách ly)
// 7. Hạn chế quyền của thư mục lưu file
// 8. Xóa file không hợp lệ ngay lập tức
// 9. Ghi log
// 10. Hạn chế đường dẫn tải lên. Tránh trường hợp file.originalFilename chứa các ký tự như ../
//      Loại bỏ ký tự đặc biệt:
//      const sanitize = require('sanitize-filename');
//      file.originalFilename = sanitize(file.originalFilename);
// 11. Kiểm tra với Content-Disposition Header
// 12. Đặt giới hạn thời gian upload. có thể dùng nginx

// Giới hạn file: Bạn có thể cấu hình kích thước file tối đa bằng cách thêm thuộc tính:
// form.maxFileSize = 10 * 1024 * 1024; // 10MB

// Tùy chỉnh tên file: Bạn có thể thêm timestamp hoặc UUID để tránh trùng lặp tên file.

/*
formidable

2. Hàm của IncomingForm
2.1. form.parse(req, callback)
Phân tích (parse) dữ liệu từ một request HTTP.
Tham số:
req: Request từ ExpressJS hoặc HTTP Server.
callback(err, fields, files): Hàm callback được gọi sau khi xử lý xong.
err: Lỗi nếu có.
fields: Các trường dữ liệu form không phải file (text input).
files: Thông tin về file upload.
2.2. form.on(event, callback)
Đăng ký các sự kiện trong quá trình xử lý form.
Các sự kiện hỗ trợ:
'field': Gọi khi một trường (field) được xử lý.
callback(name, value): Tên và giá trị của trường.
'fileBegin': Gọi khi bắt đầu nhận file.
callback(name, file): Tên trường và thông tin file.
'file': Gọi khi file được nhận xong.
callback(name, file): Tên trường và thông tin file.
'progress': Gọi liên tục trong quá trình upload để theo dõi tiến độ.
callback(bytesReceived, bytesExpected): Số byte đã nhận và tổng số byte.
'end': Gọi khi toàn bộ request được xử lý.
'error': Gọi khi xảy ra lỗi.
2.3. form.emit(event, args)
Phát (emit) một sự kiện tùy chỉnh.
2.4. form.onPart(part)
Xử lý từng phần (part) của form.
Tham số:
part: Một phần dữ liệu (field hoặc file).
3. Thuộc tính của IncomingForm
3.1. uploadDir
Thư mục lưu file tạm thời.
Mặc định: Hệ thống sẽ tự chọn thư mục tạm.
3.2. keepExtensions
Giữ lại phần mở rộng của file.
Loại: boolean.
Mặc định: false.
3.3. maxFields
Số lượng trường dữ liệu tối đa được xử lý.
Loại: number.
Mặc định: 1000.
3.4. maxFieldsSize
Kích thước tối đa của dữ liệu (trường không phải file).
Loại: number (tính bằng byte).
Mặc định: 2MB (2 * 1024 * 1024).
3.5. maxFileSize
Kích thước tối đa của mỗi file upload.
Loại: number (tính bằng byte).
Mặc định: Infinity.
3.6. multiples
Cho phép upload nhiều file cùng lúc.
Loại: boolean.
Mặc định: false.
3.7. encoding
Bộ mã hóa ký tự cho form.
Loại: string.
Mặc định: 'utf-8'.
3.8. enabledPlugins
Danh sách các plugin được bật cho Formidable.
Mặc định: Không có plugin nào được bật.
4. File Object
Khi upload file, mỗi file sẽ được trả về dưới dạng một File Object với các thuộc tính sau:

4.1. filepath
Đường dẫn đến file tạm được lưu trên server.
4.2. originalFilename
Tên gốc của file được upload.
4.3. mimetype
Loại MIME của file (ví dụ: image/jpeg, application/pdf).
4.4. size
Kích thước file (tính bằng byte).
4.5. hash
Giá trị hash của file nếu được yêu cầu.

Ví dụ sự kiện on
form.on('fileBegin', (name, file) => {
  console.log(`Starting to process file: ${file.originalFilename}`);
});

form.on('progress', (bytesReceived, bytesExpected) => {
  console.log(`Progress: ${((bytesReceived / bytesExpected) * 100).toFixed(2)}%`);
});

form.on('end', () => {
  console.log('Upload completed!');
});
*/

/*
    Kích hoạt khi một file bắt đầu được upload.
    form.on('fileBegin', (name, file) => {
        console.log(`Uploading file started: ${file.name}`);
    })

    Theo dõi tiến trình upload file.
    form.on('progress', (bytesReceived, bytesExpected) => {
        const percent = (bytesReceived / bytesExpected) * 100;
        console.log(`Progress: ${percent.toFixed(2)}%`);
    });

    Kích hoạt khi một file đã hoàn tất quá trình upload.
    form.on('file', (name, file) => {
        console.log(`File uploaded: ${file.name}`);
    });

    Kích hoạt khi một trường dữ liệu không phải file được gửi lên.
    form.on('field', (name, value) => {
        console.log(`Field received: ${name} = ${value}`);
    });

    Kích hoạt khi có lỗi xảy ra trong quá trình xử lý form hoặc upload file.
    form.on('error', (err) => {
        console.error(`Error occurred: ${err.message}`);
    });
    
    Kích hoạt khi quá trình upload bị hủy bởi client
    form.on('aborted', () => {
        console.log('Upload aborted by the client');
    });

    Kích hoạt khi toàn bộ quá trình xử lý form hoàn tất.
    form.on('end', () => {
        console.log('Form processing completed');
    });
*/