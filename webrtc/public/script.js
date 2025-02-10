const socket = io();
const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startCallButton = document.getElementById("startCall");

// Nhận video từ camera
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    })
    .catch(error => console.error('Error accessing media devices.', error));

// Khi nhận track video từ peer
peerConnection.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
};

// Gửi ICE Candidate
peerConnection.onicecandidate = event => {
    if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
    }
};

// Click "Start Call" -> Gửi SDP Offer
startCallButton.onclick = async () => {
    createOffer();
};

socket.on("offer", async (offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer", answer);
});

socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on("ice-candidate", async (candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});


async function createOffer() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
}

// Tự động gọi khi có kết nối
// setTimeout(createOffer, 1000);
