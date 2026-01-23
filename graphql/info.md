1. Hiểu khái niệm cơ bản
- GraphQL là gì? So sánh với REST API.
GraphQL là một ngôn ngữ truy vấn (query language) dành cho API và một runtime để thực thi các truy vấn đó dựa trên dữ liệu của bạn. Nó được Facebook phát triển vào năm 2012 và công khai vào năm 2015.
Thay vì phải làm việc với nhiều endpoint như REST, GraphQL chỉ có một endpoint duy nhất để client có thể lấy đúng dữ liệu cần thiết một cách linh hoạt.

- Cách hoạt động của GraphQL.
- Các thành phần chính: Query, Mutation, Subscription.
- Schema, Type System, Resolvers.

2. Thực hành với GraphQL Playground
- Cài đặt Apollo Server hoặc Express GraphQL.
- Tạo một GraphQL Server đơn giản.
- Viết query, mutation, và subscription đầu tiên.

3. Kết nối với Database
- Sử dụng Prisma, TypeORM, hoặc MongoDB với GraphQL.
- Tạo resolvers để lấy dữ liệu từ database.

4. Học cách sử dụng GraphQL Client
- Dùng Apollo Client trong React/Vue/Next.js.
- Quản lý cache và state với Apollo.
- Gọi API GraphQL từ frontend.

5. Authentication & Authorization
- Xác thực bằng JWT hoặc OAuth.
- Phân quyền với GraphQL Directives.

6. Subscription & Realtime
- Thiết lập WebSocket để cập nhật dữ liệu theo thời gian thực.

7. Tối ưu hiệu suất
- DataLoader để tránh N+1 query.
- Batching & Caching.

8. Triển khai (Deployment)
- Deploy lên Vercel, AWS Lambda, Heroku, Docker.