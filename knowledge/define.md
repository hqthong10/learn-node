# HLS - HTTP Live Streaming
HLS là viết tắt của HTTP Live Streaming, là một giao thức để streaming video trên toàn internet.
Được phát triển bởi Apple, ban đầu chỉ có iPhone là hỗ trợ giao thức này, nhưng ngày nay các thiết bị và phần mềm đều hỗ trợ nó và nó trở thành giao thức phổ biến nhất.
HLS là http-based, nó sử dụng web server để truyền tải nội dung. Điều này có nghĩa là bạn không cần phải có hạ tầng đặc biệt chỉ cần có web server hoặc sử dụng CDN là được. Ngoài ra vì HLS là http-based nên nó cũng sẽ ít có khả năng bị chặn bởi Firewall
Với HLS video sẽ được chia thành các segments nhỏ, là phương thức adaptive bitrate video tức là có thể chọn định dạng video phù hợp (480p, 720p…) để truyền tải qua Internet tùy vào tốc độ mạng của bạn.
Nhược điểm của nó là độ trễ cao. Ví dụ cả xóm bạn đang xem đá bóng, bạn thấy hàng xóm hô “Vào !!!” rồi còn bạn thì vẫn chưa thấy đâu. Kiểu vậy.

# MPEG-DASH
MPEG-DASH là đối thủ cạnh tranh với HLS. Trong khi HLS đang cạnh tranh với các giao thức khác và chưa có kết quả rõ ràng thì cộng đồng nguồn mở đã phát triển MPEG-DASH trong khoảng từ năm 2009 – 2012.
Đặc điểm đầu tiên kể đến đó là MPEG-DASH cũng là phương thức adaptive bitrate video giống với HLS. Có độ trễ thấp hơn HLS khoảng 15%.
Cách đây vài năm thì MPEG-DASH cũng mấp mé tranh ngôi quán quân với HLS nhưng bây giờ tình hình đã thay đổi.
Thời điểm năm 2017 MPEG-DASH không được hỗ trợ bởi Safari, trong khi các thiết bị của Apple ngày càng phổ biến trên toàn cầu. Đến giữa năm 2019 thì Apple cũng cho ra mắt Low-Latency HLS thế nên tính đến thời điểm hiện tại HLS vẫn đang là giao thức streaming phổ biến nhất.

# RTMP - Real-Time Messaging Protocol
RTMP là giao thức được phát triển bởi Adobe, sử dụng để truyền tải âm thanh và video với Adobe Flash Player. Nó giống như là việc cách đây khoảng 10 năm bạn ra hàng net, muốn xem video bạn phải cài thêm Adobe Flash Player cho trình duyệt IE chẳng hạn. Vì thời buổi đó các flash web đang rất thông dụng

RTMP là từ viết tắt của Real Time Messaging Protocol. RTMP ban đầu là một giao thức độc quyền được phát triển bởi Macromedia (Ngày nay là Adobe System) để truyền phát âm thanh, video và dữ liệu với hiệu suất cao qua Internet, giữa trình phát Flash và máy chủ. Macromedia hiện thuộc sở hữu của Adobe, đã phát hành một phiên bản chưa hoàn chỉnh về đặc điểm kỹ thuật của giao thức để phát hành chính thức.
RTMP là một giao thức dựa trên TCP, duy trì các kết nối liên tục và cho phép giao tiếp với độ trễ thấp. Để phân phối luồng một cách trơn tru và truyền tải càng nhiều dữ liệu càng tốt, nó chia luồng thành các đoạn (fragments) và kích thước của chúng được thỏa thuận tùy vào máy khách (Người khởi tạo) và máy chủ.
Kích thước đoạn mặc định cho dữ liệu âm thanh là 64 byte và cho dữ liệu video là 128 byte và hầu hết các loại dữ liệu khác. Các đoạn từ các luồng khác nhau sau đó có thể được xen kẽ và ghép thành một kết nối duy nhất.

# VOD - Video On Demand
VOD là một hệ thống cho phép người dùng có thể lựa chọn và xem nội dung video theo đúng ý thích của mỗi cá nhân trên rất nhiều thiết bị hiện có như TV, máy tính, máy tính bảng, điện thoại,... thông qua đường truyền internet.

