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

# CMAF (Common Media Application Format)
CMAF là một định dạng tệp chuẩn hóa được phát triển bởi Apple và Microsoft để hợp nhất HLS và DASH. Nó giúp giảm chi phí lưu trữ và băng thông khi phát video trực tuyến bằng cách sử dụng một tệp video duy nhất cho cả hai giao thức.

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

# SFU (Selective Forwarding Unit)
- SFU là một kiến trúc máy chủ trung gian trong WebRTC giúp tối ưu việc truyền tải dữ liệu video & audio trong các cuộc họp trực tuyến, livestream, hoặc hội nghị nhiều người.

# MCU (Multipoint Control Unit)
- MCU là một thành phần quan trọng trong hệ thống hội nghị truyền hình (video conferencing), cho phép nhiều thiết bị (clients) kết nối và trao đổi video, âm thanh cùng lúc.
- Nó hoạt động như một trung tâm điều phối, giúp giảm tải xử lý trên mỗi client bằng cách nhận luồng từ tất cả các thiết bị, xử lý (trộn hoặc định tuyến) rồi gửi lại cho từng client theo nhu cầu.


# P2P (Peer To Peer)

# SD-RTN™ (Software Defined Real-Time Network) Một mạng lưới máy chủ phân tán toàn cầu.

# Adaptive Bitrate (ABR) – Tự động điều chỉnh chất lượng video/audio theo tốc độ mạng.

# FEC (Forward Error Correction) – Giúp giảm mất gói tin khi mạng yếu.

# UDP (User Datagram Protocol) – Tối ưu độ trễ so với TCP.

# AI Noise Suppression – Lọc tiếng ồn bằng AI khi call hoặc livestream.

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

# libuv
- libuv là một thư viện đa nền tảng, mã nguồn mở, triển khai mô hình I/O không chặn (non-blocking I/O) theo hướng sự kiện (event-driven) [1, 2]. Nó là thành phần cốt lõi cung cấp nền tảng cho Node.js, cho phép Node.js đạt được hiệu suất cao trong các ứng dụng mạng và I/O chuyên sâu [1, 3].
- Các đặc điểm và chức năng chính của libuv bao gồm:
    + Mô hình hoạt động không đồng bộ (Asynchronous): libuv sử dụng các cơ chế I/O hiệu quả nhất của hệ điều hành (ví dụ: epoll trên Linux, kqueue trên BSD/macOS, và IO Completion Ports (IOCP) trên Windows) để xử lý hàng nghìn kết nối đồng thời một cách hiệu quả mà không cần tạo ra nhiều luồng (thread) cho mỗi kết nối [1, 3, 4].
    + Vòng lặp sự kiện (Event Loop): Đây là trái tim của libuv, quản lý và điều phối tất cả các sự kiện (kết nối mạng, hoạt động file system, timers) [1, 3].
    + Đa nền tảng: Nó được thiết kế để hoạt động thống nhất trên các hệ điều hành khác nhau, giúp các nhà phát triển viết mã nguồn một lần và chạy được ở mọi nơi [1, 2].
    + Hỗ trợ các tác vụ chặn (Blocking tasks): Đối với các tác vụ có tính chất chặn (như đọc/ghi file lớn) mà không thể xử lý hoàn toàn không đồng bộ trên một số nền tảng, libuv sử dụng một pool các luồng phụ (thread pool) để thực thi chúng mà không làm tắc nghẽn vòng lặp sự kiện chính [1, 3, 4].

# Blocking I/O (Chặn Đầu vào/Đầu ra)
- Xảy ra khi một chương trình yêu cầu thực hiện một thao tác đầu vào hoặc đầu ra (Input/Output - I/O), ví dụ như đọc một file từ đĩa cứng, gửi hoặc nhận dữ liệu qua mạng, hoặc chờ phản hồi từ cơ sở dữ liệu.

# Blocking CPU (Chặn CPU / CPU Bound)
- Xảy ra khi một chương trình thực hiện một khối lượng công việc tính toán khổng lồ, phức tạp, đòi hỏi toàn bộ sức mạnh xử lý của một hoặc nhiều nhân CPU trong một khoảng thời gian đáng kể.

# CPU-bound
- CPU-bound, hay còn gọi là "ràng buộc bởi CPU", là một thuật ngữ trong công nghệ thông tin dùng để mô tả tình huống mà hiệu suất của một chương trình hoặc hệ thống bị giới hạn chủ yếu bởi tốc độ và khả năng xử lý của Bộ xử lý trung tâm (CPU).

