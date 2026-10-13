# PM2 — Hướng dẫn sử dụng

> Người mới: đọc từ đầu đến mục 5. Người đã biết: xem [Bảng tra nhanh](#11-bảng-tra-nhanh) và mục [Ecosystem file](#5-ecosystem-file--cấu-hình-chuẩn).

## Mục lục

1. [PM2 là gì](#1-pm2-là-gì)
2. [Cài đặt](#2-cài-đặt)
3. [Lệnh cơ bản](#3-lệnh-cơ-bản)
4. [Fork mode vs Cluster mode](#4-fork-mode-vs-cluster-mode)
5. [Ecosystem file — cấu hình chuẩn](#5-ecosystem-file--cấu-hình-chuẩn)
6. [Logs](#6-logs)
7. [Giám sát](#7-giám-sát)
8. [Tự khởi động khi reboot server](#8-tự-khởi-động-khi-reboot-server)
9. [Zero-downtime & graceful shutdown](#9-zero-downtime--graceful-shutdown)
10. [Xử lý sự cố](#10-xử-lý-sự-cố)
11. [Bảng tra nhanh](#11-bảng-tra-nhanh)

---

## 1. PM2 là gì

**PM2** (Process Manager 2) là trình quản lý tiến trình cho Node.js trên production. Thay vì `node app.js` (tắt terminal là app chết, crash là app chết), PM2 giữ app luôn chạy.

| Tính năng | Ý nghĩa |
|---|---|
| **Auto restart** | App crash → PM2 tự bật lại |
| **Cluster mode** | Chạy nhiều instance, tận dụng mọi lõi CPU, tự cân bằng tải |
| **Zero-downtime reload** | Cập nhật code không làm gián đoạn request |
| **Startup script** | Server reboot → app tự chạy lại |
| **Logs & monitor** | Gom log, xem CPU/RAM theo thời gian thực |

PM2 chạy được cả app không phải Node (Python, Bash, binary...).

```
          ┌──────────── PM2 daemon (chạy nền) ────────────┐
pm2 CLI → │  api (id 0)   api (id 1)   worker (id 2)  ... │
          │   restart nếu crash • gom log • đo CPU/RAM    │
          └───────────────────────────────────────────────┘
```

---

## 2. Cài đặt

```bash
npm install -g pm2
pm2 --version
pm2 update                       # cập nhật daemon sau khi nâng cấp PM2
```

---

## 3. Lệnh cơ bản

```bash
pm2 start app.js                 # chạy app
pm2 start app.js --name api      # đặt tên (nên luôn đặt)
pm2 start npm --name web -- start          # chạy "npm start"
pm2 start "node dist/main.js" --name api   # chạy một câu lệnh

pm2 list                         # (hoặc pm2 ls) danh sách tiến trình
pm2 show api                     # chi tiết một app

pm2 restart api                  # tắt rồi bật lại (có downtime ngắn)
pm2 reload api                   # reload không downtime (cluster mode)
pm2 stop api                     # dừng, vẫn còn trong danh sách
pm2 delete api                   # dừng và xóa khỏi danh sách
```

Thay `api` bằng **tên**, **id** (`0`, `1`...) hoặc `all`.

Tùy chọn hay dùng khi `start`:

| Tùy chọn | Ý nghĩa |
|---|---|
| `--name api` | Đặt tên |
| `-i max` | Cluster mode, số instance = số lõi CPU |
| `--watch` | Tự restart khi file thay đổi (chỉ dùng khi dev) |
| `--max-memory-restart 500M` | Restart khi RAM vượt ngưỡng |
| `--env production` | Dùng bộ biến môi trường trong ecosystem file |
| `--no-autorestart` | Không tự restart (cho script chạy một lần) |
| `--cron-restart "0 3 * * *"` | Restart theo lịch (vd 3h sáng mỗi ngày) |

---

## 4. Fork mode vs Cluster mode

```bash
pm2 start app.js                 # fork mode (mặc định): 1 tiến trình
pm2 start app.js -i max          # cluster mode: N tiến trình = N lõi CPU
pm2 start app.js -i 4            # cluster mode: 4 tiến trình
pm2 scale api 6                  # tăng/giảm số instance khi đang chạy
```

| | Fork | Cluster |
|---|---|---|
| Số tiến trình | 1 | Nhiều, chung một port |
| Tận dụng CPU | 1 lõi | Tất cả lõi |
| Zero-downtime `reload` | Không | Có |
| Ngôn ngữ | Bất kỳ | Chỉ Node.js |
| Dùng cho | Worker, cron, app không phải Node | HTTP server, API |

> ⚠️ Cluster mode = nhiều tiến trình **không chia sẻ bộ nhớ**. Session, cache, biến toàn cục lưu trong RAM sẽ không đồng bộ giữa các instance → dùng Redis/DB. Với Socket.IO cần sticky session hoặc Redis adapter.

---

## 5. Ecosystem file — cấu hình chuẩn

Thay vì gõ lệnh dài, khai báo mọi thứ trong một file và commit vào repo.

```bash
pm2 init simple                  # tạo ecosystem.config.js mẫu
```

```js
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api',
      script: './dist/main.js',
      instances: 'max',            // hoặc số cụ thể
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {                       // mặc định
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {            // dùng với --env production
        NODE_ENV: 'production',
        PORT: 8080,
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      time: true,                  // thêm timestamp vào log
    },
    {
      name: 'worker',
      script: './dist/worker.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '0 3 * * *',
    },
  ],
};
```

```bash
pm2 start ecosystem.config.js                     # chạy tất cả app
pm2 start ecosystem.config.js --only api          # chỉ chạy app "api"
pm2 start ecosystem.config.js --env production    # dùng env_production
pm2 reload ecosystem.config.js --env production   # cập nhật cấu hình + reload
```

> Đổi biến môi trường mà chỉ `pm2 restart api` thì env cũ **vẫn giữ nguyên**. Phải chạy lại với ecosystem file hoặc thêm `--update-env`.

---

## 6. Logs

```bash
pm2 logs                         # xem log mọi app (realtime)
pm2 logs api                     # log của một app
pm2 logs api --lines 200         # xem 200 dòng gần nhất
pm2 logs api --err               # chỉ log lỗi
pm2 flush                        # xóa toàn bộ log
```

Log mặc định nằm ở `~/.pm2/logs/`. Log **không tự xoay vòng** → sẽ đầy ổ đĩa. Cài module rotate:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M   # mỗi file tối đa 10MB
pm2 set pm2-logrotate:retain 7       # giữ 7 file
pm2 set pm2-logrotate:compress true  # nén file cũ
```

---

## 7. Giám sát

```bash
pm2 monit                        # dashboard trong terminal: CPU, RAM, log
pm2 list                         # cột restart (↺) tăng liên tục = app đang crash
pm2 show api                     # uptime, số lần restart, đường dẫn log, env
pm2 describe api                 # giống show
```

---

## 8. Tự khởi động khi reboot server

```bash
pm2 startup                      # in ra một lệnh sudo → copy và chạy lệnh đó
pm2 start ecosystem.config.js --env production
pm2 save                         # lưu danh sách app hiện tại

pm2 resurrect                    # khôi phục thủ công danh sách đã save
pm2 unstartup                    # gỡ startup script
```

> Mỗi khi thêm/xóa app, nhớ chạy lại `pm2 save`. Sau khi nâng cấp Node (vd qua nvm), chạy lại `pm2 unstartup` rồi `pm2 startup` vì đường dẫn node đã đổi.

---

## 9. Zero-downtime & graceful shutdown

`pm2 reload` (cluster mode) restart **từng instance một**: bật instance mới → chờ sẵn sàng → tắt instance cũ.

Để request đang xử lý không bị cắt, app cần tự đóng gọn gàng khi nhận tín hiệu `SIGINT`:

```js
const server = app.listen(PORT, () => {
  if (process.send) process.send('ready');   // báo PM2 đã sẵn sàng
});

process.on('SIGINT', () => {
  server.close(async () => {                 // ngừng nhận request mới, chờ request cũ xong
    await db.close();
    process.exit(0);
  });
});
```

```js
// ecosystem.config.js
{
  wait_ready: true,        // chờ process.send('ready') thay vì coi là sẵn sàng ngay
  listen_timeout: 10000,   // tối đa 10s chờ 'ready'
  kill_timeout: 5000,      // cho 5s để shutdown trước khi bị SIGKILL
}
```

**Quy trình deploy đơn giản:**

```bash
git pull
npm ci
npm run build
pm2 reload ecosystem.config.js --env production
```

---

## 10. Xử lý sự cố

| Triệu chứng | Kiểm tra / Cách xử lý |
|---|---|
| Trạng thái `errored`, restart liên tục | `pm2 logs api --err --lines 100` xem lỗi khởi động |
| App chạy nhưng env sai | `pm2 show api` xem env; restart với `--update-env` |
| Mất app sau reboot | Chưa `pm2 startup` hoặc quên `pm2 save` |
| RAM tăng dần | Có thể rò rỉ bộ nhớ; tạm thời đặt `max_memory_restart` |
| Ổ đĩa đầy | Log quá lớn → `pm2 flush`, cài `pm2-logrotate` |
| `--watch` restart liên tục | Đang watch cả `node_modules`/`logs` → thêm `ignore_watch` |
| PM2 tự lỗi, lệnh treo | `pm2 kill` (tắt daemon) → `pm2 resurrect` |
| Lệnh `pm2` không thấy app của user khác | Mỗi user có daemon riêng (`~/.pm2`) → đổi đúng user |

---

## 11. Bảng tra nhanh

| Việc cần làm | Lệnh |
|---|---|
| Chạy app | `pm2 start app.js --name api` |
| Chạy theo cấu hình | `pm2 start ecosystem.config.js --env production` |
| Cluster dùng mọi lõi | `pm2 start app.js -i max` |
| Danh sách | `pm2 ls` |
| Chi tiết | `pm2 show api` |
| Reload không downtime | `pm2 reload api` |
| Restart | `pm2 restart api` |
| Restart kèm env mới | `pm2 restart api --update-env` |
| Dừng / xóa | `pm2 stop api` / `pm2 delete api` |
| Đổi số instance | `pm2 scale api 4` |
| Xem log | `pm2 logs api --lines 100` |
| Xóa log | `pm2 flush` |
| Dashboard | `pm2 monit` |
| Bật khi reboot | `pm2 startup` → `pm2 save` |
| Khôi phục danh sách | `pm2 resurrect` |
| Tắt hẳn PM2 | `pm2 kill` |
