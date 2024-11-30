# Acceptance Test
- Mục đích: Kiểm tra xem toàn bộ hệ thống có đáp ứng được các yêu cầu nghiệp vụ của ứng dụng hay không.

- Cách viết: Sử dụng các framework như Cucumber để mô tả kịch bản (scenarios) từ góc nhìn của người dùng và kiểm tra các yêu cầu đã được triển khai chính xác.

- Lợi ích: Acceptance test đảm bảo rằng ứng dụng hoạt động đúng như mong đợi từ phía người dùng hoặc khách hàng.

- Ví dụ thực tế:
Dùng Cucumber để viết acceptance test cho tính năng đăng ký tài khoản:

```
Feature: User Registration
  Scenario: Successful registration
    Given the user is on the registration page
    When the user submits the form with valid information
    Then the user should be redirected to the welcome page
```