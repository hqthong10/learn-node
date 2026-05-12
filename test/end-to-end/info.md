# Functional/End-to-End (E2E) Test
Mục đích: Kiểm tra hành vi của toàn bộ ứng dụng từ đầu đến cuối, như cách một người dùng thật sự tương tác với hệ thống qua API hoặc giao diện.

Cách viết: Sử dụng các công cụ như Cypress, Selenium, hoặc Playwright để mô phỏng các tương tác thực tế từ người dùng. Với backend, thường là kiểm tra qua API endpoint.

Lợi ích: Đảm bảo toàn bộ ứng dụng hoạt động chính xác theo mong đợi từ phía người dùng hoặc client.

Ví dụ:
E2E test kiểm tra toàn bộ quy trình đăng nhập.

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


test('login success', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('#email', 'test@email.com');
    await page.fill('#password', '123456');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/);
});

// Test API bằng Playwright (ít người biết)
// Playwright cũng test API được (nhưng thường dùng Supertest tốt hơn cho backend)
test('API login', async ({ request }) => {
  const res = await request.post('/api/login', {
    data: {
      email: 'test@email.com',
      password: '123456',
    },
  });

  expect(res.status()).toBe(200);
});