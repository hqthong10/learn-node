# Functional/End-to-End (E2E) Test
Mục đích: Kiểm tra hành vi của toàn bộ ứng dụng từ đầu đến cuối, như cách một người dùng thật sự tương tác với hệ thống qua API hoặc giao diện.

Cách viết: Sử dụng các công cụ như Cypress, Selenium, hoặc Playwright để mô phỏng các tương tác thực tế từ người dùng. Với backend, thường là kiểm tra qua API endpoint.

Lợi ích: Đảm bảo toàn bộ ứng dụng hoạt động chính xác theo mong đợi từ phía người dùng hoặc client.

Ví dụ:
E2E test kiểm tra toàn bộ quy trình đăng nhập.

```
const request = require('supertest');
const app = require('../app');

describe('POST /login', () => {
  it('should log in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
```