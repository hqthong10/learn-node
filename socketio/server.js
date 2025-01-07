// Import các thư viện cần thiết
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Tạo ứng dụng Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Cấu hình Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint kiểm tra server
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Notification Hub is running!' });
});

// Quản lý các client kết nối qua socket.io
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Lắng nghe từ client
  socket.on('subscribe', (channel) => {
    console.log(`Client ${socket.id} subscribed to ${channel}`);
    socket.join(channel);
  });

  socket.on('unsubscribe', (channel) => {
    console.log(`Client ${socket.id} unsubscribed from ${channel}`);
    socket.leave(channel);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Lắng nghe Redis Pub/Sub
redis.subscribe('notifications', (err) => {
  if (err) {
    console.error('Error subscribing to Redis:', err);
  } else {
    console.log('Subscribed to Redis channel: notifications');
  }
});

redis.on('message', (channel, message) => {
  if (channel === 'notifications') {
    const parsedMessage = JSON.parse(message);
    const { target, payload } = parsedMessage;
    console.log(`Broadcasting message to ${target}:`, payload);
    io.to(target).emit('notification', payload);
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Notification Hub server is running on port ${PORT}`);
});

// Hướng dẫn cấu hình
/**
 * 1. Tạo file `.env` để cấu hình các biến môi trường:
 *    REDIS_URL=redis://localhost:6379
 *    PORT=3000
 * 
 * 2. Chạy Redis server để sử dụng Pub/Sub.
 * 
 * 3. Khởi động server: `node app.js`
 * 
 * 4. Client kết nối bằng Socket.io tới server để nhận thông báo.
 */
