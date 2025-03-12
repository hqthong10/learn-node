const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const { createMediasoupWorker, createMediasoupRouter, createWebRtcTransport, createConsumer } = require("./mediasoupHandler");
const Room = require("./room-storage");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('client'));

// -- static member --
Room.rooms = {};

// --- default room ---
let defaultRoom = null;

let worker = null;

async function init() {
    worker = await createMediasoupWorker();
    defaultRoom = await setupRoom('_default_room');
}

init();
  

io.on("connection", (socket) => {

    socket.on('disconnect', function () {
        const roomName = getRoomname();
    
        // close user connection
        cleanUpPeer(roomName, socket);
    
        // --- socket.io room ---
        socket.leave(roomName);
    });

    socket.on('error', function (err) {
        console.error('socket ERROR:', err);
    });

    socket.on('connect_error', (err) => {
        console.error('client connection error', err);
    });

    socket.on('getRouterRtpCapabilities', (data, callback) => {
        const router = defaultRoom.router;
        if (router) {
            sendResponse(router.rtpCapabilities, callback);
        } else {
            sendReject({ text: 'ERROR- router NOT READY' }, callback);
        }
    });

    socket.on("joinRoom", async ({ username, roomId }) => {
        const existRoom = Room.getRoom(roomId);
        if (!existRoom) {
            await setupRoom(roomId);
        }

        // --- socket.io room ---
        socket.join(roomId);
        setRoomname(roomId);

        // socket.on('newParticipant', ({ id, stream }) => {
        //     socket.to(roomId).emit('newParticipant', { id, stream });
        // });
      
        // socket.on('leaveRoom', ({ username, roomId }) => {
        //     socket.leave(roomId);
        //     socket.to(roomId).emit('participantLeft', username);
        // });

        // socket.on('disconnect', () => {
        //     console.log('Client disconnected');
        // });
    });

    socket.on('createProducerTransport', async (data, callback) => {
        const roomName = getRoomname();
        const { transport, params } = await createTransport(roomName);
        addProducerTrasport(roomName, socket.id, transport);

        transport.observer.on('close', () => {
            const id = socket.id;
            const videoProducer = getProducer(roomName, id, 'video');
            if (videoProducer) {
                videoProducer.close();
                removeProducer(roomName, id, 'video');
            }
            const audioProducer = getProducer(roomName, id, 'audio');
            if (audioProducer) {
                audioProducer.close();
                removeProducer(roomName, id, 'audio');
            }
            removeProducerTransport(roomName, id);
        });
        
        sendResponse(params, callback);
    });

    socket.on('connectProducerTransport', async (data, callback) => {
        const roomName = getRoomname();
        const transport = getProducerTrasnport(roomName, socket.id);
        await transport.connect({ dtlsParameters: data.dtlsParameters });
        sendResponse({}, callback);
    });

    socket.on('produce', async (data, callback) => {
        const roomName = getRoomname();
        const { kind, rtpParameters } = data;
        
        const id = socket.id;
        const transport = getProducerTrasnport(roomName, id);
        if (!transport) {
            console.error('transport NOT EXIST for id=' + id);
            return;
        }

        const producer = await transport.produce({ kind, rtpParameters });
        addProducer(roomName, id, producer, kind);
        producer.observer.on('close', () => {
            console.log('producer closed --- kind=' + kind);
        })
        
        sendResponse({ id: producer.id }, callback);
    
        // inform clients about new producer
        if (roomName) {
            socket.broadcast.to(roomName).emit('newProducer', { socketId: id, producerId: producer.id, kind: producer.kind });
        } else {
            socket.broadcast.emit('newProducer', { socketId: id, producerId: producer.id, kind: producer.kind });
        }
    });

    socket.on('getCurrentProducers', async (data, callback) => {
        const roomName = getRoomname();
        const clientId = data.localId;
    
        const remoteVideoIds = getRemoteIds(roomName, clientId, 'video');
        const remoteAudioIds = getRemoteIds(roomName, clientId, 'audio');
        
        sendResponse({ remoteVideoIds: remoteVideoIds, remoteAudioIds: remoteAudioIds }, callback);
    });

    socket.on('createConsumerTransport', async (data, callback) => {
        const roomName = getRoomname();
        const { transport, params } = await createTransport(roomName);
        addConsumerTrasport(roomName, socket.id, transport);
        
        transport.observer.on('close', () => {
            const localId = socket.id;
            removeConsumerSetDeep(roomName, localId);
            removeConsumerTransport(roomName, lid);
        });

        transport.observer.on('newproducer', (producer) => {
            console.log("new producer created [id:%s]", producer.id);
        });
        
        sendResponse(params, callback);
    });

    socket.on('connectConsumerTransport', async (data, callback) => {
        const roomName = getRoomname();
        let transport = getConsumerTrasnport(roomName, socket.id);
        if (!transport) {
          return;
        }

        await transport.connect({ dtlsParameters: data.dtlsParameters });
        sendResponse({}, callback);
    });

    socket.on('consumeAdd', async (data, callback) => {
        const roomName = getRoomname();
        const localId = socket.id;
        const kind = data.kind;
    
        let transport = getConsumerTrasnport(roomName, localId);
        if (!transport) {
            console.error('transport NOT EXIST for id=' + localId);
            return;
        }

        const rtpCapabilities = data.rtpCapabilities;
        const remoteId = data.remoteId;
        
        const producer = getProducer(roomName, remoteId, kind);
        if (!producer) {
            console.error('producer NOT EXIST for remoteId=%s kind=%s', remoteId, kind);
            return;
        }

        let router = null;
        if (roomName) {
            const room = Room.getRoom(roomName);
            router = room.router;
        } else {
            router = defaultRoom.router;
        }
        const { consumer, params } = await createConsumer(router, transport, producer, rtpCapabilities); // producer must exist before consume
        
        addConsumer(roomName, localId, remoteId, consumer, kind); // TODO: MUST comination of  local/remote id
        
        consumer.observer.on('close', () => {
            console.log('consumer closed ---');
        })

        consumer.on('producerclose', () => {
            consumer.close();
            removeConsumer(roomName, localId, remoteId, kind);
    
            // -- notify to client ---
            socket.emit('producerClosed', { localId: localId, remoteId: remoteId, kind: kind });
        });
    
        sendResponse(params, callback);
    });

    socket.on('resumeAdd', async (data, callback) => {
        const roomName = getRoomname();
        const localId = socket.id;
        const remoteId = data.remoteId;
        const kind = data.kind;
        
        let consumer = getConsumer(roomName, localId, remoteId, kind);
        if (!consumer) {
            console.error('consumer NOT EXIST for remoteId=' + remoteId);
            return;
        }
        
        await consumer.resume();
        sendResponse({}, callback);
    });
    

    socket.on('consume', async (data, callback) => {
        console.error('-- ERROR: consume NOT SUPPORTED ---');
        return;
    });
    
    socket.on('resume', async (data, callback) => {
        console.error('-- ERROR: resume NOT SUPPORTED ---');
        return;
    });

    socket.emit('message', { type: 'welcome', id: socket.id });

    const sendResponse = (response, callback) => {
        callback(null, response);
    }

    const setRoomname = (room) => {
        socket.roomname = room;
    }

    const getRoomname = () => {
        const room = socket.roomname;
        return room;
    }
});

