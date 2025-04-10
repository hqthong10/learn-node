let localStream;
let clientId = null;
let device = null;

let producerTransport = null;
let videoProducer = null;
let audioProducer = null;

let consumerTransport = null;
let videoConsumers = {};
let audioConsumers = {};

let audioEnabled = true;
let videoEnabled = true;

let socket = null;

const joinButton = document.getElementById('join-button');
const joinScreen = document.getElementById('join-screen');
const controls = document.getElementById('controls');
const participantView = document.getElementById('participant-view');
const cameraButton = document.getElementById('camera-button');
const screenButton = document.getElementById('screen-button');
const muteButton = document.getElementById('mute-button');
const videoButton = document.getElementById('video-button');
const leaveButton = document.getElementById('leave-button');
const pushButton = document.getElementById('push-button');

const loadDevice = async (routerRtpCapabilities) => {
    // MediasoupClient.parseScalabilityMode("L2T3");
    // => { spatialLayers: 2, temporalLayers: 3 }

    // MediasoupClient.parseScalabilityMode("S3T3");
    // => { spatialLayers: 3, temporalLayers: 3 }

    MediasoupClient.parseScalabilityMode("L4T7_KEY_SHIFT");
    // => { spatialLayers: 4, temporalLayers: 7 }

    // MediasoupClient.parseScalabilityMode(undefined);

    try {
        device = new MediasoupClient.Device();
    } catch (error) {
        if (error.name === 'UnsupportedError') {
            console.error('browser not supported');
        }
    }
    console.log("handlerName", device.handlerName);
    await device.load({ routerRtpCapabilities });
}

const addLocalVideoToView = (id, stream) => {
    const videoElement = document.createElement('video');
    videoElement.id = id;
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    participantView.appendChild(videoElement);
};

const sendRequest = (type, data) => {
    return new Promise((resolve, reject) => {
        socket.emit(type, data, (err, response) => {
            if (!err) {
                // Success response, so pass the mediasoup response to the local Room.
                resolve(response);
            } else {
                reject(err);
            }
        });
    });
}

joinButton.addEventListener('click', () => startRoom());

const startRoom = () => {
    const username = document.getElementById('username').value;
    const roomId = document.getElementById('room-id').value;
    const isProvider = document.getElementById('provider').checked;

    if (!(username && roomId)) {
        alert('Please enter your name and room ID');
        return false;
    }
    
    // Connect to the server and join the room
    socket = io("http://localhost:3009");

    socket.on('connect', async function (evt) {
        await sendRequest('joinRoom', { username, roomId });
    });

    socket.on('error', function (err) {
        console.error('socket.io ERROR:', err);    
    });

    socket.on('disconnect', function (evt) {
        console.log('socket.io disconnect:', evt);
    });

    socket.on('message', function (message) {
        if (message.type === 'welcome') {
            if (socket.id !== message.id) {
                console.warn('WARN: something wrong with clientID', socket.io, message.id);
            }

            clientId = message.id;
        } else {
            console.error('UNKNOWN message from server:', message);
        }
    });

    socket.on('newProducer', function (message) {
        const remoteId = message.socketId;
        const prdId = message.producerId;
        const kind = message.kind;
        if (kind === 'video') {
            consumeAdd(consumerTransport, remoteId, prdId, kind);
        } else if (kind === 'audio') {
            consumeAdd(consumerTransport, remoteId, prdId, kind);
        }
    });

    socket.on('producerClosed', function (message) {
        const localId = message.localId;
        const remoteId = message.remoteId;
        const kind = message.kind;
        
        removeConsumer(remoteId, kind);
        removeRemoteVideo(remoteId);
    });

    // Hide join screen and show controls and participant view
    joinScreen.style.display = 'none';
    controls.style.display = 'block';
    participantView.style.display = 'block';

    if (!isProvider) {
        cameraButton.style.display = 'none';
        screenButton.style.display = 'none';
        muteButton.style.display = 'none';
        videoButton.style.display = 'none';
        pushButton.style.display = 'none';
    }

    cameraButton.addEventListener('click', () => {
        navigator.mediaDevices.getUserMedia({ audio: audioEnabled, video: videoEnabled })
            .then(stream => {
                localStream = stream;
                addLocalVideoToView('local_video', stream);
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
                alert('Could not access your camera and microphone. Please check your permissions.');
            });
    });

    screenButton.addEventListener('click', () => {
        navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always'}, audio: true })
            .then((stream) => {
                localStream = stream;
                addLocalVideoToView('local_video', stream);
                stream.getVideoTracks()[0].onended = () => {
                    console.log("Người dùng đã dừng chia sẻ màn hình");
                };
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
                alert('Could not access your camera and microphone. Please check your permissions.');
            });
    });

    // Handle mute button click
    muteButton.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        localStream.getAudioTracks()[0].enabled = audioEnabled;
        muteButton.textContent = audioEnabled ? 'Mute' : 'Unmute';
    });

    // Handle video button click
    videoButton.addEventListener('click', () => {
        videoEnabled = !videoEnabled;
        localStream.getVideoTracks()[0].enabled = videoEnabled;
        document.getElementById('videoButton').textContent = videoEnabled ? 'Stop Video' : 'Start Video';
    });

    // Handle leave button click
    leaveButton.addEventListener('click', () => {
        if (localStream) {
            const localVideo = document.getElementById('local_video');
            localVideo.pause;
            localVideo.srcObject = null;
            stopLocalStream();
            localStream = null;
        }

        if (videoProducer) {
            videoProducer.close(); // localStream will stop
            videoProducer = null;
        }

        if (audioProducer) {
            audioProducer.close(); // localStream will stop
            audioProducer = null;
        }

        if (producerTransport) {
            producerTransport.close(); // localStream will stop
            producerTransport = null;
        }

        for (const key in videoConsumers) {
            const consumer = videoConsumers[key];
            consumer.close();
            delete videoConsumers[key];
        }

        for (const key in audioConsumers) {
            const consumer = audioConsumers[key];
            consumer.close();
            delete audioConsumers[key];
        }
      
        if (consumerTransport) {
            consumerTransport.close();
            consumerTransport = null;
        }

        if (socket) {
            socket.close();
            socket = null;
            clientId = null;
            console.log('socket.io closed..');
        }

        // Reset UI
        joinScreen.style.display = 'block';
        controls.style.display = 'none';
        participantView.style.display = 'none';
        participantView.innerHTML = '';
    });

    subscribeMedia();
}