# WebRTC
Là giao thức peer-to-peer livestream với độ trễ thậm chí
Ngày nay để ứng dụng tối đa các lợi ích mà các giao thức livestream đem lại người ta sẽ sử dụng RTMP cho việc nhận video để thu về các video nguồn một cách nhanh nhất và sử dụng HLS để phục vụ đa dạng người dùng cuối nhanh nhất (kết hợp HLS với CDN).

# UMD
UMD là viết tắt của "Universal Module Definition" (Định nghĩa Mô-đun Đa năng). Đây là một kỹ thuật trong lập trình JavaScript để viết các thư viện hoặc module có thể sử dụng trong nhiều môi trường khác nhau, bao gồm cả môi trường trình duyệt và môi trường máy chủ (như Node.js).

# Babel
Babel là một công cụ biên dịch (transpiler) JavaScript mã nguồn mở, được sử dụng rộng rãi trong cộng đồng lập trình JavaScript. Chức năng chính của Babel là chuyển đổi (compile) mã nguồn JavaScript từ một phiên bản (version) của ngôn ngữ JavaScript sang một phiên bản khác. Thông thường, Babel được sử dụng để chuyển đổi mã nguồn JavaScript hiện đại (ES6/ES2015 trở lên) thành mã JavaScript tương thích với các phiên bản trình duyệt và môi trường chạy cũ hơn.

# Monolithic Architecture

# Service worker

# ACID Transactions
(Atomicity, Consistency, Isolation, Durability)
- Atomicity: Đảm bảo rằng tất cả các hoạt động trong giao dịch được thực hiện hoặc không có hoạt động nào được thực hiện.
- Consistency: Đảm bảo rằng, sau khi hoàn thành giao dịch, cơ sở dữ liệu vẫn ở trạng thái nhất quán.
- Isolation: Đảm bảo rằng các hoạt động trong giao dịch được tách biệt khỏi các giao dịch khác đang được thực hiện đồng thời.
- Durability: Đảm bảo rằng khi giao dịch được hoàn thành thành công, hiệu ứng của nó sẽ được lưu trữ liên tục trong cơ sở dữ liệu.

# BASE Transactions
(Basically Available, Soft state, Eventually consistent)

# SQL (Structured Query Language)

# NoSQL (Not Only SQL)

# I/O non-blocking
- Blocking là khái niệm đề cập đến hành động chặn thực thi các hoạt động tiếp theo để chờ 1 hoạt động kết thúc; ngược lại thì non-blocking chỉ việc sẽ không chặn. Trong Node, Non-blocking chủ yếu đề cập đến các hoạt động nhập xuất dữ liệu (I/O – input/output); tất cả các function xử lý I/O trong thư viện chuẩn của NodeJS đều cung cấp phiên bản đồng bộ, bất đồng bộ và chấp nhận các hàm callback.

# event-driven programming (Lập trình hướng sự kiện)
- là mô hình lập trình mà trong đó luồng thực thi chương trình được xác định bởi các sự kiện (events). NodeJS xây dựng dựa trên lập trình hướng sự kiện, tức là source code viết ra để đáp ứng với các sự kiện tác động lên ứng dụng, chúng ta cần viết code lấy thông tin của các sự kiện cùng tham số đầu vào, tiếp đến là xử lý thực thi hành động và trả về kết quả tương ứng.

# worker thread

# NPM
- NPM hay Node Package Manager là chương trình quản lý thư viện ngầm định trong môi trường NodeJS; nó bao gồm một command line từ client (npm) và cơ sở dữ liệu trực tuyến chứa các gói public và private còn được gọi là npm registry.

# REPL
- REPL là viết tắt của Read, Eval, Print và Loop là một đặc tính của NodeJS cho phép lập trình viên viết code và chạy trực tiếp trên màn hình shell/console/terminal để debug, kiểm tra code mà không cần tạo ra bất cứ file hay folder nào.

# DDL (Data Definition Language)
- Ngôn ngữ định nghĩa dữ liệu (DDL) là một tập hợp con của SQL. Chức năng chính của nó là tạo, sửa đổi và xóa cấu trúc cơ sở dữ liệu chứ không phải dữ liệu.

# DML (Data Manipulation Language) : Ngôn ngữ thao tác dữ liệu
- DML là một tiểu thể loại của SQL, viết tắt của Ngôn ngữ thao tác dữ liệu. Mục đích của DML là chèn, truy xuất, cập nhật và xóa dữ liệu khỏi cơ sở dữ liệu. Với điều này, chúng ta có thể thực hiện các thao tác trên các bản ghi hiện có.

