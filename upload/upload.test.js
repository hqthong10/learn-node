const request = require('supertest');
const app = require('./app'); // Import ứng dụng Express
const fs = require('fs-extra');
const path = require('path');

describe('File Upload API', () => {
    afterAll(async () => {
        // Xóa thư mục uploads sau khi test xong
        await fs.remove(path.join(__dirname, 'uploads'));
    });

    test('It should upload a valid file', async () => {
        const res = await request(app).post('/upload').attach('file', path.join(__dirname, 'test-files/sample.txt')); // Tệp thử nghiệm

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('File uploaded successfully');
        expect(res.body.file).toBeDefined();
    });

    test('It should reject a request with no file', async () => {
        const res = await request(app).post('/upload');

        expect(res.status).toBe(400);
        expect(res.text).toBe('No file uploaded');
    });

    test('It should save the file in the correct directory', async () => {
        const filePath = path.join(__dirname, 'test-files/sample.txt');
        const res = await request(app).post('/upload').attach('file', filePath);

        const uploadedFilePath = path.join(__dirname, 'uploads', res.body.file.filename);

        expect(await fs.pathExists(uploadedFilePath)).toBe(true);
    });

    // Kiểm tra loại file không hợp lệ:
    test('It should reject an invalid file type', async () => {
        const res = await request(app)
          .post('/upload')
          .attach('file', path.join(__dirname, 'test-files/malicious.exe'));
      
        expect(res.status).toBe(400);
        expect(res.text).toContain('Invalid file type');
    });

    // Kiểm tra kích thước file quá lớn
    test('It should reject a file that is too large', async () => {
        const res = await request(app)
          .post('/upload')
          .attach('file', path.join(__dirname, 'test-files/large-file.zip'));
      
        expect(res.status).toBe(400);
        expect(res.text).toContain('File too large');
    });

    // Kiểm tra khi lưu file thất bại: Sửa chức năng upload trong server để trả lỗi khi có vấn đề với lưu trữ file
    test('It should handle storage errors gracefully', async () => {
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
          throw new Error('Disk full');
        });
      
        const res = await request(app)
          .post('/upload')
          .attach('file', path.join(__dirname, 'test-files/sample.txt'));
      
        expect(res.status).toBe(500);
        expect(res.text).toContain('Failed to save file');
    });

    // 
});

/**
    Lưu Ý
    Mock thư mục upload: Tránh ghi thực tế vào ổ đĩa trong test.

    Tăng code coverage:
        Thêm test để kiểm tra:
            Tên file có hợp lệ không.
            File trùng lặp có được xử lý đúng không.
            
    Kiểm tra bảo mật:
        Test với file có ký tự đặc biệt trong tên (../, %00, ...).
        Test với file nội dung mã độc.

 */