pushButton.addEventListener('click', () => pushStream());

const pushStream = async () => {
    const data = await sendRequest('getRouterRtpCapabilities', {});
    await loadDevice(data);
    
    // --- get transport info ---
    const params = await sendRequest('createProducerTransport', {});
    producerTransport = device.createSendTransport(params);

    producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        sendRequest('connectProducerTransport', { dtlsParameters: dtlsParameters })
            .then(callback)
            .catch(errback);
    });
  
    producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        try {
            const { id } = await sendRequest('produce', {
                transportId: producerTransport.id,
                kind,
                rtpParameters,
            });
            callback({ id });
    
            // subscribeMedia();
        } catch (err) {
            errback(err);
        }
    });
  
    producerTransport.on('connectionstatechange', (state) => {
        switch (state) {
            case 'connecting':
                console.log('publishing...');
                break;
  
            case 'connected':
                console.log('published');
                break;
  
            case 'failed':
                console.log('failed');
                producerTransport.close();
                break;
  
            default:
                break;
        }
    });

    if (videoEnabled) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            // const trackParams = { track: videoTrack };
            const trackParams = {
                track: videoTrack,
                encodings: [
                    { maxBitrate: 100000 },
                    { maxBitrate: 300000 },
                    { maxBitrate: 900000 }
                ],
                codecOptions: {
                    videoGoogleStartBitrate : 1000
                }
            };
            videoProducer = await producerTransport.produce(trackParams);
        }
    }

    if (audioEnabled) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            const trackParams = { track: audioTrack };
            audioProducer = await producerTransport.produce(trackParams);
        }
    }
}

const subscribeMedia = async () => {
    const data = await sendRequest('getRouterRtpCapabilities', {});  
    await loadDevice(data);
    
    // --- prepare transport ---
    if (!consumerTransport) {
        const params = await sendRequest('createConsumerTransport', {});
      
        consumerTransport = device.createRecvTransport(params);
      
        consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            sendRequest('connectConsumerTransport', { dtlsParameters: dtlsParameters })
            .then(callback)
            .catch(errback);
        });

        consumerTransport.on('connectionstatechange', (state) => {
            switch (state) {
                case 'connecting':
                    console.log('subscribing...');
                    break;

                case 'connected':
                    console.log('subscribed');
                    //consumeCurrentProducers(clientId);
                    break;

                case 'failed':
                    console.log('failed');
                    producerTransport.close();
                    break;

                default:
                    break;
            }
        });

      consumeCurrentProducers(clientId);
    }
}

