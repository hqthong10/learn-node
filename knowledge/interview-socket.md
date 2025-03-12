# Socket.IO là gì? So sánh với WebSocket?
Gợi ý trả lời:
- Socket.IO là một thư viện giúp tạo kết nối real-time, event-based communication giữa client và server.
- Hỗ trợ fallback (polling nếu WebSocket không khả dụng).
- WebSocket là giao thức nền, còn Socket.IO là thư viện xây dựng trên WebSocket + thêm nhiều tính năng.

# Các tính năng chính của Socket.IO là gì?
- Kết nối real-time bidirectional.
- Broadcast tin nhắn đến nhiều client.
- Rooms & Namespaces để tổ chức luồng dữ liệu.
- Auto-reconnect khi mất kết nối.
- Middlewares xử lý dữ liệu trước khi nhận/gửi.
- Hỗ trợ binary data (video, hình ảnh,...).

# Sự khác biệt giữa "Rooms" và "Namespaces" trong Socket.IO?
- Mục đích:
    + Rooms: Nhóm người dùng để gửi tin nhắn
    + Namespaces: Tách biệt các kênh giao tiếp

- Cách hoạt động:
    + Rooms: Client có thể tham gia nhiều rooms
    + Namespaces: Mỗi namespace là một endpoint

- Kết nối:
    + Rooms: Trên cùng 1 connection
    + Namespaces: Kết nối mới cho mỗi namespace

# Làm sao để tạo và sử dụng "Rooms"?
- Server-side:
```
socket.join("room1");
io.to("room1").emit("message", "Hello Room1");
```

- Client-side: Tự động nhận nếu đã join room

# Làm sao để tạo "Namespace" trong Socket.IO?
- Server
```
const chat = io.of('/chat');
chat.on('connection', (socket) => {
  console.log('User connected to chat namespace');
});
```

- Client
```
const socket = io('/chat');
```

# Sự khác nhau giữa emit và broadcast?
- emit: Gửi tới 1 client cụ thể đang kết nối
- broadcast.emit: Gửi tới tất cả client khác, trừ client đang gửi

# Socket.IO hoạt động như thế nào khi client mất kết nối?
- Tự động reconnect với exponential backoff.
- Có thể tùy chỉnh thời gian reconnect và số lần thử lại.
```
const socket = io({
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
```

# Middleware trong Socket.IO là gì? Khi nào nên dùng?
- Middleware dùng để kiểm tra, xác thực dữ liệu trước khi tiếp nhận/gửi.
- Ví dụ: xác thực JWT khi client kết nối.
```
io.use((socket, next) => {
    if (isValid(socket.handshake.auth.token)) {
        next();
    } else {
        next(new Error("Authentication error"));
    }
});
```

# Các cách broadcast message trong Socket.IO?
- socket.broadcast.emit() → Tất cả client trừ bản thân.
- io.emit() → Tất cả client đang kết nối.
- io.to("room").emit() → Tất cả client trong room.
- socket.to("room").emit() → Tất cả client trong room, trừ bản thân.

# Cách gửi dữ liệu nhị phân (binary) qua Socket.IO?
```
socket.emit("image", buffer); // Gửi file ảnh hoặc video
```

# Socket.IO hoạt động qua những transport nào?
- WebSocket (ưu tiên).
- HTTP long-polling (fallback khi WebSocket không được hỗ trợ).

# Làm sao để scale Socket.IO qua nhiều server (cluster/microservices)?
- Dùng Redis Adapter để chia sẻ dữ liệu giữa nhiều server.
```
npm install @socket.io/redis-adapter

const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```
- Dùng @socket.io/cluster-adapter khi chạy Node.js cluster.

# Giải thích về @socket.io/cluster-adapter?
- Dùng khi chạy nhiều process với Node.js cluster hoặc PM2 cluster.
- Giúp đồng bộ các sự kiện giữa các process.

# Làm thế nào để bảo mật Socket.IO?
- Xác thực qua JWT/Middleware.
- Giới hạn kết nối (rate-limiting).
- Sử dụng HTTPS/WSS để bảo mật dữ liệu.

# Các vấn đề performance khi dùng Socket.IO và cách tối ưu?
- Sử dụng compression (nén) dữ liệu:
```
io.compress(true).emit("message", "Hello");
```
- Hạn chế emit nhiều message nhỏ, nên gộp lại (batching).
- Scale qua Redis hoặc cluster khi số lượng client lớn.
- Dùng rooms/namespaces để giới hạn phạm vi emit.

# So sánh Socket.IO và WebRTC cho real-time?
- Dùng cho:
    + Socket.IO: Chat, Noti, Game
    + WebRTC: Video/Voice call, P2P Data
- Connection:
    + Socket.IO: Client - Server
    + WebRTC: Peer to Peer (P2P)
- Hỗ trợ server relay:
    + Socket.IO: Có
    + WebRTC: Thường không (trừ TURN)

# Các event quan trọng của Socket.IO?
- connection: Khi client kết nối
- disconnect: Khi client ngắt kết nối
- message (custom event): Gửi/nhận dữ liệu
- reconnect, reconnecting: Tự động kết nối lại
- error: Lỗi xảy ra

# Nếu muốn xây dựng hệ thống chat cho 10.000 user online, bạn sẽ thiết kế Socket.IO thế nào?
- Load balancer với nginx: Phân chia user đều về các Socket.IO Node
- Socket.IO Server đa node (Horizontal Scaling): Chia nhiều Node Socket.IO + Redis Adapter để sync
- Xác thực người dùng (Authentication)
- Sử dụng Rooms để tối ưu gửi tin nhắn.
- Batching & Compression để tối ưu hiệu suất
- Giám sát hệ thống (monitoring) để đảm bảo ổn định khi nhiều user online.


# Làm sao xử lý các vấn đề lag, delay khi số lượng user lớn?
Gợi ý: Bật compression, batching message, giới hạn số lượng event gửi đi mỗi giây, scale nhiều node.

# Giải pháp backup hoặc failover cho hệ thống Socket.IO như thế nào?
Gợi ý: Chạy nhiều instance với load balancer (Nginx, HAProxy), dùng Redis để sync session, database để lưu trạng thái room.