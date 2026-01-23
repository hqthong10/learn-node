
# CronJob
- Cron là chương trình để xử lý các tác vụ lặp đi lặp lại ở lần sau. Cron Job đưa ra một lệnh để lên lịch “làm việc” cho một hành động cụ thể, tại một thời điểm cụ thể mà cần lặp đi lặp lại.

- Cron là một daemon, nghĩa là nó hoạt động dưới nền để thực thi những tác vụ không cần tương tác. Trong Windows, bạn đã quen với tiến trình chạy nền gọi là Services.

- Cron job trong Node.js là một tác vụ (job) được tự động hóa để thực thi vào một thời điểm hoặc thời gian cụ thể nào đó. Cron jobs thường được sử dụng để thực hiện các tác vụ định kỳ như gửi email, sao lưu dữ liệu, cập nhật cơ sở dữ liệu, hoặc thực hiện các công việc bảo trì hệ thống.

- Trong Node.js, các cron jobs có thể được thiết lập và quản lý bằng cách sử dụng các thư viện như node-cron, cron, hoặc các công cụ lập lịch khác. Các thư viện này cho phép bạn định nghĩa các tác vụ sẽ được thực hiện vào những khoảng thời gian cụ thể dựa trên cú pháp cron.

```
npm install node-cron

const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('Cron job executed every minute');
});
```

# schedule

```
 *    *    *    *    *    *
|    |    |    |    |    |
|    |    |    |    |    +-- Ngày trong tuần (0 - 7) (Chủ nhật là 0 hoặc 7)
|    |    |    |    +------- Tháng (1 - 12)
|    |    |    +----------- Ngày trong tháng (1 - 31)
|    |    +--------------- Giờ (0 - 23)
|    +------------------- Phút (0 - 59)
+----------------------- Giây (0 - 59) (tuỳ chọn)
```

- Dấu hoa thị (*) – để xác định tất cả tham số được lên lịch.
- Dấu phẩy (,) – để duy trì 2 hoặc nhiều lần thực thi một lệnh.
- Dấu gạch nối (-) – để xác định khoảng thời gian thiết lập lần thực thi một lệnh.
- Dấu gạch chéo (/) – để tạo khoảng thời gian nghỉ cụ thể.
- Cuối cùng (L) – cho mục đích cụ thể là chỉ định ngày cuối cùng của tuần trong tháng. Ví dụ, 3L nghĩa là thứ tư cuối cùng.
- Ngày trong tuần (W) – để xác định ngày trong tuần gần nhất. Ví dụ, 1W nghĩa là nếu ngày 1 là thứ 7, lệnh sẽ chạy vào thứ hai (ngày 3).
- **Hash (#) **– để xác định ngày của tuần, theo sau bởi số chạy từ 1 đến 5. Ví dụ, 1#2 nghĩa là ngày thứ Hai thứ hai.
- Dấu chấm hỏi (?) – để để lại khoảng trống.


- Chạy vào lúc 3 giờ hàng ngày
0 3 * * *

- Chạy vào lúc 17h ngày chủ nhật hàng tuần
0 17 * * 0

- Cứ 8 tiếng là chạy
0 */8 * * *

- Cứ 30 phút chạy một lần
*/30 * * * *

- Cứ 5 phút lúc 5AM, bắt đầu lúc 5:10 AM.
10-59/5 5 * * *

- Cứ chạy vào tháng 1,2,5 mỗi năm
* * * 1,2,5 *

- Cứ chạy vào ngày đầu tiên của tháng
0 0 1 * *

- Chạy mỗi giây
* * * * * *

- Chạy mỗi phút
0 * * * * *

- Chạy mỗi giờ
0 0 * * * *

- Chạy mỗi ngày
0 0 0 * * *

- Chạy vào ngày đầu tiên của mỗi tháng
0 0 0 1 * *

- Chạy vào mỗi Chủ nhật
0 0 0 * * 0




