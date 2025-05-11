// const Room = require('./room-storage');
// 
// Room.init()

// const room = new Room('room-name');
// Room.addRoom(room, 'room-name');

// console.log(Room.rooms['room-name'
//  for(let i to 20) {
//     console.log(i);
//  }
// const async = require("async");

// function log(text, callback) {
//     const t = Math.floor(Math.random() * 100) + 1;
//     setTimeout(() => {
//         callback(null,`${text}-${t}`);
//     }, Math.floor(Math.random() * 100) + 1);
// }

// async.concat(['log1', 'log2', 'log3'], log, (err, results) => {
//     console.log(results);
// })
//

const text = `🎁CÔNG BỐ GIẢI THƯỞNG VIẾT TRUYỆN NGẮN MÙA 06 “CHUYỆN XƯA TÔI KỂ” - ĐỢT 02🎁

***
🔸Gió đưa cây cải về trời- Juki
👉 Các bạn có thể tìm đọc: https://piepme.com/gio-dua-cay-cai-ve-troi-juki-XVaIJAlMSid6.html 
1. NỘI DUNG CƠ BẢN: 30
2. CHẤT LƯỢNG GHI ÂM: 5
3. TƯƠNG TÁC: 1
4. CHIA SẺ: 
💰 TỔNG PI: 36

🔸LƯỠI GƯƠM THIÊNG CỦA LẠC LONG - Chip🐣🥨
👉 Các bạn có thể tìm đọc: https://piepme.com/luoi-guom-thieng-cua-lac-long-u3pRdf2er546.html 
1. NỘI DUNG CƠ BẢN: 30
2. CHẤT LƯỢNG GHI ÂM: 
3. TƯƠNG TÁC: 1
4. CHIA SẺ: 
💰 TỔNG PI: 31

🔸Bóng Lửa Trên Đất Mê Linh - Nắng. - 02 CHƯƠNG 
👉 Các bạn có thể tìm đọc: https://piepme.com/chuong-1-bong-lua-tren-dat-me-linh-nang--fOboSSYrAMM6.html 
1. NỘI DUNG CƠ BẢN: 30
2. CHẤT LƯỢNG GHI ÂM: 
3. TƯƠNG TÁC: 
4. CHIA SẺ: 
💰 TỔNG PI: 30

🔸Lớp học thầy Trình- Hoa Sala
👉 Các bạn có thể tìm đọc: https://piepme.com/lop-hoc-thay-trinh-hoa-sala-GUXhmPZs2146.html 
1. NỘI DUNG CƠ BẢN: 30
2. CHẤT LƯỢNG GHI ÂM: 
3. TƯƠNG TÁC: 
4. CHIA SẺ: 
💰 TỔNG PI: 30

🔸Dưới bóng cờ đại việt - Bùn cute😘
👉 Các bạn có thể tìm đọc: https://piepme.com/duoi-bong-co-dai-viet-WXhYTX3rVBw6.html  
1. NỘI DUNG CƠ BẢN: 30
2. CHẤT LƯỢNG GHI ÂM: 
3. TƯƠNG TÁC: 
4. CHIA SẺ: 
💰 TỔNG PI: 30

📍 TRUYỆN NGẮN KHUYẾN KHÍCH 20PI

🔸Xương Rồng
Ả Đại Nương - 03 CHƯƠNG
👉 Các bạn có thể tìm đọc: https://piepme.com/a-dai-nuong-chuong-1-xuong-rong-TgoLVIa3qPG6.html 

🔸akina
>> Lời Thề Dưới Trăng Ở Thành Cổ Vệ Ấp
👉 Các bạn có thể tìm đọc: https://piepme.com/loi-the-duoi-trang-o-thanh-co-ve-ap-akina-K1OmJLfoZLi6.html 

>> Ngày Anh Trở Về 
👉 Các bạn có thể tìm đọc: https://piepme.com/ngay-anh-tro-ve-akina-ToaCGTLrMoj6.html  

>> Chiếc Khăn Rằn Của Má 
👉 Các bạn có thể tìm đọc: https://piepme.com/chiec-khan-ran-cua-ma-akina--3uAo3JCxlhX6.html 

🔸Quách Thái Di
>> Mùa trăng xưa - 02 CHƯƠNG 
👉 Các bạn có thể tìm đọc: https://piepme.com/chuong-1-mua-trang-xua-quach-thai-di-w3FiKGCDEnm6.html

🔸Bùn cute😘
>> Bóng người gác thành
👉 Các bạn có thể tìm đọc: https://piepme.com/bong-nguoi-gac-thanh-0hBYD8xik1A6.html 

CẢM ƠN CÁC MẪU TRUYỆN NGẮN TỪ CÁC BẠN. HẸN CÁC BẠN VÀO MÙA GIẢI SAU 🤗`

// const PATTERN_AUTOLINK = /(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))(https?:\/\/[^\s]+)/gi;
const PATTERN_AUTOLINK = /(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))(https?:\/\/[a-z0-9&#=.\/\-?_]+)/gi;

text.split(PATTERN_AUTOLINK).forEach((item) => {
    if (!PATTERN_AUTOLINK.test(item)) {
        console.log('no', item)
        return;
    }
    console.log('ok', item)
});