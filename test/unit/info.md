# Unit Test
Mục đích: Kiểm tra các thành phần nhỏ nhất của ứng dụng (thường là các hàm hoặc phương thức) để đảm bảo rằng chúng hoạt động đúng cách với các đầu vào và đầu ra dự kiến.

Ví dụ:
function sum(a, b) {
  return a + b;
}

describe('mô tả test', () => {

  test('test case dung', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('test case sai', () => {
    expect(sum(1, 2)).toBe(2);
  });

  test('null', () => {
      const n = null;
      expect(n).toBeNull();
      expect(n).toBeDefined();
      expect(n).not.toBeUndefined();
      expect(n).not.toBeTruthy();
      expect(n).toBeFalsy();
  });

})
