- # Tạo SDP (Session Description Protocol)
- createOffer():	Tạo SDP Offer (khởi tạo kết nối).
- createAnswer():	Tạo SDP Answer để phản hồi lại Offer.
- setLocalDescription(sdp):	Đặt SDP của chính peer.
- setRemoteDescription(sdp):	Đặt SDP của peer đối tác.
- getLocalDescription():	Lấy SDP của chính peer.
- getRemoteDescription():	Lấy SDP của peer đối tác.

# ICE (Interactive Connectivity Establishment)
- addIceCandidate(candidate):	Thêm ICE candidate từ đối tác.
- getConfiguration():	Lấy cấu hình hiện tại của RTCPeerConnection.
- setConfiguration(config):	Cập nhật cấu hình của RTCPeerConnection.
- getStats():	Lấy thông tin thống kê về kết nối.

# Quản lý track (Audio/Video)
- addTrack(track, stream):	Thêm track (audio/video) vào kết nối.
- removeTrack(sender):	Xóa track khỏi kết nối.
- getSenders():	Lấy danh sách RTCRtpSender đang gửi dữ liệu.
- getReceivers():	Lấy danh sách RTCRtpReceiver đang nhận dữ liệu.
- getTransceivers():	Lấy danh sách RTCRtpTransceiver.

# Quản lý kênh dữ liệu (Data Channel)
- createDataChannel(label, options)	Tạo data channel để gửi dữ liệu text/binary.
- ondatachannel	Xử lý sự kiện khi nhận được data channel từ peer.

# Quản lý media
- restartIce()	Khởi động lại ICE Candidate.
close()	Đóng kết nối WebRTC.

# Các sự kiện (events) của RTCPeerConnection
- onicecandidate	Khi có ICE Candidate mới được tìm thấy.
- ontrack	Khi nhận được track từ remote peer.
- ondatachannel	Khi nhận được RTCDataChannel.
- onnegotiationneeded	Khi cần đàm phán lại kết nối (ví dụ: thêm track mới).
- oniceconnectionstatechange	Khi trạng thái ICE connection thay đổi.
- onconnectionstatechange	Khi trạng thái tổng thể của RTCPeerConnection thay đổi.
- onsignalingstatechange	Khi trạng thái signaling (Offer/Answer) thay đổi.
- onicegatheringstatechange	Khi trạng thái ICE gathering thay đổi.