async function consumeCurrentProducers(clientId) {
    const remoteInfo = await sendRequest('getCurrentProducers', { localId: clientId })
        .catch(err => {
            console.error('getCurrentProducers ERROR:', err);
            return;
        });
    
    console.log('remoteInfo.remoteVideoIds:', remoteInfo.remoteVideoIds);
    console.log('remoteInfo.remoteAudioIds:', remoteInfo.remoteAudioIds);
    consumeAll(consumerTransport, remoteInfo.remoteVideoIds, remoteInfo.remoteAudioIds);
}

function consumeAll(transport, remoteVideoIds, remotAudioIds) {
    remoteVideoIds.forEach(rId => {
        consumeAdd(transport, rId, null, 'video');
    });
    remotAudioIds.forEach(rId => {
        consumeAdd(transport, rId, null, 'audio');
    });
};

async function consumeAdd(transport, remoteSocketId, prdId, trackKind) {
    const { rtpCapabilities } = device;
    const data = await sendRequest('consumeAdd', { rtpCapabilities: rtpCapabilities, remoteId: remoteSocketId, kind: trackKind })
        .catch(err => {
            console.error('consumeAdd ERROR:', err);
        });
    const {
        producerId,
        id,
        kind,
        rtpParameters,
    } = data;
    if (prdId && (prdId !== producerId)) {
        console.warn('producerID NOT MATCH');
    }

    let codecOptions = {};
    const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions,
    });
    //const stream = new MediaStream();
    //stream.addTrack(consumer.track);

    addRemoteTrack(remoteSocketId, consumer.track);

    addConsumer(remoteSocketId, consumer, kind);
    consumer.remoteId = remoteSocketId;
    consumer.on("transportclose", () => {
        console.log('--consumer transport closed. remoteId=' + consumer.remoteId);
    });
    consumer.on("producerclose", () => {
        consumer.close();
        removeConsumer(remoteId, kind);
        removeRemoteVideo(consumer.remoteId);
    });
    consumer.on('trackended', () => {
        console.log('--consumer trackended. remoteId=' + consumer.remoteId);
    });

    console.log('--end of consumeAdd');
    //return stream;

    if (kind === 'video') {
      console.log('--try resumeAdd --');
      sendRequest('resumeAdd', { remoteId: remoteSocketId, kind: kind })
        .then(() => {
          console.log('resumeAdd OK');
        })
        .catch(err => {
          console.error('resumeAdd ERROR:', err);
        });
    }
}

function addRemoteTrack(id, track) {
    let video = document.getElementById('remote_' + id);
    if (!video) {
        video = document.createElement('video');
        video.id = 'remote_' + id;
        video.width = 240;
        video.volume = 0;
        video.controls = '1';
    }

    if (video.srcObject) {
        video.srcObject.addTrack(track);
    } else {
        const newStream = new MediaStream();
        newStream.addTrack(track);
        video.srcObject = newStream;
        video.volume = 0;
        video.play().then(() => {
            video.volume = 1.0;
        });
        participantView.appendChild(video);
    }
}

const stopLocalStream = () => {
    let tracks = localStream.getTracks();
    if (!tracks) {
      console.warn('NO tracks');
      return;
    }

    tracks.forEach(track => track.stop());
}

const addConsumer = (id, consumer, kind) => {
    if (kind === 'video') {
        videoConsumers[id] = consumer;
    } else if (kind === 'audio') {
        audioConsumers[id] = consumer;
    } else {
      console.warn('UNKNOWN consumer kind=' + kind);
    }
}

const removeConsumer = (id, kind) => {
    if (kind === 'video') {
        delete videoConsumers[id];
    } else if (kind === 'audio') {
        delete audioConsumers[id];
    } else {
        console.warn('UNKNOWN consumer kind=' + kind);
    }
}

const removeRemoteVideo = (id) => {
    let element = document.getElementById('remote_' + id);
    if (element) {
        element.pause();
        element.srcObject = null;
        participantView.removeChild(element);
    } else {
      console.log('child element NOT FOUND');
    }
}