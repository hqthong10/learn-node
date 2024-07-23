const fs = require("fs-extra");

module.exports = {
    /**
     * fs.emptyDir
     * xóa sạch nội dung của một thư mục mà không xóa chính thư mục đó.
     */
    // fs.emptyDir(dir, err => {
    //     if (err) return console.error(err);
    //     console.log('Directory has been emptied!');
    // });
    clearDirectory: async (dir) => {
        try {
            const dir = "/path/to/your/directory";
            await fs.emptyDir(dir);
            console.log("Directory has been emptied!");
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    /**
     * fs.ensureDir
     * dùng để đảm bảo rằng một thư mục tồn tại.
     * Nếu thư mục không tồn tại, ensureDir sẽ tạo nó.
     */
    ensureDir: async () => {
        try {
            await fs.ensureDir(dir);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    /**
     * fs.copy
     * Sao chép tệp và thư mục
     */
    copy: () => {
        fs.copy('/path/to/src', '/path/to/dest')
        .then(() => console.log('Copy successful!'))
        .catch(err => console.error('Error copying:', err));
    }

    /**
     * remove
     * Xóa tệp hoặc thư mục
     */

    /**
     * Đọc JSON
     * fs.readJson
     */

    /**
     * Ghi JSON
     * fs.writeJson
     */

    /**
     * Di chuyển tệp hoặc thư mục
     * fs.move
     */

};
