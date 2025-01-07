# NodeJS là gì?
- Node.js là một nền tảng runtime JavaScript mã nguồn mở, đa nền tảng, được xây dựng trên công cụ V8 JavaScript của Google Chrome.
- được phát triển năm 2009 bởi Ryan Dahl.
- Nó cho phép bạn chạy mã JavaScript trên máy chủ (server-side).
- Node.js được sử dụng để xây dựng các ứng dụng mạng có hiệu năng cao, như máy chủ web, ứng dụng thời gian thực, dịch vụ API, và nhiều hơn nữa.
- Node.js tận dụng kiến trúc hướng sự kiện (event-driven), mô hình non-blocking I/O để tạo ra các ứng dụng nhẹ và hiệu quả.
- Node.js sử dụng mô hình xử lý sự kiện (event-driven) và cơ chế gọi lại (callback), giúp xử lý nhiều yêu cầu đồng thời mà không cần đợi từng yêu cầu hoàn thành.
- Chạy trên một luồng đơn (single-threaded): Mặc dù chỉ sử dụng một luồng chính, Node.js có thể xử lý nhiều kết nối cùng lúc nhờ vào việc không đồng bộ.
- Chạy được đa luồng với Service Worker.
- Node.js rất phổ biến trong việc xây dựng các ứng dụng microservices, các API RESTful, và ứng dụng thời gian thực (như chat, livestream) nhờ khả năng mở rộng tốt và tích hợp mạnh mẽ với nhiều công nghệ khác.


# Nêu ​​các kiểu dữ liệu trong Node.js
Giống như JavaScript, Node.js có những kiểu dữ liệu sau: 

1. Kiểu dữ liệu nguyên thủy (Primitive Data Types):
Đây là các kiểu dữ liệu cơ bản và không thể bị thay đổi giá trị sau khi đã được gán.
- String: biểu diễn chữ, văn bản, đoạn văn bản
- Number: các số bất kỳ
- Bigint: biểu diễn số nguyên lớn
- Boolean: true/false
- Undefined: Biến được khai báo nhưng chưa gán giá trị nào.
- Null: Đại diện cho giá trị rỗng hoặc không có giá trị.
- Symbol: tạo ra các giá trị duy nhất (unique value) và bất biến (immutable)

2. Kiểu dữ liệu tham chiếu (Reference Data Types)
Những kiểu dữ liệu này không lưu trữ trực tiếp giá trị mà lưu trữ tham chiếu tới giá trị.
- Object: Một tập hợp của các cặp key-value. Đây là kiểu dữ liệu rất linh hoạt, đại diện cho hầu hết mọi thứ trong JavaScript.
- Array: Một danh sách có thứ tự chứa các giá trị. Các phần tử trong mảng có thể là bất kỳ kiểu dữ liệu nào.
- Function: Hàm là một đối tượng đặc biệt có thể thực thi, được định nghĩa với từ khóa function hoặc biểu thức hàm.
- Date: Một đối tượng đặc biệt để làm việc với ngày và giờ.
- RegExp: Đối tượng biểu thức chính quy dùng để làm việc với chuỗi (string).
- Buffer (Đặc trưng trong Node.js): Đối tượng Buffer trong Node.js đại diện cho một dãy các byte (dữ liệu nhị phân). Điều này đặc biệt hữu ích khi làm việc với các thao tác tệp tin, stream hay mạng.
- TypedArray (Int8Array, Uint8Array, Float32Array, v.v.): Các kiểu dữ liệu mảng này được sử dụng để thao tác với dữ liệu nhị phân, chẳng hạn như khi làm việc với WebAssembly hoặc buffer dữ liệu nhị phân.

# Các tính năng chính của Node.js là gì?
Hiện nay, Node.js đã và đang trở thành lựa chọn hàng đầu của nhiều kỹ sư phần mềm cũng như lập trình viên. Một vài tính năng nổi bật của Node.js phải đề cập đến là: 

