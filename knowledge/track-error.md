# Dùng Chrome DevTools (Heap Snapshot)
call: node --inspect index.js
truy cập: Chrome → chrome://inspect
→ Chụp Heap Snapshot
→ So sánh nhiều snapshot theo thời gian
→ Tìm object nào tăng kích thước liên tục

ps: Đây là cách tốt nhất.

# Dùng “–inspect --trace-gc” để xem GC hoạt động
call: node --inspect --trace-gc index.js

Nếu heap không giảm về baseline → leak.

# Dùng clinic.js (clinic flame / bubbleprof)
npm install -g clinic
clinic doctor -- node index.js

# Dùng kiểm tra memory usage theo thời gian
setInterval(() => {
  console.log(process.memoryUsage());
}, 5000);

Nếu memory tăng liên tục → leak.

