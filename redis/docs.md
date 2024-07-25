Redis là một cơ sở dữ liệu lưu trữ cấu trúc dữ liệu trong bộ nhớ (in-memory data structure store), được sử dụng như một cơ sở dữ liệu, bộ nhớ đệm (cache), và message broker. 

Redis hỗ trợ các cấu trúc dữ liệu như chuỗi (strings), danh sách (lists), bộ tập hợp (sets), các bộ tập hợp có thứ tự (sorted sets), hàm băm (hashes), bitmaps, hyperloglogs, và các chỉ mục địa lý (geospatial indexes). 

Redis nổi tiếng với hiệu suất cao, độ trễ thấp và khả năng mở rộng tốt.

### **Các Tính Năng Chính của Redis**

1. **In-Memory Storage:** Redis lưu trữ toàn bộ dữ liệu trong bộ nhớ (RAM), giúp truy xuất dữ liệu rất nhanh.
2. **Các Cấu Trúc Dữ Liệu Phong Phú:** Redis hỗ trợ nhiều loại cấu trúc dữ liệu: strings, lists, sets, sorted sets, hashes, bitmaps, hyperloglogs, và geospatial indexes.
3. **Persistence:** Redis có khả năng lưu trữ dữ liệu trên đĩa để đảm bảo tính bền vững của dữ liệu thông qua cơ chế snapshotting (RDB) và append-only file (AOF).
4. **Replication:** Redis hỗ trợ replication (nhân bản dữ liệu), giúp sao chép dữ liệu từ master đến các slave để tăng tính sẵn sàng và hiệu suất đọc.
5. **Pub/Sub Messaging:** Redis hỗ trợ mô hình publish/subscribe (pub/sub) cho phép các ứng dụng giao tiếp với nhau thông qua các kênh (channels).
6. **Transactions:** Redis hỗ trợ các giao dịch, cho phép nhóm các lệnh lại và thực thi chúng một cách nguyên tử.
7. **Lua Scripting:** Redis hỗ trợ chạy các script Lua để thực hiện các tác vụ phức tạp.
8. **High Availability with Redis Sentinel:** Redis Sentinel cung cấp khả năng giám sát, thông báo lỗi và tự động chuyển đổi dự phòng cho các Redis instance.
9. **Partitioning with Redis Cluster:** Redis Cluster cho phép phân vùng dữ liệu trên nhiều Redis nodes, giúp tăng khả năng mở rộng.


### **Sử Dụng Redis**

1. **Caching:**
    Lưu trữ tạm thời dữ liệu để giảm tải truy vấn đến cơ sở dữ liệu chính và tăng tốc độ truy xuất dữ liệu.
2. **Session Store:**
    Lưu trữ phiên làm việc của người dùng trong các ứng dụng web.
3. **Real-Time Analytics:**
    Xử lý và lưu trữ dữ liệu thời gian thực như thống kê và đo lường.
4. **Queues:**
    Sử dụng danh sách (lists) và các cấu trúc dữ liệu khác để xây dựng hàng đợi nhiệm vụ (task queues).
5. **Leaderboards:**
    Sử dụng bộ tập hợp có thứ tự (sorted sets) để xây dựng bảng xếp hạng.
6. **Publish/Subscribe Messaging:**
    Sử dụng mô hình pub/sub để tạo các hệ thống thông báo thời gian thực.


### **Cài Đặt Redis**

Bạn có thể cài đặt Redis trên hệ điều hành của bạn bằng cách tải về từ trang chủ Redis hoặc sử dụng Docker:

```docker run --name redis -d redis```


### **Sử Dụng Redis với Node.js**

- Cài đặt thư viện Redis cho Node.js:

```npm install redis```

- Tạo tập tin index.js:

```
const redis = require('redis');
const client = redis.createClient();

// Kết nối đến Redis server
client.on('connect', function() {
    console.log('Connected to Redis');
});

// Lưu trữ một chuỗi
client.set('key', 'value', redis.print);

// Lấy giá trị của một chuỗi
client.get('key', function(err, reply) {
    if (err) throw err;
    console.log(reply); // Hiển thị 'value'
});

// Đóng kết nối
client.quit();
```


### **Các kiểu dữ liệu trong Redis**

#### **String**