- Lập trình hướng sự kiện và không đồng bộ: Tất cả các API đều không đồng bộ. Tính năng lập trình hướng sự kiện và không đồng bộ có nghĩa là nếu Node nhận được yêu cầu nào đó, nó sẽ thực hiện ở chế độ nền và tiếp tục xử lý những yêu cầu khác. Chính bởi vậy nên Node sẽ không phải chờ đợi phản hồi từ các yêu cầu trước.
- Thực thi mã cực kỳ nhanh chóng: Node.js sử dụng công cụ V8 JavaScript Runtime. Chính điều này giúp cho quá trình thực thi mã trở nên cực kỳ nhanh chóng, việc tiếp nhận cũng như xử lý các yêu cầu cũng nhanh hơn rất nhiều.
- Một luồng nhưng có khả năng mở rộng cao: Dù sử dụng mô hình luồng đơn để lặp lại sự kiện nhưng khả năng mở rộng của Nodejs cực kỳ ấn tượng, phản hồi về sự kiện sẽ nhanh chóng được gửi đến máy chủ. Trong khi các loại máy chủ truyền thống sẽ tạo ra luồng giới hạn để xử lý các yêu cầu thì Nodejs chỉ tạo một luồng đơn duy nhất.
- Không có buffer: Phần lớn các ứng dụng Node.js không có vùng nhớ tạm hay còn gọi là buffer cho bất kỳ loại dữ liệu nào. Các dữ liệu sẽ được xuất theo khối, ứng dụng Node.js không đệm bất kỳ dữ liệu nào.
- License: Node.js được phát hành theo giấy phép MIT

# Tại sao nên sử dụng Expressjs?
ExpressJS là một framework NodeJS, khi đi phỏng vấn NodeJS bạn sẽ thường được nhà tuyển dụng đặt các câu hỏi liên quan đến ExpressJS. Thông thường, ExpressJS được sử dụng để xây dựng và thiết kế web, mục đích chính là tạo ra những ứng dụng web thông minh hơn. Framework này sẽ mang đến sự đơn giản và linh hoạt. 

Expressjs là khuôn khổ của Node.js nên các mã code đã được viết sẵn. Expressjs sẽ hỗ trợ các lập trình viên có thể nhanh chóng tạo ra ứng dụng web (1 ứng dụng web hoặc nhiều ứng dụng web). Ưu điểm của Expressjs chính là dung lượng nhẹ nên giúp cho quá trình tổ chức các ứng dụng web theo kiến trúc MVC trở nên đơn giản hơn. Nếu như không có Expressjs, lập trình viên sẽ phải thực hiện rất nhiều thao tác phức tạp hơn để có thể xây dựng một API hiệu quả. 

# NodeJs đơn luồng hay đa luồng?
Đây là câu hỏi phỏng vấn Nodejs cực kỳ hay gặp, rất nhiều nhà tuyển dụng đã lựa chọn câu hỏi này để đánh giá xem ứng viên có hiểu cách vận hành của Nodejs hay không. Khi trả lời câu hỏi này bạn cần hết sức chú ý, dù chọn đơn luồng hay đa luồng thì bạn đều phải đưa ra được lý do thỏa đáng cho lựa chọn đó. 

Nodejs đơn luồng thể hiện ở việc nó chỉ có một tác vụ Javascript được xử lý tại một thời điểm nhất định.

Nodejs đa luồng thể hiện ở việc nó cung cấp API cluster và child_process để tạo các quy trình con. Trên phiên bản 13 của Node.js có mô-đun “worker thread” để triển khai đa luồng.

