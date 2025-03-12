const mediasoup = require("mediasoup");
const config = require("./config");

const createMediasoupWorker = async () => {
    // const worker = await mediasoup.createWorker(config.mediasoup.worker);
    const worker = await mediasoup.createWorker();
    return worker;
};

const createMediasoupRouter = async (worker) => {
    const router = await worker.createRouter({ mediaCodecs: config.mediasoup.router.mediaCodecs }); 
    return router;
};

const createWebRtcTransport = async (router) => {
    const transport = await router.createWebRtcTransport(config.mediasoup.webRtcTransport);
    return {
        transport: transport,
        params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
            sctpParameters: transport.sctpParameters
        }
    };
};

const createConsumer = async (router, transport, producer, rtpCapabilities) => {
    let consumer = null;
    if (!router.canConsume({
          producerId: producer.id,
          rtpCapabilities,
        })
    ) {
        console.error('can not consume');
        return;
    }

    consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities,
        paused: producer.kind === 'video',
    }).catch(err => {
        console.error('consume failed', err);
        return;
    });

    return {
        consumer: consumer,
        params: {
          producerId: producer.id,
          id: consumer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          type: consumer.type,
          producerPaused: consumer.producerPaused
        }
    };
};

module.exports = {
    createMediasoupWorker,
    createMediasoupRouter,
    createWebRtcTransport,
    createConsumer
};