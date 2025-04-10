# provider
- join room
- khởi tao media local => localstream
- click push stream button
- load RtpCapabilities from getRouterRtpCapabilities
- khởi tạo device: device = new MediasoupClient.Device();
- load RtpCapabilities vào device: device.load({ routerRtpCapabilities });
- yêu cầu createProducerTransport => trả về transportInfo
- tạo producerTransport = device.createSendTransport(transportInfo);
- thêm video track vào producerTransport: await producerTransport.produce(trackParams);
- thêm audio track vào producerTransport: await producerTransport.produce(trackParams);
- lắng nghe event từ producerTransport
- producerTransport on connect
    + emit connectProducerTransport
- producerTransport on produce
    + emit produce
        ++ video
        ++ audio
- producerTransport on connectionstatechange
    + connecting
    + connected
    + failed

# viewer
- join room
- click subscribe button
- load RtpCapabilities from getRouterRtpCapabilities
- khởi tạo device: device = new MediasoupClient.Device();
- load RtpCapabilities vào device: device.load({ routerRtpCapabilities });
- yêu cầu createConsumerTransport => trả về transportInfo
- tạo consumerTransport = device.createSendTransport(transportInfo);
- emit consume
- consumer = await consumerTransport.consume
    + video
        ++ add track into video element
    + audio
        ++ add track into video element