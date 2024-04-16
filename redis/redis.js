// import { createClient } from 'redis';
const redis = require("redis");

const client = redis.createClient();
// const subscriber =  redis.createClient();
// const subscriber = client.duplicate();

client.on("connect", function () {
  console.log("Redis client connected");
  main();
});
client.on("error", function (err) {
  console.log("Something went wrong " + err);
});

client.connect();

async function funcSet() {
  // SET: Đặt giá trị value cho key
  client.set("LOCAL_LEARN_INFO_THONG", "xin chào");
}

async function funcGet() {
  // GET: Lấy giá trị lưu trữ bởi key
  const val = await client.get("LOCAL_LEARN_INFO_THONG");
  console.log("get", val);
}

async function funcDel() {
  // DEL: Xóa key nếu nó tồn tại
  // 0 | 1
  const val = await client.del("thong");
  if (val === 1) {
    console.log("deleted");
  } else {
    console.log("delete fail");
  }
}

async function funcExists() {
  // EXISTS: Kiểm tra key có tồn tại không
  // 0 | 1
  const val = await client.exists("LOCAL_LEARN_INFO_THONG");
  if (val === 1) {
    console.log("key is exists");
  } else {
    console.log("key is not exists");
  }
}

async function funcExpire() {
  // EXPIRE: Đặt expire time cho key sau n giây
  client.expire("LOCAL_LEARN_INFO_THONG", 60);
}

async function funcPersist() {
  // PERSIST: Xóa expire time của key
}

async function funcTtl() {
  // TTL: Lấy thời gian sống của key (giây)
  // const val = await client.ttl("LOCAL_LEARN_INFO_THONG");
  // console.log("TTL", val);
}

async function funcRename() {
  // RENAME: Đổi tên key sang newkey,
  // nếu newkey đã tồn tại giá trị của nó sẽ bị ghi đè bởi giá trị của key
}

function funcFlushall() {
  // flushall: xóa tất cả các key
}

async function funcKeys() {
  // KEYS: lấy tất cả các key
  const vals = await client.keys("*");
  console.log(vals);
}

async function funcHset() {
  // HSET:
  // client.HSET("LOCAL_LEARN_H_SET_GET", "field1", "value1");
  client.HSET("LOCAL_LEARN_H_SET_GET", "field2", "value2");
}

async function funcHgetAll() {
  // HGET:
  const vals = await client.HGETALL("LOCAL_LEARN_H_SET_GET");
  console.log("HGETALL", vals["field1"]);
}

// raw Redis commands
// client.HSET('key1', 'field1', 'value1');
// client.HGETALL('key1').then((val) => {
//   console.log('HGETALL', val['field1']);
// });

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

// client.lrange

// client.lrem

// client.rpush

// client.hgetall

// client.hset

// client.expire

// client.hdel

// subscriber.on('error', err => console.error(err));
// subscriber.connect();

// client.subscribe("message", (message, channel) =>
//   console.log(message, channel)
// );

// client.publish("THONG_CHANNEL", "abcdqwe");

// const value =  client.get('key');
//  client.disconnect();

async function main() {
  // await client.lPush("bikes:finish", "bike:5");
  // await client.lPush("bikes:repairs", "bike:2");

  // await client.lPush("bikes:repairs", "bike:3");
  // await client.lPush("bikes:repairs", "bike:4");

  // await client.lPop("bikes:repairs");

  // const res3 = await client.lLen("bikes:repairs");
  // console.log(res3);

  const res4 = await client.lRange("bikes:repairs", 0, -1);

  console.log(res4); // bike:2

  // funcHgetAll();
  // client.HGETALL("key1").then((val) => {
  //   console.log("HGETALL", val["field1"]);
  // });
}