- **set** Đặt giá trị value cho key

```client.set("LOCAL_LEARN_INFO", "xin chào");```

- **setnx** Đặt giá trị value cho key chỉ khi key không tồn tại
```client.set("LOCAL_LEARN_INFO", "xin chào", { NX:true });```

- **get** Lấy giá trị lưu trữ bởi key

```
await client.get("LOCAL_LEARN_INFO");
hoặc
client.get(key, (err, result) => {})
```

- **keys** Lấy tất cả các key

```await client.keys("*");```

- **mset** 

```
const res5 = await client.mSet([
  ["bike:1", "Deimos"],
  ["bike:2", "Ares"],
  ["bike:3", "Vanth"]
]);

console.log(res5);  // OK
```

- **mget** truy xuất nhiều giá trị chuỗi trong một thao tác

```
const res6 = await client.mGet(["bike:1", "bike:2", "bike:3"]);
console.log(res6);  // ['Deimos', 'Ares', 'Vanth']
```

- **del** Xóa key nếu nó tồn tại => 0 | 1

```await client.del("LOCAL_LEARN_INFO");```

- **exists** Kiểm tra key có tồn tại không => 0 | 1

```await client.exists("LOCAL_LEARN_INFO");```

- **expire** Đặt expire time cho key sau n giây

```client.expire("LOCAL_LEARN_INFO", 60);```

- **persist** Xóa expire time của key

``` ```

- **ttl** Lấy thời gian sống của key (giây)

```await client.ttl("LOCAL_LEARN_INFO");```

- **rename** Đổi tên key sang newkey, nếu newkey đã tồn tại giá trị của nó sẽ bị ghi đè bởi giá trị của key

``` ```

- **incr và incrBy  DECR and DECRBY**

```
await client.set("total_crashes", 0);
const res7 = await client.incr("total_crashes");
console.log(res7); // 1
const res8 = await client.incrBy("total_crashes", 10);
console.log(res8); // 11
```
- **flushall** Xóa tất cả các key

``` ```

#### Use Redis with JSON

```
const res1 = await client.json.set("bike", "$", '"Hyperion"');
console.log(res1); // OK

const res2 = await client.json.get("bike", "$");
console.log(res2); // "Hyperion"

const res3 = await client.json.type("bike", "$");
console.log(res3); //  [ 'string' ]
```

Numbers can be incremented and multiplied:

```
const res7 = await client.json.set("crashes", "$", 0);
console.log(res7) //  OK

const res8 = await client.json.numIncrBy("crashes", "$", 1);
console.log(res8) //  [1]

const res9 = await client.json.numIncrBy("crashes", "$", 1.5);
console.log(res9) //  [2.5]

const res10 = await client.json.numIncrBy("crashes", "$", -0.75);
console.log(res10) //  [1.75]
```

Đây là một ví dụ thú vị hơn bao gồm các mảng và đối tượng JSON:

```
const res11 = await client.json.set("newbike", "$", ["Deimos", {"crashes": 0 }, null]);
console.log(res11); //  OK

const res12 = await client.json.get("newbike", "$");
console.log(res12); //  [ 'Deimos', { crashes: 0 }, null ]

const res13 = await client.json.get("newbike", "$[1].crashes");
console.log(res13); //  [ 'Deimos', { crashes: 0 }, null ]

const res14 = await client.json.del("newbike", "$.[-1]");
console.log(res14); //  [1]

const res15 = await client.json.get("newbike", "$");
console.log(res15); //  [ 'Deimos', { crashes: 0 } ]
```

Bạn có thể thao tác với mảng bằng một tập hợp con các lệnh JSON chuyên dụng:

```
const res16 = await client.json.set("riders", "$", []);
console.log(res16); //  OK

const res17 = await client.json.arrAppend("riders", "$", "Norem");
console.log(res17); //  [1]

const res18 = await client.json.get("riders", "$");
console.log(res18); //  [ 'Norem' ]

const res19 = await client.json.arrInsert("riders", "$", 1, "Prickett", "Royse", "Castilla");
console.log(res19); //  [4]

const res20 = await client.json.get("riders", "$");
console.log(res20); //  [ 'Norem', 'Prickett', 'Royse', 'Castilla' ]

const res21 = await client.json.arrTrim("riders", "$", 1, 1);
console.log(res21); //  [1]

const res22 = await client.json.get("riders", "$");
console.log(res22); //  [ 'Prickett' ]

const res23 = await client.json.arrPop("riders", "$");
console.log(res23); //  [ 'Prickett' ]

const res24 = await client.json.arrPop("riders", "$");
console.log(res24); //  [null]
```

