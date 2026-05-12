# Integration Test
Mục đích: Kiểm tra sự tương tác giữa các thành phần trong ứng dụng, ví dụ như kết nối cơ sở dữ liệu, giao tiếp giữa các API, hoặc tích hợp với các dịch vụ khác.

Cách viết: Thường sử dụng cùng các framework như vitest, Jest, Mocha nhưng có thể yêu cầu setup môi trường phức tạp hơn. Có thể sử dụng supertest để kiểm tra API trong Node.js.

Lợi ích: Giúp kiểm tra các thành phần hoạt động cùng nhau mà không chỉ kiểm tra riêng lẻ từng module.

Ví dụ thực tế:

Giả sử có một API tạo người dùng, chúng ta có thể viết integration test để kiểm tra việc gửi dữ liệu lên server và lưu vào cơ sở dữ liệu:


const request = require('supertest');
const app = require('../app'); // express app

describe('POST /users', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'testuser');
  });
});


describe("POST /api/login", () => {
  it("Login success", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "user@test.com",
        password: "123456",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("Login fail - wrong password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "user@test.com",
        password: "wrong",
      });

    expect(res.status).toBe(401);
  });
});