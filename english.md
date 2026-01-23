east: 

It’s going well so far.
Mọi việc đến giờ vẫn diễn ra tốt.

heading out now: đang chuẩn bị ra ngoài

keep you posted: sẽ cập nhật thông tin cho bạn

There’s a minor issue in production

I intend to: Tôi dự định làm gì đó

I've just: Tôi vừa mới làm gì đó
I've already: Tôi đã làm gì đó rồi
I've never: Tôi chưa từng làm gì đó
I haven't ... yet: Tôi vẫn chưa làm gì đó

- walk me through
Hãy giải thích chi tiết cho tôi.

- Idempotent:
Gọi nhiều lần dữ liệu vẫn không thay đổi.
Gửi cùng một request nhiều lần thì kết quả trên server vẫn như nhau.

- technical debt: nợ kỹ thuật
Technical debt = làm nhanh cho xong bây giờ, nhưng sẽ tốn nhiều công sức hơn để sửa sau này

- Race condition: tranh chấp tài nguyên do chạy song song
Lỗi xảy ra khi nhiều tiến trình / luồng / request cùng truy cập và thay đổi một tài nguyên chung, và kết quả phụ thuộc vào thứ tự thực thi.

- enforce constraint: thực thi ràng buộc

- Crash recovery: Khôi phục sau sự cố

- Multi-Version Concurrency Control (MVCC):
Cơ chế quản lý đồng thời bằng cách giữ nhiều phiên bản dữ liệu, giúp các transaction đọc và ghi không chặn nhau.

- Dirty read
Khi một transaction đọc dữ liệu chưa được commit của transaction khác.

- Fragmented disk
Tình trạng dữ liệu trên ổ đĩa bị chia nhỏ và lưu rải rác ở nhiều vị trí khác nhau thay vì liên tục.

- trade-off: sự đánh đổi

- trace: dấu vết

Stateless vs Stateful

Eventual Consistency

saga + retry + compensation

Zero Trust

Token leakage handling

Audit log

Backpressure

Throttling

Queue overload

Graceful degradation

cache miss spike

observability

QPS