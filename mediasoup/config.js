module.exports = {
    mediasoup: {
        numWorkers: 4, // Số worker process, nên bằng số CPU core
        worker: {
            rtcMinPort: 10000,
            rtcMaxPort: 10100,
            logLevel: "warn",
            logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
        },
        router: {
            mediaCodecs: [
                {
                    kind: "audio",
                    mimeType: "audio/opus",
                    clockRate: 48000,
                    channels: 2,
                },
                {
                    kind: "video",
                    mimeType: "video/VP8",
                    // mimeType: "video/H264",
                    clockRate: 90000,
                    parameters: {
                        'x-google-start-bitrate': 1000
                    }
                },
            ],
        },
        webRtcTransport: {
            listenIps: [
                { ip: '127.0.0.1', announcedIp: null },
                { ip: '192.168.1.53', announcedIp: null }
            ],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
            maxIncomingBitrate: 1500000,
            initialAvailableOutgoingBitrate: 1000000,
        }
    },
};