- Các đối tượng JSON cũng có lệnh riêng

```
const res25 = await client.json.set(
  "bike:1", "$", {
    "model": "Deimos",
    "brand": "Ergonom",
    "price": 4972
  }
);
console.log(res25); //  OK

const res26 = await client.json.objLen("bike:1", "$");
console.log(res26); //  [3]

const res27 = await client.json.objKeys("bike:1", "$");
console.log(res27); //  [['model', 'brand', 'price']]
```

#### Hashes

Redis hashes là các loại bản ghi được cấu trúc dưới dạng tập hợp các cặp giá trị trường.

Bạn có thể sử dụng hàm băm để biểu diễn các đối tượng cơ bản và để lưu trữ các nhóm bộ đếm, cùng nhiều thứ khác.


- **hset** đặt giá trị của một hoặc nhiều trường trên hàm băm.
- **hget** trả về giá trị tại một trường nhất định.
- **hgetall** Trả về tất cả các trường và giá trị của hàm băm được lưu trữ tại khóa. Trong giá trị được trả về, mỗi tên trường được theo sau bởi giá trị của nó, do đó độ dài của câu trả lời gấp đôi kích thước của hàm băm.
- **HKEYS** Trả về tất cả tên trường trong hàm băm được lưu trữ tại khóa.
- **HVALS** Trả về tất cả các giá trị trong hàm băm được lưu trữ tại khóa.
- **hmget** trả về các giá trị tại một hoặc nhiều trường nhất định.
- **hincrby** tăng giá trị tại một trường nhất định theo số nguyên được cung cấp.
- **hdel** Xóa các trường được chỉ định khỏi hàm băm được lưu trữ tại khóa. Các trường được chỉ định không tồn tại trong hàm băm này sẽ bị bỏ qua. Nếu khóa không tồn tại, nó được coi là hàm băm trống và lệnh này trả về 0.
- **HEXPIRE** đặt TTL còn lại sau vài giây.
- **HPEXPIRE** đặt TTL còn lại tính bằng mili giây.
- **HEXPIREAT** đặt thời gian hết hạn thành dấu thời gian1 được chỉ định tính bằng giây.
- **HPEXPIREAT** đặt thời gian hết hạn thành dấu thời gian được chỉ định bằng mili giây.
- **HEXPIRETIME** lấy thời gian hết hạn dưới dạng dấu thời gian tính bằng giây.
- **HPEXPIRETIME** lấy thời gian hết hạn dưới dạng dấu thời gian tính bằng mili giây.
- **HTTL** nhận TTL còn lại sau vài giây.
- **HPTTL** nhận được TTL còn lại tính bằng mili giây.
- **HPERSIST** loại bỏ thời hạn sử dụng.

```
const res1 = await client.hSet(
  'bike:1',
  {
    'model': 'Deimos',
    'brand': 'Ergonom',
    'type': 'Enduro bikes',
    'price': 4972,
  }
)
console.log(res1) // 4

const res2 = await client.hGet('bike:1', 'model')
console.log(res2)  // 'Deimos'

const res3 = await client.hGet('bike:1', 'price')
console.log(res3)  // '4972'

const res4 = await client.hGetAll('bike:1')
console.log(res4)  
/*
{
  brand: 'Ergonom',
  model: 'Deimos',
  price: '4972',
  type: 'Enduro bikes'
}
*/

const res5 = await client.hmGet('bike:1', ['model', 'price'])
console.log(res5)  // ['Deimos', '4972']

const res6 = await client.hIncrBy('bike:1', 'price', 100)
console.log(res6)  // 5072
const res7 = await client.hIncrBy('bike:1', 'price', -100)
console.log(res7)  // 4972

const res11 = await client.hIncrBy('bike:1:stats', 'rides', 1)
console.log(res11)  // 1
const res12 = await client.hIncrBy('bike:1:stats', 'rides', 1)
console.log(res12)  // 2
const res13 = await client.hIncrBy('bike:1:stats', 'rides', 1)
console.log(res13)  // 3
const res14 = await client.hIncrBy('bike:1:stats', 'crashes', 1)
console.log(res14)  // 1
const res15 = await client.hIncrBy('bike:1:stats', 'owners', 1)
console.log(res15)  // 1
const res16 = await client.hGet('bike:1:stats', 'rides')
console.log(res16)  // 3
const res17 = await client.hmGet('bike:1:stats', ['crashes', 'owners'])
console.log(res17)  // ['1', '1']

```

