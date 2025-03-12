# [v] NestJS là gì?
# Tại sao nên sử dụng NestJS thay vì ExpressJS?
# NestJS có hỗ trợ kiến trúc MVC không?
# So sánh NestJS với ExpressJS và Fastify?
# Module trong NestJS là gì?
- Module là một cách tổ chức code giúp chia nhỏ ứng dụng thành nhiều phần có thể tái sử dụng và quản lý dễ dàng.
- NestJS sử dụng module-based architecture, nghĩa là mỗi tính năng hoặc nhóm chức năng của ứng dụng sẽ được đóng gói trong một module riêng biệt.

- Mỗi module trong NestJS có thể chứa các thành phần sau:
+ Controllers (Xử lý request từ client)
+ Providers (Services, Guards, Interceptors, etc.)
+ Exports (Cho phép module khác sử dụng các thành phần của nó)
+ Imports (Nhập module khác để sử dụng)
+ Dependencies Injection (Inject các service)

# Controller trong NestJS là gì?
- Controllers là nơi xử lý các request từ client và trả về response.
- Chúng đóng vai trò như một điểm truy cập cho ứng dụng, giúp định tuyến và xử lý dữ liệu trước khi chuyển đến Service hoặc Database.

# Service trong NestJS là gì?
- Service trong NestJS là một provider giúp tách biệt business logic ra khỏi controllers, giúp code dễ quản lý, tái sử dụng và dễ kiểm thử (unit test).

# Provider trong NestJS là gì?
- Provider trong NestJS là một class hoặc một giá trị có thể được inject vào các thành phần khác như Controllers, Services, Guards, Interceptors... thông qua Dependency Injection (DI).
- Provider giúp:
✅ Quản lý business logic tách biệt với Controller.
✅ Tái sử dụng logic trong nhiều nơi.
✅ Hỗ trợ Dependency Injection, giúp code dễ mở rộng và test.
- Bất kỳ class nào có @Injectable() đều có thể trở thành một Provider.

# Middleware

# Exception filters

# Pipes

# Guards

# Interceptors

# Custom route decorators

# NestJS sử dụng Dependency Injection như thế nào?
# Pipe là gì? Khi nào nên sử dụng Pipe?
# Cách sử dụng ConfigModule trong NestJS để quản lý biến môi trường?
# Làm thế nào để bảo mật API trong NestJS?

# Câu hỏi NestJS nâng cao
1. Cách kết nối NestJS với PostgreSQL?
2. Cách kết nối NestJS với MongoDB?
3. Cách kết nối NestJS với MySQL?
4. So sánh TypeORM với Prisma trong NestJS?
5. Cách sử dụng MongooseModule trong NestJS để làm việc với MongoDB?
6. Khi nào nên dùng Repository Pattern trong NestJS?
7. Middleware trong NestJS là gì? Khác gì với Guards?
8. Cách tạo một Custom Guard để kiểm tra quyền truy cập API?
9. Khi nào nên sử dụng Interceptor? Interceptor hoạt động như thế nào?
10. NestJS hỗ trợ JWT Authentication như thế nào?
11. Cách bảo mật API với PassportJS trong NestJS?
12. Làm sao để ngăn chặn Brute-force attacks trên API NestJS?

# Câu hỏi NestJS theo từng module
1. Cách tạo một REST API trong NestJS?
2. Khi nào nên sử dụng GraphQL thay vì REST API?
3. Cách sử dụng Apollo GraphQL với NestJS?
4. Cách sử dụng Websockets trong NestJS?
5. NestJS có hỗ trợ Microservices không?
6. @nestjs/testing là gì?
7. Cách viết Unit Test và E2E Test trong NestJS?
8. Khi nào nên dùng Mock Dependencies trong Test?

# Câu hỏi thực tế về NestJS
1. Tạo một REST API đơn giản với NestJS để CRUD User?
2. Tạo một Middleware kiểm tra token JWT?
3. Viết một Guard để kiểm tra role của người dùng?
4. Viết một Interceptor để log thời gian xử lý API?
