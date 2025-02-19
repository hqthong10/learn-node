const express = require('express');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);

const app = express();

// Khởi tạo Redis client với ioredis
const redisClient = new Redis({
  host: 'localhost', // Địa chỉ Redis server
  port: 6379,        // Port mặc định của Redis
  password: 'yourpassword', // Nếu có password
});

// Kiểm tra kết nối Redis
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Cấu hình session
app.use(
  session({
    store: new RedisStore({ client: redisClient }), // Sử dụng Redis Store
    secret: 'your-secret-key',                     // Chuỗi bí mật để ký session ID
    resave: false,                                 // Không lưu lại session nếu không thay đổi
    saveUninitialized: false,                      // Không lưu session trống
    cookie: {
      secure: false, // Đặt `true` nếu sử dụng HTTPS
      httpOnly: true, // Chặn truy cập cookie qua JavaScript (bảo mật)
      maxAge: 1000 * 60 * 60 * 24, // Thời gian sống của session (1 ngày)
    },
  })
);

// Route mẫu
app.get('/', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.send(`You have visited this page ${req.session.views} times`);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});