async function setupRoom(name) {
    const room = new Room(name);
    
    const router = await createMediasoupRouter(worker);
    router.roomname = name;
  
    router.observer.on('close', () => {
        console.log('-- router closed. room=%s', name);
    });

    router.observer.on('newtransport', transport => {
        console.log('-- router newtransport. room=%s', name);
    });
  
    room.router = router;
    Room.addRoom(room, name);
    return room;
}

async function createTransport(roomname) {
    let router = null;
    if (roomname) {
        const room = Room.getRoom(roomname);
        router = room.router;
    } else {
        router = defaultRoom.router;
    }
    
    return await createWebRtcTransport(router);
}

const getProducerTrasnport = (roomname, id) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        return room.getProducerTrasnport(id);
    } else {
        return defaultRoom.getProducerTrasnport(id);
    }
}
  
const addProducerTrasport = (roomname, id, transport) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        room.addProducerTrasport(id, transport);
    } else {
        defaultRoom.addProducerTrasport(id, transport);
    }
}
  
const removeProducerTransport = (roomname, id) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        room.removeProducerTransport(id);
    } else {
        defaultRoom.removeProducerTransport(id);
    }
}

const addProducer = (roomname, id, producer, kind) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        room.addProducer(id, producer, kind);
    } else {
        defaultRoom.addProducer(id, producer, kind);
    }
}

