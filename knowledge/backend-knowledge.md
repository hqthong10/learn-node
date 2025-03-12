
2. Kiến thức về HTTP & API
- HTTP Methods (GET, POST, PUT, DELETE, PATCH)
- Status Codes (200 OK, 404 Not Found, 500 Internal Server Error, ...)

- RESTful API vs GraphQL
- WebSockets (Realtime communication)
- OAuth, JWT, API Keys (Xác thực API)

📌 Thực hành: Tạo một RESTful API đơn giản với Express.js hoặc NestJS.

3. Cơ sở dữ liệu (Databases)
🔹 SQL (Quan hệ)
    MySQL, PostgreSQL, MariaDB
    SQL Query (JOIN, GROUP BY, INDEX, TRANSACTION)

🔹 NoSQL (Phi quan hệ)
    MongoDB, Redis, Cassandra

🔹 ORM/ODM
    Sequelize (Node.js + SQL)
    TypeORM (Node.js + SQL)
    Mongoose (Node.js + MongoDB)
    Prisma (SQL & NoSQL)

📌 Thực hành: Xây dựng CRUD API kết nối với MySQL hoặc MongoDB.

4. Authentication & Authorization
    Session-based Authentication (PHP, Express-session)
    Token-based Authentication (JWT, OAuth2, OpenID Connect)
    Third-party Authentication (Google, Facebook, GitHub login)

📌 Thực hành: Xây dựng chức năng đăng nhập với JWT hoặc OAuth2.

5. Caching & Performance Optimization
    Redis (Cache dữ liệu)
    Memcached (Cache phiên làm việc)
    CDN (Cloudflare, AWS CloudFront)
    Load Balancer (Nginx, HAProxy)
    Queue System (RabbitMQ, Kafka, BullMQ)

📌 Thực hành: Dùng Redis để cache API response.

6. Kiến trúc hệ thống & Microservices
    Monolithic vs Microservices
    Event-driven architecture
    Message Broker (RabbitMQ, Kafka, NATS)
    gRPC (Giao tiếp giữa các dịch vụ)

📌 Thực hành: Xây dựng Microservices đơn giản với RabbitMQ.

7. DevOps & Deployment
    Docker, Docker Compose
    Kubernetes
    CI/CD (GitHub Actions, GitLab CI, Jenkins)
    Cloud Providers (AWS, GCP, Azure, DigitalOcean)
    Nginx, Apache (Reverse Proxy)

📌 Thực hành: Deploy ứng dụng Node.js lên AWS EC2 bằng Docker.

8. Logging, Monitoring & Debugging
    Logging: Winston, Morgan (Node.js)
    Monitoring: Prometheus, Grafana, New Relic
    Error Tracking: Sentry, ELK Stack (Elasticsearch + Logstash + Kibana)

📌 Thực hành: Cấu hình Winston + Morgan để log request và error.

9. Testing
    Unit Testing: Jest, Mocha, Chai
    Integration Testing: Supertest, Postman
    Load Testing: k6, Apache JMeter

📌 Thực hành: Viết test case cho API với Jest.

10. Security
    SQL Injection (ORM, parameterized queries)
    XSS & CSRF Protection
    Rate Limiting (Express Rate Limit)
    Data Encryption (AES, RSA, bcrypt, Argon2)
    
📌 Thực hành: Cấu hình Helmet.js và rate limit trong Express.js.