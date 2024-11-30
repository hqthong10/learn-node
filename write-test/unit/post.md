# Unit Test
Mục đích: Kiểm tra các thành phần nhỏ nhất của ứng dụng (thường là các hàm hoặc phương thức) để đảm bảo rằng chúng hoạt động đúng cách với các đầu vào và đầu ra dự kiến.

Cách viết: Sử dụng các thư viện testing framework như vitest, Jest, Mocha hoặc Jasmine để viết unit test cho từng hàm, module cụ thể.

Lợi ích: Unit test giúp kiểm tra các thành phần nhỏ lẻ trong ứng dụng và dễ dàng phát hiện lỗi ở mức hàm hoặc module.

Ví dụ:
```
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```