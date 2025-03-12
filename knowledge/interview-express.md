# [v] Express.js là gì? Tại sao nên sử dụng nó?
- Express.js là một web framework tối giản và nhanh chóng dành cho Node.js, giúp bạn dễ dàng xây dựng RESTful APIs, web applications hoặc backend services.
- Nó cung cấp một bộ công cụ mạnh mẽ để quản lý routing, middleware, request/response handling, và nhiều tính năng khác.
- Đặc điểm chính của Express.js:
    + Nhẹ và nhanh: Express không đi kèm quá nhiều tính năng mặc định, giúp tối ưu hiệu suất.
    + Routing mạnh mẽ: Hỗ trợ định tuyến URL đơn giản nhưng hiệu quả.
    + Middleware linh hoạt: Dễ dàng thêm chức năng như xác thực, logging, xử lý lỗi.
    + Tích hợp dễ dàng với cơ sở dữ liệu như MongoDB, MySQL, PostgreSQL.
    + Cộng đồng lớn: Có rất nhiều tài liệu, plugin hỗ trợ và được sử dụng rộng rãi trong hệ sinh thái Node.js.

- Tại sao nên sử dụng Express.js?
    + Dễ học và dễ sử dụng
    + Tối ưu hiệu suất & linh hoạt
    + Xây dựng RESTful API nhanh chóng
    + Cộng đồng lớn & hệ sinh thái mạnh

# So sánh Express.js với NestJS hoặc Koa.js?
- Express.js: Nhẹ, linh hoạt, phổ biến, phù hợp cho REST API & web server, mức độ phổ biến cao.
- NestJS: Kiến trúc module hóa, sử dụng TypeScript, phù hợp cho dự án lớn, mức độ phổ biến cao nhưng thấp hơn Express.js
- Koa.js: Nhẹ hơn Express, sử dụng async/await thay vì callback, mức độ phổ biến thấp hơn NestJS.
- Fastify: Hiệu suất cao hơn Express, tối ưu cho API tốc độ cao, mức độ phổ biến tương đương Koa.js

# Cách tạo một server đơn giản với Express.js?
```
npm init -y        # Khởi tạo project Node.js
npm install express  # Cài đặt Express.js

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware để parse JSON request body
app.use(express.json());

// Route đơn giản
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// API lấy danh sách người dùng (demo)
app.get('/users', (req, res) => {
    res.json([{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" }]);
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

```

# Middleware trong Express.js là gì? Có bao nhiêu loại middleware?
# app.use() khác gì với app.get(), app.post()?
# Sự khác nhau giữa req.query, req.params và req.body?
# Router trong Express.js hoạt động như thế nào?


# Middleware trong Express.js được thực thi theo thứ tự nào?
# Sự khác nhau giữa global middleware và route-specific middleware?
# Khi nào nên sử dụng third-party middleware (vd: cors, helmet)?
# Cách viết một custom middleware?
# next() hoạt động như thế nào trong middleware?
# Khi nào sử dụng error-handling middleware trong Express?

# Khi nào nên dùng express.Router()?
# Cách xử lý các route động (/users/:id)?
# Làm sao để redirect người dùng đến một trang khác?
# Khi nào sử dụng res.send(), res.json(), res.end()?
# Làm sao để xử lý route không tồn tại (404 Not Found)?

# Làm sao để lấy dữ liệu từ query string?
# Cách thiết lập response headers trong Express?
# Khi nào sử dụng streaming response?
# Làm sao để gửi một file trong Express (res.sendFile())?

# Làm sao để kết nối Express với MongoDB (Mongoose)?
# Express có hỗ trợ kết nối với PostgreSQL/MySQL không? Nếu có thì dùng cách nào?
# ORM nào phổ biến với Express.js? So sánh Sequelize và TypeORM?
# Cách tạo một API CRUD với Express.js và MongoDB?

# Cách bảo vệ API với JWT (JSON Web Token)?
# Khi nào nên dùng session-based authentication thay vì JWT?
# Cách triển khai OAuth2 trong Express.js?
# Helmet.js là gì? Nó giúp bảo vệ Express app như thế nào?
# CORS là gì? Làm sao để enable CORS trong Express?
# Làm sao để chống lại SQL Injection và XSS trong Express.js?

# Express.js có hỗ trợ WebSocket không? Nếu có thì làm sao?
# Khi nào nên sử dụng Socket.io với Express?
# Sự khác nhau giữa WebSocket và HTTP polling?
# Làm sao để triển khai real-time notifications với Express?

# Làm sao để xử lý file upload trong Express?
# Khi nào nên dùng multer?
# Cách lưu file vào Cloud Storage (AWS S3, Google Cloud)?
# Khi nào nên dùng Base64 thay vì lưu file trực tiếp?

# Khi nào nên dùng caching trong Express?
# Redis có thể tối ưu hiệu suất Express.js như thế nào?
# Làm sao để tối ưu API response time trong Express?
# Khi nào nên dùng Load Balancer với Express.js?
# Khi nào nên dùng Compression (gzip) để tối ưu hiệu suất?

# Làm sao để debug Express.js hiệu quả?
# Khi nào nên dùng Mocha, Jest, Supertest?
# Làm sao để viết unit test cho route trong Express?
# Cách kiểm tra một API có hoạt động đúng không?
