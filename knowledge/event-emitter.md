EventEmitter là một lớp cốt lõi trong Node.js, nằm trong module events. Nó cung cấp cơ chế để xử lý sự kiện (event) và lắng nghe sự kiện (listener). Cơ chế này được sử dụng rộng rãi trong toàn bộ hệ sinh thái Node.js, giúp xử lý các tác vụ bất đồng bộ và giao tiếp giữa các phần của ứng dụng.

### Cách hoạt động của EventEmitter
EventEmitter hoạt động theo mô hình publish-subscribe (pub-sub):

1. Publish: Một sự kiện được phát ra thông qua phương thức .emit(eventName, [args]).
2. Subscribe: Các hàm lắng nghe (listener) được đăng ký thông qua phương thức .on(eventName, listener).

#### Sử dụng cơ bản EventEmitter
1. Import module và tạo instance
```
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
```

2. Đăng ký sự kiện với .on()
```
myEmitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});
```

3. Phát sự kiện với .emit()
```
myEmitter.emit('greet', 'Alice');
// Output: Hello, Alice!
```

### Các phương thức quan trọng của EventEmitter
- on(event, listener): Đăng ký một listener cho sự kiện (cũng có thể sử dụng .addListener()).

- .emit(event, [args]): Phát sự kiện, truyền tham số cho listener.

- .once(event, listener): Đăng ký một listener chạy một lần duy nhất khi sự kiện xảy ra.

- .off(event, listener): Gỡ bỏ một listener (tương tự .removeListener()).

- .removeAllListeners(): Xóa tất cả các listener cho một sự kiện hoặc toàn bộ sự kiện.

- .listenerCount(event): Trả về số lượng listener đã đăng ký cho một sự kiện.

- .listeners(event): Trả về danh sách các listener của một sự kiện.

- .rawListeners(event): Trả về danh sách các listener (bao gồm cả listener đã đăng ký qua .once()).


### Xử lý lỗi trong EventEmitter
Nếu một listener phát sinh lỗi, EventEmitter sẽ tìm kiếm một listener cho sự kiện 'error'. Nếu không tìm thấy, Node.js sẽ quăng ngoại lệ và thoát chương trình.

```
myEmitter.on('error', (err) => {
    console.error(`Có lỗi xảy ra: ${err.message}`);
});

myEmitter.emit('error', new Error('Something went wrong'));
// Output: Có lỗi xảy ra: Something went wrong
```

### Mở rộng lớp EventEmitter
Bạn có thể kế thừa từ lớp EventEmitter để tạo các lớp tùy chỉnh:

```
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
    logMessage(msg) {
        console.log(`Log: ${msg}`);
        this.emit('logged', msg);
    }
}

const myEmitter = new MyEmitter();

myEmitter.on('logged', (msg) => {
    console.log(`Received logged message: ${msg}`);
});

myEmitter.logMessage('Hello, Node.js!');
// Output:
// Log: Hello, Node.js!
// Received logged message: Hello, Node.js!
```


### Ứng dụng thực tế của EventEmitter
1. Stream API: Các stream trong Node.js như fs.createReadStream sử dụng EventEmitter để phát các sự kiện như data, end, error.
2. HTTP Server: Module http sử dụng EventEmitter để quản lý các sự kiện như request, response.
3. WebSocket: Xử lý các sự kiện trong giao thức WebSocket.
4. Custom Modules: Sử dụng để giao tiếp giữa các thành phần của ứng dụng.


### Lưu ý khi sử dụng EventEmitter
- Giới hạn số listener: Mặc định, một sự kiện chỉ có tối đa 10 listener để tránh rò rỉ bộ nhớ. Bạn có thể thay đổi giới hạn bằng .setMaxListeners(number).

- Không chặn sự kiện 'error': Hãy luôn lắng nghe sự kiện 'error' để đảm bảo chương trình không bị crash.