# DoS (Denial of Service)
- Tấn công từ chối dịch vụ (DoS) là một nỗ lực của kẻ tấn công nhằm làm cho một dịch vụ trực tuyến không khả dụng bằng cách làm gián đoạn tạm thời hoặc vô thời hạn các dịch vụ của một máy chủ lưu trữ được kết nối với Internet.

# Risk DoS (Risk of Denial of Service): Nguy cơ bị từ chối dịch vụ bị từ chối dịch vụ
- Đây là một thuật ngữ dùng để chỉ khả năng hoặc rủi ro mà một hệ thống, dịch vụ mạng, hoặc ứng dụng web có thể bị tấn công làm tê liệt, khiến người dùng hợp pháp không thể truy cập hoặc sử dụng được dịch vụ đó.

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
- MyISAM là một trong những storage engine phổ biến của MySQL
- Hiệu suất cao cho đọc dữ liệu
- Chiếm ít RAM hơn so với InnoDB.
- Không hỗ trợ transaction
- Chỉ hỗ trợ table-level locking
- Không hỗ trợ khóa ngoại
- Hỗ trợ nén bảng để tiết kiệm dung lượng
- Hỗ trợ FULLTEXT index

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

# Edge Computing

# stream collision (xung đột luồng)
- Đây là tình huống khi nhiều nguồn (clients) cùng gửi dữ liệu đến một key hoặc link RTMP duy nhất.
- Server có thể ghi đè dữ liệu từ một luồng bởi luồng khác. Hoặc server từ chối các kết nối sau vì luồng đã được "khóa" bởi client đầu tiên.

# Stream Key Overlap (Trùng khóa stream)
- Khi nhiều client sử dụng cùng một stream key, hệ thống không thể phân biệt được các luồng khác nhau, dẫn đến việc một luồng ghi đè hoặc làm gián đoạn luồng khác.

# SWC (Speedy Web Compiler)
- là một công cụ biên dịch (compiler) và minifier mã nguồn JavaScript/TypeScript được viết bằng Rust. Nó được thiết kế để thay thế các công cụ như Babel và Terser, với mục tiêu chính là tốc độ và hiệu suất.
- SWC biên dịch mã nguồn JavaScript/TypeScript (bao gồm cả JSX/TSX) thành mã JavaScript tương thích với các trình duyệt cũ.
- Tốc độ biên dịch của SWC nhanh hơn nhiều so với Babel, giúp giảm thời gian phát triển (development) và build.
- SWC hỗ trợ các tính năng mới nhất của JavaScript/TypeScript, bao gồm ES modules, async/await, optional chaining, v.v.
- Nó cũng hỗ trợ JSX/TSX, giúp biên dịch mã React một cách hiệu quả.
- SWC có thể minify mã JavaScript, giúp giảm kích thước file và tối ưu hiệu suất.
- SWC có thể tích hợp với các công cụ build như Vite, Webpack, hoặc thậm chí được sử dụng trực tiếp thông qua CLI.

# Garbage Collector (GC): Bộ thu gom rác
- Thay vì lập trình viên phải tự tay giải phóng bộ nhớ (dễ gây lỗi "rò rỉ bộ nhớ" - memory leak), GC sẽ tự động:
    + Phát hiện: Tìm những đối tượng (objects) trong bộ nhớ RAM không còn được chương trình sử dụng nữa.
    + Thu hồi: Giải phóng không gian đó để dành chỗ cho các dữ liệu mới.
    + Nén (Compaction): Sắp xếp lại bộ nhớ để tránh tình trạng phân mảnh.
- Mark-and-Sweep (Đánh dấu và Quét): Thuật toán cơ bản nhất, đánh dấu các đối tượng còn dùng và xóa những thứ còn lại.
- Generational GC (Thu gom theo thế hệ): Chia bộ nhớ thành "thế hệ trẻ" (đối tượng mới tạo) và "thế hệ già" (đối tượng tồn tại lâu). Các GC hiện đại như trong Java 25 tập trung dọn dẹp thế hệ trẻ vì chúng thường "chết" nhanh hơn, giúp tăng tốc độ xử lý.
- Reference Counting (Đếm tham chiếu): Thường dùng trong Python hoặc Swift, tự động xóa đối tượng khi không còn biến nào trỏ đến nó.

