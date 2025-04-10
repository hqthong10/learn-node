// const Room = require('./room-storage');
// 
// Room.init()

// const room = new Room('room-name');
// Room.addRoom(room, 'room-name');

// console.log(Room.rooms['room-name'
//  for(let i to 20) {
//     console.log(i);
//  }
const async = require("async");

function log(text, callback) {
    const t = Math.floor(Math.random() * 100) + 1;
    setTimeout(() => {
        callback(null,`${text}-${t}`);
    }, Math.floor(Math.random() * 100) + 1);
}

async.concat(['log1', 'log2', 'log3'], log, (err, results) => {
    console.log(results);
})
//