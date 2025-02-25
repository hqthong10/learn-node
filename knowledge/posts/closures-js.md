- Closures là một hàm có thể nhớ và truy cập các biến trong phạm vi của nó ngay cả khi hàm đó được gọi bên ngoài phạm vi ban đầu.
- Nói cách khác, closures giúp một hàm "nhớ" được môi trường nơi nó được tạo ra.

### Ví dụ đơn giản về Closures
```
function outerFunction() {
    let outerVariable = "I'm from outer!";

    function innerFunction() {
        console.log(outerVariable); // Truy cập biến từ outerFunction
    }

    return innerFunction; // Trả về hàm innerFunction mà không gọi ngay
}

const closureExample = outerFunction(); // Gọi outerFunction, nhận lại innerFunction
closureExample(); // "I'm from outer!"
```

### Ứng dụng của Closures
#### Tạo biến private (ẩn thông tin)
```
function createCounter() {
    let count = 0; // Biến private

    return {
        increment: function () {
            count++;
            console.log(count);
        },
        decrement: function () {
            count--;
            console.log(count);
        }
    };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
```
count không thể bị truy cập trực tiếp từ bên ngoài, chỉ có thể thay đổi thông qua increment() và decrement().

#### Tạo factory function
```
function createMultiplier(multiplier) {
    return function (num) {
        return num * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```
double và triple là các closures giữ giá trị multiplier riêng của chúng.

#### Debounce một function (hạn chế gọi liên tục)
```
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const log = debounce(() => console.log("Hello!"), 1000);
log();
log();
log(); // Chỉ chạy 1 lần sau 1 giây
```
Hàm debounce() tạo ra một closure giúp hạn chế số lần gọi hàm, hữu ích khi xử lý sự kiện input.