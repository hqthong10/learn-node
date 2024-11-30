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
- 