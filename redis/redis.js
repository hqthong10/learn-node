// import { createClient } from 'redis';
const redis = require('redis');
const client =  redis.createClient();
// const subscriber =  redis.createClient();
const subscriber = client.duplicate();


client.on('connect', function () {
  console.log('Redis client connected');
});
client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

client.connect();
subscriber.connect();

client.set('thong', 'ahihi1');
client.get('thong').then((val) => {
  console.log('get', val);
})


// raw Redis commands
client.HSET('key1', 'field1', 'value1');
client.HGETALL('key1').then((val) => {
  console.log('HGETALL', val['field1']);
});

// friendly JavaScript commands
// await client.hSet('key', 'field', 'value');
// await client.hGetAll('key');

// await client.hGetAll('key'); // { field1: 'value1', field2: 'value2' }
// await client.hVals('key'); // ['value1', 'value2']

// await client.hSet('key', 'field', Buffer.from('value')); // 'OK'
// await client.hGetAll(
//   commandOptions({ returnBuffers: true }),
//   'key'
// ); // { field: <Buffer 76 61 6c 75 65> }

// subscriber.on('error', err => console.error(err));
// subscriber.connect();

client.subscribe('message', (message, channel) => console.log(message, channel));


client.publish(
  'THONG_CHANNEL',
  'abcdqwe'  
);



// const value =  client.get('key');
//  client.disconnect();