#### List

- **lpush** thêm một phần tử mới vào đầu danh sách
- **rpush** thêm vào đuôi
- **lpop** xóa và trả về một phần tử ở đầu danh sách
- **rpop** xóa và trả về một phần tử ở cuối danh sách
- **lrem** trả về độ dài của danh sách
- **lmove** di chuyển nguyên tử các phần tử từ danh sách này sang danh sách khác 
- **lrange** trích xuất một loạt các phần tử từ một danh sách
- **ltrim** giảm danh sách xuống phạm vi phần tử được chỉ định
- **blpop** loại bỏ và trả về một phần tử ở đầu danh sách. Nếu danh sách trống, lệnh sẽ chặn cho đến khi một phần tử có sẵn hoặc cho đến khi đạt đến thời gian chờ đã chỉ định.
- **blmove** di chuyển nguyên tử các phần tử từ danh sách nguồn sang danh sách đích. Nếu danh sách nguồn trống, lệnh sẽ chặn cho đến khi có phần tử mới


- rPush, lPush, lRange

```
const res15 = await client.rPush('bikes:repairs', 'bike:1');
console.log(res15);  // 1

const res16 = await client.rPush('bikes:repairs', 'bike:2');
console.log(res16);  // 2

const res17 = await client.lPush('bikes:repairs', 'bike:important_bike');
console.log(res17);  // 3

const res18 = await client.lRange('bikes:repairs', 0, -1);
console.log(res18);  // ['bike:important_bike', 'bike:1', 'bike:2']
```

- rPush, lPush, lRange

```
const res19 = await client.rPush('bikes:repairs', ['bike:1', 'bike:2', 'bike:3']);
console.log(res19);  // 3

const res20 = await client.lPush(
  'bikes:repairs', ['bike:important_bike', 'bike:very_important_bike']
);
console.log(res20);  // 5

const res21 = await client.lRange('bikes:repairs', 0, -1);
console.log(res21);  // ['bike:very_important_bike', 'bike:important_bike'
```

- rPush, rPop, lPop

```
const res22 = await client.rPush('bikes:repairs', ['bike:1', 'bike:2', 'bike:3']);
console.log(res22);  // 3

const res23 = await client.rPop('bikes:repairs');
console.log(res23);  // 'bike:3'

const res24 = await client.lPop('bikes:repairs');
console.log(res24);  // 'bike:1'

const res25 = await client.rPop('bikes:repairs');
console.log(res25);  // 'bike:2'

const res26 = await client.rPop('bikes:repairs');
console.log(res26);  // None
```

- lPush, lTrim, lRange

```
const res27 = await client.lPush(
  'bikes:repairs', ['bike:1', 'bike:2', 'bike:3', 'bike:4', 'bike:5']
);
console.log(res27);  // 5

const res28 = await client.lTrim('bikes:repairs', 0, 2);
console.log(res28);  // true

const res29 = await client.lRange('bikes:repairs', 0, -1);
console.log(res29);  // ['bike:5', 'bike:4', 'bike:3']
```

- rPush, lTrim, lRange

```
const res27eol = await client.rPush(
  'bikes:repairs', ['bike:1', 'bike:2', 'bike:3', 'bike:4', 'bike:5']
);
console.log(res27eol);  // 5

const res28eol = await client.lTrim('bikes:repairs', -3, -1);
console.log(res28eol);  // 'OK'

const res29eol = await client.lRange('bikes:repairs', 0, -1);
console.log(res29eol);  // ['bike:3', 'bike:4', 'bike:5']
```

- rPush, brPop