# Vòng lặp sự kiện trong Node.js là gì?
Vòng lặp sự kiện trong Node.js hay còn gọi là Event Loop cho phép Nodejs thực hiện nhiều thao tác cùng một lúc, Nodejs có thể một lúc xử lý cả ngàn request dù chỉ dùng một thread duy nhất. Vòng lặp sự kiện trong Node.js cho phép Node.js thực hiện những hoạt động I/O không chặn. Về bản chất thì Node.js là một ứng dụng đơn luồng, nhưng Node.js có thể hỗ trợ xử lý đồng thời thông qua định nghĩa về event và callbacks. Mọi API của Node.js là không đồng bộ và là một luồng, chúng sử dụng async function calls để duy trì đồng thời.

# REPL Terminal trong Node.js là gì?
REPL Terminal là viết tắt của Read Eval Print Loop (READ, EVAL, PRINT, LOOP), nó thể hiện một môi trường máy tính tương tự như màn hình console của Shell (Unix / Linux). REPL đặc biệt hữu ích khi bạn muốn viết hoặc gỡ lỗi của các mãi. Cụ thể vai trò cũng như tầm quan trọng của REPL thể hiện qua: 

READ (đọc): Đọc thông tin đầu vào và phân tích chúng thành cấu trúc dữ liệu JavaScript, sau đó lưu vào bộ nhớ
EVAL (Đánh giá): Tiến hành đánh giá toàn bộ cấu trúc dữ liệu
PRINT (In): In kết quả sau khi được đánh giá
LOOP (Vòng lặp): Lặp các dòng lệnh, nếu muốn thoát hãy gõ ctrl+C hai lần

# EventEmitter trong nodejs là gì?
Người dùng có thể dễ dàng tạo hoặc xử lý các sự kiện thông qua việc sử dụng module event. Thông thường Module event sẽ bao gồm lớp EventEmitter. Tất cả các đối tượng phát ra event đều là thành viên của lớp EventEmitter. Khi EventEmitter phát ra một sự kiện, tất cả các hàm gắn liền với sự kiện được gọi đồng bộ. Tất cả các giá trị được trả về bởi các trình nghe được gọi sẽ bị bỏ qua và bị loại bỏ.

# Sự khác nhau giữa ​​Events và Callbacks là gì?
Khi tiếp cận với Node.js, bạn hẳn sẽ không xa lạ với hai khái niệm event và Callbacks. Đâu là sự khác biệt giữa event và Callbacks? Đầu tiên, bạn cần hiểu rõ về hai khái niệm này. 

Callback là hàm gọi lại, đây là hàm được truyền vào hàm khác dưới dạng đối số. Thông thường, hàm này sẽ được thực thi sau khi một hàm khác đã được thực thi xong, chính vậy nên nó được đặt tên là hàm gọi lại. 

Event: Mỗi một hành động đều là một sự kiện, Node.js cho phép tạo và tiến hành xử lý các sự kiện bằng cách sử dụng các mô-đun sự kiện. 

Hàm Callback được gọi khi một hàm không đồng bộ được thực thi và trả về kết quả khi có event xảy ra. Khi event được kích hoạt, các hàm lắng nghe sẽ được thực thi. 

# RESTful Web Service trong Node là gì?
REST (REpresentational State Transfer) là kiến ​​trúc dựa trên tiêu chuẩn web và sử dụng Giao thức HTTP. Máy chủ REST chỉ đơn giản là cung cấp quyền truy cập vào tài nguyên và máy khách REST truy cập và sửa đổi tài nguyên bằng giao thức HTTP.

Phương thức HTTP

GET- Cung cấp quyền truy cập chỉ đọc vào một tài nguyên.
PUT- Cập nhật tài nguyên hiện có hoặc tạo tài nguyên mới.
DELETE- Loại bỏ một tài nguyên.
POST- Tạo ra một nguồn tài nguyên mới.
PATCH- Cập nhật / sửa đổi tài nguyên
Nguyên tắc của REST

Giao diện thống nhất
Không quốc tịch
Có thể lưu vào bộ nhớ đệm
Máy khách-Máy chủ
Hệ thống phân lớp
Mã theo yêu cầu (tùy chọn)