# WebRTC
### Kiến Trúc Cơ Bản
WebRTC có 3 API chính:
- getUserMedia: Lấy video/audio từ camera & microphone.
- RTCPeerConnection: Thiết lập kết nối ngang hàng (P2P).
- RTCDataChannel: Truyền dữ liệu (chat, file, v.v.).

Ghi nhớ: WebRTC cần STUN/TURN server để kết nối qua NAT/firewall.

### Lấy Dữ Liệu Từ Camera & Micro
```
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        document.getElementById('videoElement').srcObject = stream;
    })
    .catch((error) => console.error("Lỗi khi truy cập camera/mic:", error));
```
- getUserMedia() xin quyền truy cập camera & micro.

### Thiết Lập Kết Nối P2P (Peer-to-Peer)
1. Tạo RTCPeerConnection
```
const peer = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});
```
- stun:stun.l.google.com:19302 là STUN server miễn phí giúp xác định địa chỉ IP công khai

2. Thêm luồng video/audio
```
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  stream.getTracks().forEach(track => peer.addTrack(track, stream));
});
```
addTrack() gửi dữ liệu video/audio đến đối phương.

3. Tạo Offer/Answer
- Người gọi
```
peer.createOffer().then(offer => {
  return peer.setLocalDescription(offer);
}).then(() => {
  sendSignal(peer.localDescription); // Gửi offer đến người nhận
});
```

- Người nhận
```
peer.setRemoteDescription(offer); // Nhận offer từ caller
peer.createAnswer().then(answer => {
  return peer.setLocalDescription(answer);
}).then(() => {
  sendSignal(peer.localDescription); // Gửi answer về caller
});
```
Dữ liệu này phải được gửi giữa 2 peer thông qua WebSocket hoặc Signal Server.

4. Xử Lý ICE Candidate
```
peer.onicecandidate = (event) => {
  if (event.candidate) {
    sendSignal(event.candidate); // Gửi ICE candidate
  }
};
```
ICE candidate giúp xác định địa chỉ kết nối mạng nội bộ & internet

### Truyền Dữ Liệu Với RTCDataChannel
```
const dataChannel = peer.createDataChannel("chat");

dataChannel.onmessage = (event) => {
  console.log("Tin nhắn nhận được:", event.data);
};

dataChannel.onopen = () => {
  dataChannel.send("Xin chào từ WebRTC!");
};
```

Dùng RTCDataChannel để gửi tin nhắn, file, dữ liệu mà không cần WebSocket.

### Kết Nối Hai Peer
1. Người gọi tạo offer → gửi qua WebSocket.
2. Người nhận nhận offer, tạo answer → gửi lại.
3. Cả hai gửi ICE Candidate để thiết lập kết nối.
4. Bắt đầu truyền video & dữ liệu.