```
const res31 = await client.rPush('bikes:repairs', ['bike:1', 'bike:2']);
console.log(res31);  // 2

const res32 = await client.brPop('bikes:repairs', 1);
console.log(res32);  // { key: 'bikes:repairs', element: 'bike:2' }

const res33 = await client.brPop('bikes:repairs', 1);
console.log(res33);  // { key: 'bikes:repairs', element: 'bike:1' }

const res34 = await client.brPop('bikes:repairs', 1);
console.log(res34);  // null
```

##### Ví dụ

- Xử lý danh sách như một hàng đợi (vào trước, ra trước):

```
const res1 = await client.lPush('bikes:repairs', 'bike:1');
console.log(res1);  // 1

const res2 = await client.lPush('bikes:repairs', 'bike:2');
console.log(res2);  // 2

const res3 = await client.rPop('bikes:repairs');
console.log(res3);  // bike:1

const res4 = await client.rPop('bikes:repairs');
console.log(res4);  // bike:2
```

- Xử lý danh sách như một ngăn xếp (vào trước, ra sau):

```
const res5 = await client.lPush('bikes:repairs', 'bike:1');
console.log(res5);  // 1

const res6 = await client.lPush('bikes:repairs', 'bike:2');
console.log(res6); // 2

const res7 = await client.lPop('bikes:repairs');
console.log(res7);  // bike:2

const res8 = await client.lPop('bikes:repairs');
console.log(res8);  // bike:1
```

- Kiểm tra độ dài của danh sách:

```
const res9 = await client.lLen('bikes:repairs');
console.log(res9); // 0
```

- Nguyên tử bật một phần tử từ một danh sách và đẩy sang danh sách khác:

```
const res10 = await client.lPush('bikes:repairs', 'bike:1');
console.log(res10);  // 1

const res11 = await client.lPush('bikes:repairs', 'bike:2');
console.log(res11);  // 2

const res12 = await client.lMove('bikes:repairs', 'bikes:finished', 'LEFT', 'LEFT');
console.log(res12);  // 'bike:2'

const res13 = await client.lRange('bikes:repairs', 0, -1);
console.log(res13);  // ['bike:1']

const res14 = await client.lRange('bikes:finished', 0, -1);
console.log(res14);
```

- Để giới hạn độ dài của danh sách, bạn có thể gọi LTRIM

```
const res48 = await client.lPush(
  'bikes:repairs', ['bike:1', 'bike:2', 'bike:3', 'bike:4', 'bike:5']
);
console.log(res48);  // 5

const res49 = await client.lTrim('bikes:repairs', 0, 2);
console.log(res49);  // 'OK'

const res50 = await client.lRange('bikes:repairs', 0, -1);
console.log(res50);  // ['bike:5', 'bike:4', 'bike:3']
```

#### **Sets**

Bộ Redis là một tập hợp các chuỗi (thành viên) duy nhất không có thứ tự. Bạn có thể sử dụng bộ Redis để:
- Theo dõi các mục duy nhất (ví dụ: theo dõi tất cả các địa chỉ IP duy nhất truy cập vào một bài đăng blog nhất định).
- Biểu thị các mối quan hệ (ví dụ: tập hợp tất cả người dùng có vai trò nhất định).
- Thực hiện các phép toán tập hợp phổ biến như giao điểm, hợp và hiệu.

**Các lệnh cơ bản**

- **SADD** thêm một thành viên mới vào một tập hợp.
- **SREM** xóa thành viên được chỉ định khỏi tập hợp.
- **SISMEMBER** kiểm tra một chuỗi cho tư cách thành viên đã đặt.
- **SINTER** trả về tập hợp các thành viên mà hai hoặc nhiều tập hợp có điểm chung (tức là giao điểm).
- **SCARD** trả về kích thước (còn gọi là cardinality) của một tập hợp.

### **Subscriber/publish**


### **Tổng Kết**

Redis là một cơ sở dữ liệu lưu trữ trong bộ nhớ rất mạnh mẽ và linh hoạt, phù hợp cho nhiều trường hợp sử dụng yêu cầu tốc độ truy xuất dữ liệu cao và độ trễ thấp. Redis cũng cung cấp nhiều tính năng như persistence, replication, transactions, và scripting, giúp đáp ứng các nhu cầu phức tạp trong phát triển ứng dụng.