# concurrency: khả năng xử lý đồng thời
# Load balancing: Cơ chế phân chia công việc
# Round Robin
# Sticky Sessions

# InnoDB
- InnoDB là một storage engine mạnh mẽ và linh hoạt trong MySQL, cung cấp nhiều tính năng quan trọng giúp quản lý dữ liệu một cách hiệu quả và an toàn. Với hỗ trợ transactions, foreign keys, và khả năng xử lý đồng thời cao, InnoDB thích hợp cho hầu hết các ứng dụng cơ sở dữ liệu hiện đại. Để tận dụng tối đa các ưu điểm của InnoDB, bạn cần hiểu rõ cách cấu hình và tối ưu hóa các tham số của nó, cũng như thiết kế cơ sở dữ liệu và chỉ mục một cách hợp lý.

# MyISAM

# Dependency Injection (DI)
- Một kỹ thuật trong đó các phụ thuộc (dependencies) của một class hoặc module được cung cấp từ bên ngoài thay vì tự tạo bên trong.
- Dùng để tăng khả năng kiểm tra và tái sử dụng mã.

# Middleware Pipeline
- Luồng xử lý của middleware khi một yêu cầu HTTP đi qua ứng dụng backend.
- Mỗi middleware có thể thực hiện một số hành động hoặc chuyển tiếp yêu cầu cho middleware tiếp theo.

# Data Modeling
- Quá trình thiết kế cách dữ liệu được tổ chức, lưu trữ và quan hệ trong cơ sở dữ liệu.
- Ví dụ: Tạo bảng và ánh xạ quan hệ (1-nhiều, nhiều-nhiều).

# Rate Throttling
- Giới hạn tạm thời và làm chậm các yêu cầu quá tải.

# Rate Limiting
- Ngăn chặn hoàn toàn yêu cầu vượt ngưỡng.

# Session Store
Một nơi lưu trữ thông tin phiên (session) của người dùng, thường sử dụng Redis hoặc cơ sở dữ liệu SQL.

# Lazy Loading
- Chỉ tải dữ liệu hoặc module khi cần thiết, thay vì tải toàn bộ ngay từ đầu.
- Thường được dùng để tối ưu hiệu suất.

# Hot Reloading
- Cho phép ứng dụng tự động cập nhật mã nguồn mà không cần khởi động lại server.

# Circuit Breaker Pattern
- Một mẫu thiết kế để xử lý lỗi hệ thống, ngăn các yêu cầu lặp lại đến một dịch vụ đang gặp sự cố.

# Reverse DNS Lookup
- Tra cứu tên miền từ địa chỉ IP. Thường được dùng trong log và xác thực.

# ETag (Entity Tag)
- Mã nhận dạng phiên bản tài nguyên trên server, giúp client xác định tài nguyên đã thay đổi hay chưa.
- Dùng để tối ưu cache HTTP.

# Static Assets
- Các tệp không thay đổi thường xuyên, như hình ảnh, CSS, JavaScript, được phục vụ trực tiếp từ server hoặc CDN.

# Backend as a Service (BaaS)
- Các dịch vụ cung cấp tính năng backend sẵn có, như Firebase, AWS Amplify.
- Dành cho những dự án muốn tiết kiệm thời gian xây dựng backend.

# Gzip Compression
- Nén dữ liệu phản hồi (response) để giảm kích thước và tăng tốc độ truyền tải.

# Rate Queue
- Một cơ chế quản lý số lượng yêu cầu được xử lý đồng thời, thường sử dụng để giới hạn tải.

# RPC (Remote Procedure Call)
- Gọi hàm từ xa (trên một server khác) như thể nó đang chạy cục bộ.
- Ví dụ: gRPC, XML-RPC.

# Templating Engine
- Công cụ để tạo giao diện động trên server.
- Ví dụ: EJS, Handlebars, Pug.

# Web Crawler/Spider
- Chương trình tự động duyệt web để thu thập dữ liệu.
- Backend thường xây dựng API để bảo vệ khỏi bot hoặc crawler.

# Multi-tenancy
- Một kiến trúc nơi nhiều khách hàng (tenant) dùng chung một hệ thống mà vẫn giữ dữ liệu tách biệt.