- Node.js sử dụng mô hình Generational Garbage Collection (Thu gom rác theo thế hệ), chia bộ nhớ heap thành hai vùng chính:
    + New Space (Young Generation): Nơi chứa các đối tượng mới tạo. Vùng này nhỏ và được dọn dẹp rất thường xuyên bằng thuật toán Scavenge để thu hồi bộ nhớ nhanh chóng.
    + Old Space (Old Generation): Nếu một đối tượng sống sót qua vài chu kỳ dọn dẹp ở New Space, nó sẽ được chuyển sang Old Space. Vùng này lớn hơn và được dọn dẹp bằng thuật toán Mark-Sweep & Mark-Compact.

# Puppeteer
- Puppeteer là một thư viện Node.js mã nguồn mở do nhóm phát triển Chrome DevTools của Google tạo ra, cung cấp một API cấp cao để điều khiển trình duyệt Chrome hoặc Chromium.
- Nó cho phép các nhà phát triển tự động hóa các tác vụ trên trình duyệt web thông qua lập trình.
- Công dụng chính của Puppeteer:
    + Kiểm thử tự động (Automated Testing): Tự động hóa việc gửi biểu mẫu, kiểm tra giao diện người dùng (UI testing), mô phỏng tương tác của người dùng (nhập liệu bàn phím, nhấp chuột, v.v.).
    + Web Scraping (Cào dữ liệu web): Trích xuất dữ liệu từ các trang web một cách hiệu quả, đặc biệt là các ứng dụng web một trang (SPA) có nội dung được tạo động bằng JavaScript.
    + Tạo ảnh chụp màn hình và tệp PDF: Chụp ảnh màn hình của các trang web hoặc tạo tệp PDF từ nội dung trang web.
    + Kết xuất phía máy chủ (Server-Side Rendering - SSR): Tạo nội dung được kết xuất trước cho các SPA để tối ưu hóa hiệu suất và SEO.
    + Ghi lại dấu vết thời gian (Timeline Tracing): Phân tích hiệu suất của trang web bằng cách ghi lại dấu vết thời gian hoạt động của trang.

# XSS
- XSS, hay Cross-Site Scripting (Tấn công kịch bản chéo trang), là một lỗ hổng bảo mật phổ biến cho phép kẻ tấn công chèn các mã độc (thường là JavaScript) vào một trang web hợp pháp mà sau đó được trình duyệt của người dùng khác thực thi [1, 2].
- Có ba loại tấn công XSS chính:
    + XSS Phản ánh (Reflected XSS): Mã độc được gửi đến ứng dụng web qua các tham số URL hoặc form, và được phản hồi lại trình duyệt của người dùng ngay lập tức mà không được làm sạch (sanitize) đúng cách [1, 2].
    + XSS Lưu trữ (Stored XSS/Persistent XSS): Mã độc được lưu trữ vĩnh viễn trên máy chủ của ứng dụng (ví dụ: trong cơ sở dữ liệu, diễn đàn, phần bình luận) và sau đó được phân phối đến tất cả người dùng xem trang đó [1, 2].
    + XSS dựa trên DOM (DOM-based XSS): Lỗ hổng tồn tại hoàn toàn ở phía máy khách (trong mã JavaScript) thay vì ở phía máy chủ. Dữ liệu độc hại được xử lý bởi mã JavaScript phía máy khách theo cách không an toàn [1, 2].
- Mục tiêu chính của cuộc tấn công này là thao túng hành vi của trang web hoặc đánh cắp dữ liệu nhạy cảm từ người dùng, chẳng hạn như:
    + Đánh cắp cookie: Kẻ tấn công có thể lấy cắp cookie phiên (session cookies), cho phép chúng chiếm quyền tài khoản của người dùng mà không cần mật khẩu [1, 2].
    + Chiếm quyền điều khiển phiên: Kẻ tấn công có thể thực hiện các hành động thay mặt người dùng trên trang web [1].
    + Chuyển hướng độc hại: Người dùng có thể bị chuyển hướng đến các trang web lừa đảo (phishing) hoặc trang web chứa mã độc khác [2].
    + Thay đổi nội dung trang: Kẻ tấn công có thể thay đổi nội dung hiển thị trên trang web, gây nhầm lẫn hoặc lừa dối người dùng [1].

