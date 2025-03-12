class Room {
    constructor(name) {
        this.name = name;
        this.producerTransports = {};
        this.videoProducers = {};
        this.audioProducers = {};

        this.consumerTransports = {};
        this.videoConsumerSets = {};
        this.audioConsumerSets = {};

        this.router = null;
    }

    getProducerTrasnport(id) {
        return this.producerTransports[id];
    }

    addProducerTrasport(id, transport) {
        this.producerTransports[id] = transport;
    }

    removeProducerTransport(id) {
        delete this.producerTransports[id];
    }

    getProducer(id, kind) {
        if (kind === 'video') {
            return this.videoProducers[id];
        } else if (kind === 'audio') {
            return this.audioProducers[id];
        } else {
            console.warn('UNKNOWN producer kind=' + kind);
            return null;
        }
    }

    getRemoteIds(clientId, kind) {
        let remoteIds = [];
        if (kind === 'video') {
            for (const key in this.videoProducers) {
                if (key !== clientId) {
                    remoteIds.push(key);
                }
            }
        } else if (kind === 'audio') {
            for (const key in this.audioProducers) {
                if (key !== clientId) {
                    remoteIds.push(key);
                }
            }
        }
        return remoteIds;
    }

    addProducer(id, producer, kind) {
        if (kind === 'video') {
            this.videoProducers[id] = producer;
        } else if (kind === 'audio') {
            this.audioProducers[id] = producer;
        } else {
            console.warn('UNKNOWN producer kind=' + kind);
        }
    }

    removeProducer(id, kind) {
        if (kind === 'video') {
            delete this.videoProducers[id];
        } else if (kind === 'audio') {
            delete this.audioProducers[id];
        } else {
            console.warn('UNKNOWN producer kind=' + kind);
        }
    }

    getConsumerTrasnport(id) {
        return this.consumerTransports[id];
    }

    addConsumerTrasport(id, transport) {
        this.consumerTransports[id] = transport;
    }

    removeConsumerTransport(id) {
        delete this.consumerTransports[id];
    }
    
    getConsumerSet(localId, kind) {
        if (kind === 'video') {
            return this.videoConsumerSets[localId];
        } else if (kind === 'audio') {
            return this.audioConsumerSets[localId];
        } else {
            console.warn('WARN: getConsumerSet() UNKNWON kind=%s', kind);
        }
    }
    
    addConsumerSet(localId, set, kind) {
        if (kind === 'video') {
            this.videoConsumerSets[localId] = set;
        } else if (kind === 'audio') {
            this.audioConsumerSets[localId] = set;
        } else {
            console.warn('WARN: addConsumerSet() UNKNWON kind=%s', kind);
        }
    }
    
    removeConsumerSetDeep(localId) {
        const videoSet = this.getConsumerSet(localId, 'video');
        delete this.videoConsumerSets[localId];
        if (videoSet) {
            for (const key in videoSet) {
                const consumer = videoSet[key];
                consumer.close();
                delete videoSet[key];
            }
        }
    
        const audioSet = this.getConsumerSet(localId, 'audio');
        delete this.audioConsumerSets[localId];
        if (audioSet) {
            for (const key in audioSet) {
                const consumer = audioSet[key];
                consumer.close();
                delete audioSet[key];
            }
        }
    }
    
    getConsumer(localId, remoteId, kind) {
        const set = this.getConsumerSet(localId, kind);
        if (set) {
            return set[remoteId];
        } else {
            return null;
        }
    }
    
    addConsumer(localId, remoteId, consumer, kind) {
        const set = this.getConsumerSet(localId, kind);
        if (set) {
            set[remoteId] = consumer;
        } else {
            const newSet = {};
            newSet[remoteId] = consumer;
            this.addConsumerSet(localId, newSet, kind);
        }
    }
    
    removeConsumer(localId, remoteId, kind) {
        const set = this.getConsumerSet(localId, kind);
        if (set) {
            delete set[remoteId];
        } else {
            console.log('NO set for room=%s kind=%s, localId=%s', this.name, kind, localId);
        }
    }
    
    // --- static methtod ---
    static staticInit() {
        rooms = {};
    }
    
    static addRoom(room, name) {
        Room.rooms[name] = room;
        console.log('static addRoom. name=%s', room.name);
    }
    
    static getRoom(name) {
        return Room.rooms[name];
    }
    
    static removeRoom(name) {
        delete Room.rooms[name];
    }
}

module.exports = Room;