# CQRS (Command Query Responsibility Segregation)
- Tách các thao tác đọc (query) và ghi (command) dữ liệu thành hai mô hình độc lập để tăng hiệu suất.

# Idempotency
- Tính chất đảm bảo rằng một yêu cầu được thực hiện nhiều lần vẫn cho cùng một kết quả.
- Thường áp dụng trong các API HTTP PUT, DELETE.

# Webhook vs Polling
- Webhook: Server chủ động gửi dữ liệu đến client khi có sự kiện.
- Polling: Client tự động gửi yêu cầu để kiểm tra trạng thái định kỳ.

# Binary Data
- Dữ liệu được lưu trữ ở dạng nhị phân (binary), như file hình ảnh hoặc video.

# Token-Based Authentication
- Cách xác thực bằng việc phát hành token cho người dùng (thường là JWT hoặc OAuth).

# Server Sent Events (SSE)
- Gửi dữ liệu từ server đến client qua HTTP, khác với WebSocket ở chỗ nó chỉ truyền một chiều.

# Headless Server
- Server không có giao diện người dùng, chỉ xử lý logic và API.

# CDN (Content Delivery Network)
- Mạng lưới máy chủ phân phối nội dung để giảm độ trễ và tải trên server chính.

# Sticky Session
- Một cơ chế đảm bảo người dùng luôn kết nối đến cùng một server trong suốt phiên làm việc.

# TLS/SSL
- Giao thức mã hóa dữ liệu truyền qua mạng, bảo vệ thông tin nhạy cảm.

# Event Loop
- Cơ chế xử lý tác vụ bất đồng bộ trong Node.js.

# Event-Driven Architecture
- Mô hình xử lý các sự kiện (event) thay vì luồng logic tuần tự, ví dụ: Kafka, RabbitMQ.

# Shadow API
- Các API không được tài liệu hóa hoặc không có ý định sử dụng công khai.

# Soft Delete vs Hard Delete
- Soft Delete: Dữ liệu chỉ được đánh dấu là "đã xóa" nhưng vẫn tồn tại trong database.
- Hard Delete: Dữ liệu bị xóa hoàn toàn.

# Dependency Tree
- Sơ đồ biểu diễn các phụ thuộc của một module hoặc ứng dụng.

# API (Application Programming Interface)
- Giao diện để các ứng dụng giao tiếp với nhau.
- Trong backend, thường được sử dụng để cung cấp dữ liệu hoặc thực hiện các chức năng qua HTTP (REST API hoặc GraphQL).

# RESTful API
- Kiến trúc API dựa trên các phương thức HTTP như GET, POST, PUT, DELETE.
- Mỗi endpoint đại diện cho một tài nguyên (resource), ví dụ: /users để quản lý người dùng.

# Middleware
- Là các hàm trung gian xử lý logic trước khi yêu cầu (request) đến controller hoặc phản hồi (response) trả về.
Ví dụ: Xác thực người dùng, log yêu cầu.

# Authentication và Authorization
- Authentication (Xác thực): Kiểm tra danh tính người dùng (như đăng nhập qua username/password).
- Authorization (Phân quyền): Xác định quyền của người dùng đối với tài nguyên hoặc hành động.

# Session và Cookie
- Session: Lưu thông tin tạm thời của người dùng trên server (ví dụ: thông tin đăng nhập).
- Cookie: Lưu trữ dữ liệu nhỏ trên trình duyệt để gửi lại server trong các yêu cầu tiếp theo.

# ORM (Object Relational Mapping)
- Công cụ giúp làm việc với cơ sở dữ liệu (database) một cách dễ dàng bằng cách ánh xạ bảng (table) thành đối tượng (object) trong ngôn ngữ lập trình.
- Ví dụ: Sequelize (Node.js), Hibernate (Java).

# Database
- Hệ thống lưu trữ dữ liệu.
- SQL Database: Dựa trên bảng (ví dụ: MySQL, PostgreSQL).
- NoSQL Database: Không có cấu trúc bảng cố định (ví dụ: MongoDB, Redis).

# Web Server
- Chương trình nhận yêu cầu từ client và trả về phản hồi (ví dụ: Nginx, Apache).
- Backend thường chạy trên web server để xử lý logic.

# Load Balancer
- Phân phối lưu lượng truy cập (traffic) đến nhiều server để giảm tải và tăng hiệu suất.