const getRemoteIds = (roomname, clientId, kind) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      return room.getRemoteIds(clientId, kind);
    } else {
      return defaultRoom.getRemoteIds(clientId, kind);
    }
}

const getProducer = (roomname, id, kind) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        return room.getProducer(id, kind);
    } else {
        return defaultRoom.getProducer(id, kind);
    }
}

const removeProducer = (roomname, id, kind) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        room.removeProducer(id, kind);
    } else {
        defaultRoom.removeProducer(id, kind);
    }
}

const addConsumerTrasport = (roomname, id, transport) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        room.addConsumerTrasport(id, transport);
    } else {
        defaultRoom.addConsumerTrasport(id, transport);
    }
}

const removeConsumerSetDeep = (roomname, localId) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        room.removeConsumerSetDeep(localId);
    } else {
        defaultRoom.removeConsumerSetDeep(localId);
    }
}

const removeConsumerTransport = (roomname, id) => {
    if (roomname) {
      const room = Room.getRoom(roomname);
      room.removeConsumerTransport(id);
    }
    else {
      defaultRoom.removeConsumerTransport(id);
    }
}

const getConsumerTrasnport = (roomname, id) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        return room.getConsumerTrasnport(id);
    } else {
        return defaultRoom.getConsumerTrasnport(id);
    }
}

const addConsumer = (roomname, localId, remoteId, consumer, kind) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        room.addConsumer(localId, remoteId, consumer, kind);
    } else {
        defaultRoom.addConsumer(localId, remoteId, consumer, kind);
    }
}

const removeConsumer = (roomname, localId, remoteId, kind) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        room.removeConsumer(localId, remoteId, kind);
    } else {
        defaultRoom.removeConsumer(localId, remoteId, kind);
    }
}

const getConsumer = (roomname, localId, remoteId, kind) => {
    if (roomname) {
        const room = Room.getRoom(roomname);
        return room.getConsumer(localId, remoteId, kind);
    } else {
        return defaultRoom.getConsumer(localId, remoteId, kind);
    }
}

const cleanUpPeer = (roomname, socket) => {
    const id = socket.id;
    removeConsumerSetDeep(roomname, id);
  
    const transport = getConsumerTrasnport(roomname, id);
    if (transport) {
        transport.close();
        removeConsumerTransport(roomname, id);
    }
  
    const videoProducer = getProducer(roomname, id, 'video');
    if (videoProducer) {
        videoProducer.close();
        removeProducer(roomname, id, 'video');
    }
    
    const audioProducer = getProducer(roomname, id, 'audio');
    if (audioProducer) {
        audioProducer.close();
        removeProducer(roomname, id, 'audio');
    }
  
    const producerTransport = getProducerTrasnport(roomname, id);
    if (producerTransport) {
        producerTransport.close();
        removeProducerTransport(roomname, id);
    }
}

server.listen(3009, () => {
    console.log("SFU Server running on port 3009");
});