# Heap memory
- Heap memory (bộ nhớ Heap) là một vùng bộ nhớ quan trọng trong bộ nhớ máy tính, được sử dụng để lưu trữ dữ liệu có thời gian sống không xác định hoặc thời gian sống dài hơn thời gian tồn tại của hàm hoặc khối mã tạo ra nó.

- Cấp phát động (Dynamic Allocation): Bộ nhớ trong Heap được cấp phát trong thời gian chạy (runtime), không phải trong thời gian biên dịch (compile time).
- Thời gian sống linh hoạt (Flexible Lifespan): Dữ liệu tồn tại trong Heap cho đến khi chương trình không còn sử dụng nó nữa hoặc cho đến khi chương trình kết thúc.
- Quản lý bởi Garbage Collector (ở các ngôn ngữ cấp cao): Trong các ngôn ngữ như JavaScript (Node.js), Java, Python, việc giải phóng bộ nhớ trong Heap được thực hiện tự động bởi một cơ chế gọi là Trình thu gom rác (Garbage Collector - GC). Lập trình viên không cần quản lý thủ công (không giống như C/C++ yêu cầu malloc() và free()).
- Truy cập chậm hơn Stack: Việc truy cập dữ liệu trong Heap thường chậm hơn so với Stack memory (vùng nhớ ngăn xếp) vì dữ liệu không được tổ chức theo thứ tự tuyến tính đơn giản.

# Race condition
- Race condition (tình trạng chạy đua) là một lỗi thiết kế hoặc một điểm yếu trong hệ thống hoặc chương trình máy tính đa luồng (multi-threaded) hoặc đa tiến trình (multi-process).
- Nó xảy ra khi hành vi hoặc kết quả đầu ra của chương trình phụ thuộc vào thứ tự hoặc thời điểm tương đối mà các phần khác nhau của chương trình được thực thi.

# Idempotent
- Gọi nhiều lần dữ liệu vẫn không thay đổi.
- Gửi cùng một request nhiều lần thì kết quả trên server vẫn như nhau.
- Một operation được gọi là idempotent nếu thực hiện nhiều lần vẫn cho ra cùng một kết quả cuối cùng.

# Anti-pattern
Anti-pattern (Phản mẫu) là thuật ngữ dùng để chỉ những giải pháp sai lầm cho một vấn đề.
Mặc dù ban đầu nó có vẻ là một giải pháp tốt hoặc dễ thực hiện, nhưng về lâu dài, Anti-pattern sẽ gây ra nhiều rắc rối như: làm hệ thống chạy chậm, khó bảo trì, dễ phát sinh lỗi và tốn kém chi phí sửa chữa.

# Spaghetti Code
Spaghetti Code: Mã nguồn rối rắm, không có cấu trúc rõ ràng, khiến việc đọc và sửa đổi trở nên cực kỳ khó khăn.

# God Object
God Object: Một lớp (Class) hoặc một tệp tin đảm nhận quá nhiều nhiệm vụ. Nếu "vật thể chúa" này gặp lỗi, toàn bộ hệ thống sẽ sụp đổ.

# Golden Hammer
Golden Hammer (Chiếc búa vàng): Việc lạm dụng một công nghệ hoặc ngôn ngữ quen thuộc cho mọi vấn đề, ngay cả khi nó không phù hợp (ví dụ: cố dùng SQL để lưu trữ dữ liệu không cấu trúc thay vì dùng NoSQL).

# Hard Coding
Hard Coding: Ghi trực tiếp các giá trị (như mật khẩu, IP máy chủ) vào mã nguồn thay vì để trong tệp cấu hình.

# Analysis Paralysis
Analysis Paralysis (Liệt sĩ phân tích): Dành quá nhiều thời gian để phân tích và lập kế hoạch mà không bao giờ bắt tay vào thực hiện, dẫn đến dự án bị đình trệ.

# Death March
Death March (Hành trình chết): Ép buộc nhân viên làm việc quá sức với mục tiêu không tưởng, dẫn đến chất lượng sản phẩm kém và nhân sự nghỉ việc.

# Monolithic Hell
Monolithic Hell: Xây dựng một ứng dụng quá lớn và cồng kềnh, khiến việc cập nhật một tính năng nhỏ cũng mất rất nhiều thời gian để triển khai.

# Microservices Envy
Microservices Envy: Cố gắng chia nhỏ hệ thống thành các Microservices quá mức cần thiết, gây ra sự phức tạp không đáng có trong việc quản lý kết nối giữa các dịch vụ.
