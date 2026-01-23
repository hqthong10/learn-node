# Performance Test
- Mục đích: Đo lường hiệu suất của ứng dụng khi có nhiều yêu cầu đồng thời hoặc khi tải nặng.

- Cách viết: Sử dụng công cụ như k6, JMeter hoặc Artillery để đo lường khả năng xử lý của API khi có nhiều request.

- Lợi ích: Giúp phát hiện các vấn đề về hiệu suất, độ trễ và khả năng chịu tải của hệ thống.

- Ví dụ thực tế:
Sử dụng k6 để kiểm tra hiệu suất API:

```
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://localhost:3000/api/users');
  sleep(1);
}
```