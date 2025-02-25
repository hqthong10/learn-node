const socket = io();

const stunServers = [
    'stun:stun.l.google.com:19302',
    'stun:stun1.l.google.com:19302',
    'stun:stun.cloudflare.com:3478',
  ];

const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: stunServers }]
});
// peerConnection.createDataChannel(''); // Create a dummy data channel

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startCallButton = document.getElementById("startCall");

const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');
canvasCtx.fillStyle = 'rgb(255, 255, 255)';
canvasCtx.strokeStyle = 'rgb(0, 123, 255)';

let audioContext;
let analyzer;
let microphone;
let micId;

const audioInputDevices = [];
let session = {}

async function main() {
    session = WebRTC.Media;
    await enumerateDevices();
}
main();

async function testMic() {
    if (audioContext) {
        audioContext.close();
    }
    audioContext = new AudioContext();
    analyzer = audioContext.createAnalyser();
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            deviceId: micId ? {
                exact: micId
            } : undefined
        }
    });
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyzer);
    analyzer.fftSize = 256;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const draw = () => {
        requestAnimationFrame(draw);
        analyzer.getByteFrequencyData(dataArray);
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.beginPath();
        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = canvas.height - v * canvas.height / 2;
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    };
    draw();
}

// Nhận video từ camera
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        console.log('stream', stream)
        // localVideo.srcObject = stream;
        // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    })
    .catch(error => console.error('Error accessing media devices.', error));

// Khi nhận track video từ peer
peerConnection.ontrack = event => {
    // remoteVideo.srcObject = event.streams[0];
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
