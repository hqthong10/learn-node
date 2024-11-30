# PM2 là gì?
PM2 (Process Manager 2) là một trình quản lý tiến trình (process manager) dành cho các ứng dụng Node.js, giúp đơn giản hóa việc quản lý và giám sát các ứng dụng server-side, đặc biệt là các ứng dụng sản xuất (production).
PM2 hỗ trợ quản lý nhiều tiến trình (processes), tự động khởi động lại khi có sự cố, và cung cấp nhiều tính năng mạnh mẽ cho việc giám sát, cân bằng tải (load balancing) và duy trì tính ổn định của hệ thống.

### Các tính năng nổi bật của PM2
1. Tự động khởi động lại: Nếu một ứng dụng bị crash, PM2 sẽ tự động khởi động lại ứng dụng đó.
2. Cân bằng tải (Load Balancing): PM2 hỗ trợ cluster mode, cho phép bạn chạy nhiều instance của cùng một ứng dụng để tối ưu hóa việc sử dụng CPU.
3. Quản lý nhiều tiến trình: PM2 có thể khởi chạy và quản lý nhiều ứng dụng khác nhau cùng một lúc, bao gồm cả các ứng dụng không phải Node.js.
4. Giám sát: PM2 cung cấp tính năng giám sát hiệu suất và trạng thái của ứng dụng, giúp theo dõi các thông số như CPU, bộ nhớ, và thời gian chạy.
5. Tự động khởi động lại sau khi reboot: PM2 có thể cấu hình để khởi động lại các ứng dụng tự động sau khi hệ thống server khởi động lại.
6. Zero-downtime deployment: PM2 cho phép triển khai các ứng dụng mà không gây downtime (ngưng hoạt động), nhờ vào cơ chế rolling restart.

### Cách PM2 hoạt động
PM2 quản lý các ứng dụng Node.js dưới dạng các tiến trình, và cung cấp nhiều tùy chọn quản lý như khởi động, dừng, tạm dừng, và khởi động lại các tiến trình này. PM2 hoạt động dựa trên hai chế độ chính:

1. Fork Mode: Chạy ứng dụng như một tiến trình đơn lẻ. Đây là chế độ mặc định của PM2, phù hợp với các ứng dụng nhỏ hoặc khi không cần tận dụng toàn bộ CPU.
```
pm2 start app.js
```

2. Cluster Mode: Chạy nhiều instance của ứng dụng dưới dạng cluster, giúp tận dụng hết các lõi CPU của máy chủ. Điều này tăng khả năng chịu tải và đảm bảo hiệu suất cao.
```
pm2 start app.js -i max
```
Ở đây, -i max sẽ tạo ra số lượng instance tương ứng với số lượng lõi CPU trên máy chủ.


### Một số lệnh cơ bản trong PM2
- Khởi chạy ứng dụng:
```
pm2 start app.js
```

- Liệt kê các ứng dụng đang chạy:
```
pm2 list
```

- Khởi động lại ứng dụng:
```
pm2 restart app.js
```

- Dừng ứng dụng:
```
pm2 stop app.js
```

- Xóa ứng dụng:
```
pm2 delete app.js
```

- Xem logs:
```
pm2 logs
```

- Theo dõi hiệu suất và tài nguyên:
```
pm2 monit
```

- Tự động khởi động sau khi reboot: PM2 có khả năng cấu hình để khởi động lại các ứng dụng sau khi hệ thống reboot. Để làm điều này, bạn có thể sử dụng lệnh:
```
pm2 startup
pm2 save
```
- Xóa logs:
```
pm2 flush
```