# Caching
- Lưu trữ dữ liệu tạm thời để giảm tải truy vấn đến cơ sở dữ liệu hoặc API.
- Công cụ phổ biến: Redis, Memcached.

# Microservices
- Kiến trúc chia ứng dụng thành nhiều dịch vụ nhỏ, độc lập, mỗi dịch vụ thực hiện một chức năng cụ thể.

# WebSocket
- Giao thức liên lạc hai chiều giữa client và server, dùng cho các ứng dụng real-time (chat, livestream).

# Containerization
- Gói ứng dụng và tất cả các thành phần phụ thuộc vào một môi trường độc lập (container).
- Ví dụ: Docker.

# Message Queue
- Hệ thống hàng đợi để xử lý các nhiệm vụ không đồng bộ.
- Ví dụ: RabbitMQ, Kafka.

# Rate Limiting
- Giới hạn số lượng yêu cầu (requests) mà một client có thể gửi trong một khoảng thời gian.

# Middleware Frameworks
- Các framework hỗ trợ xây dựng backend dựa trên middleware.
- Ví dụ: Express.js (Node.js), Koa.js (Node.js).

# Serverless
- Mô hình triển khai mà không cần quản lý server, ứng dụng chỉ chạy khi có yêu cầu.
- Ví dụ: AWS Lambda, Google Cloud Functions.

# CI/CD (Continuous Integration/Continuous Deployment)
- CI: Tích hợp liên tục - kiểm tra và tích hợp mã nguồn vào nhánh chính.
- CD: Triển khai liên tục - tự động đưa mã nguồn lên môi trường sản xuất.

# Reverse Proxy
- Lớp trung gian giữa client và server, giúp phân phối yêu cầu, caching, hoặc bảo mật.
- Ví dụ: Nginx làm reverse proxy.

# Logging
- Quá trình ghi lại các sự kiện hoặc lỗi xảy ra trong ứng dụng.
- Ví dụ: Sử dụng Winston, Bunyan (Node.js).

# Cron Job
Công việc tự động chạy định kỳ, thường dùng để thực hiện các tác vụ nền như sao lưu dữ liệu.

# Webhook
Một cơ chế cho phép ứng dụng nhận thông báo từ một dịch vụ khác khi có sự kiện xảy ra.

# Middleware Stack
- Tập hợp các middleware chạy tuần tự khi xử lý một request.

# Scaling
- Vertical Scaling: Nâng cấp tài nguyên (CPU, RAM) của server.
- Horizontal Scaling: Thêm nhiều server để xử lý tải.

# JWT (JSON Web Token)
- Một chuẩn mở để truyền tải dữ liệu an toàn giữa các bên dưới dạng token.

# GraphQL
- Một ngôn ngữ truy vấn API cho phép client yêu cầu chính xác dữ liệu mà họ cần, không hơn không kém.

# Middleware Exception Handling
- Xử lý lỗi phát sinh trong pipeline của middleware.

# Throttling
- Kiểm soát số lượng yêu cầu được phép xử lý trong một thời gian nhất định để bảo vệ tài nguyên.

# Incremental Static Regeneration (ISR)
- là một tính năng mạnh mẽ của Next.js cho phép bạn kết hợp những lợi ích của Static Site Generation (SSG) và Server-Side Rendering (SSR) để tối ưu hóa hiệu suất và trải nghiệm người dùng.
- Cho phép bạn tái tạo một số trang tĩnh cụ thể (incrementally regenerate) sau khi chúng đã được deploy mà không cần phải rebuild toàn bộ ứng dụng.
- ISR được kích hoạt bằng cách sử dụng hàm getStaticProps trong Next.js với tham số revalidate

# Server-Side Rendering (SSR)

# Static Site Generation (SSG)

# batteries included

# Edge Rendering

# stream collision (xung đột luồng)
- Đây là tình huống khi nhiều nguồn (clients) cùng gửi dữ liệu đến một key hoặc link RTMP duy nhất.
- Server có thể ghi đè dữ liệu từ một luồng bởi luồng khác. Hoặc server từ chối các kết nối sau vì luồng đã được "khóa" bởi client đầu tiên.

# Stream Key Overlap (Trùng khóa stream)
- Khi nhiều client sử dụng cùng một stream key, hệ thống không thể phân biệt được các luồng khác nhau, dẫn đến việc một luồng ghi đè hoặc làm gián đoạn luồng khác.