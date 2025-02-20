# Câu hỏi về JavaScript cơ bản
1. let, const, và var khác nhau như thế nào?
2. Giải thích về hoisting trong JavaScript?
- Hoisting là cơ chế mặc định của JavaScript để di chuyển tất cả các biến và hàm khi khai báo lên đầu scope trước khi chúng được thực thi.
- Lưu ý đối với cơ chế này nó chỉ di chuyển khai báo, còn việc gán giá trị thì giữ nguyên.

3. == và === khác nhau thế nào?
4. null và undefined khác nhau thế nào?
5. Closures là gì? Lấy ví dụ.
6. Giải thích về scope và lexical scope.
7. Callback function là gì?
8. Sự khác nhau giữa synchronous và asynchronous trong JavaScript?
9. Event Loop hoạt động như thế nào?
10. Debounce và Throttle là gì? Khi nào sử dụng?
11. Destructuring, Spread & Rest
- Destructuring:  cho phép bạn "trích xuất" các giá trị từ arrays hoặc objects vào các biến riêng biệt một cách nhanh chóng.
```
const [a, b, c] = numbers;
const [x, , z] = numbers;
const [p, q, r = 10] = [1, 2];
let x = 1, y = 2;
[x, y] = [y, x];

const person = { name: "Alice", age: 25 };
const { name, age } = person;
const { name: fullName, age: years } = person;
const { name, age, country = "USA" } = person;
```

- Spread (Toán tử trải rộng): Spread (...) cho phép "trải rộng" các phần tử của một array hoặc các thuộc tính của một object vào một array/object khác.
```
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Kết hợp mảng
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Sao chép mảng
const copy = [...arr1];
console.log(copy); // [1, 2, 3]

// object
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Kết hợp object
const combined = { ...obj1, ...obj2 };
console.log(combined); // { a: 1, b: 2, c: 3, d: 4 }

// Sao chép object
const copy = { ...obj1 };
console.log(copy); // { a: 1, b: 2 }

// Ghi đè thuộc tính
const updated = { ...obj1, b: 99 };
console.log(updated); // { a: 1, b: 99 }
```

- Rest (Toán tử còn lại): Rest (...) cho phép bạn gom các phần tử còn lại của một array hoặc các thuộc tính còn lại của một object vào một biến?
```
const numbers = [1, 2, 3, 4, 5];

// Gom các phần tử còn lại
const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// Objects
const person = { name: "Alice", age: 25, country: "USA" };

// Gom các thuộc tính còn lại
const { name, ...details } = person;
console.log(name); // Alice
console.log(details); // { age: 25, country: "USA" }

// function
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15
```



# Câu hỏi về ES6+
1. Template literals là gì?

2. Sự khác nhau giữa arrow function và function thông thường?
- cú pháp arrow function ngắn gọn hơn

- Arrow function không có this riêng. this trong arrow function được lexically scoped, nghĩa là nó tham chiếu đến this của phạm vi bên ngoài (nơi arrow function được định nghĩa).
- Function thông thường có this riêng, được xác định bởi cách hàm được gọi

- Arrow function không phù hợp để sử dụng làm phương thức trong object vì this không tham chiếu đến object đó.
- Function thông thường phù hợp để sử dụng làm phương thức trong object vì this tham chiếu đến object đó.

- Arrow function không thể sử dụng làm constructor. Sẽ gây lỗi nếu dùng với new.
- Function thông thường có thể sử dụng làm constructor để tạo đối tượng

- Arrow function không có arguments object riêng. Nếu truy cập arguments, nó sẽ tham chiếu đến arguments của phạm vi bên ngoài.
- Function thông thường có arguments object riêng, chứa tất cả các đối số được truyền vào hàm.

- Arrow function thường được sử dụng trong các phương thức của mảng như map, filter, reduce vì cú pháp ngắn gọn.
- Function thông thường cũng có thể sử dụng, nhưng cú pháp dài hơn.

- Arrow function không được hoisted. Bạn không thể gọi arrow function trước khi nó được định nghĩa.
- Function thông thường được hoisted. Bạn có thể gọi hàm trước khi nó được định nghĩa.

- Arrow function phù hợp cho callback vì this không bị thay đổi.
- Function thông thường cần phải bind this nếu muốn giữ nguyên ngữ cảnh.

3. Rest parameters và spread operator (...) khác nhau thế nào?
- Spread operator (...) cho phép "trải rộng" các phần tử của một array hoặc các thuộc tính của một object vào một array/object khác.
- Rest parameters (...) cho phép bạn gom các phần tử còn lại của một array hoặc các thuộc tính còn lại của một object vào một biến?

4. Destructuring là gì? Lấy ví dụ.
- Destructuring:  cho phép bạn "trích xuất" các giá trị từ arrays hoặc objects vào các biến riêng biệt một cách nhanh chóng.

ví dụ:
```
const [a, b, c] = numbers;
const [x, , z] = numbers;
const [p, q, r = 10] = [1, 2];
let x = 1, y = 2;
[x, y] = [y, x];

const person = { name: "Alice", age: 25 };
const { name, age } = person;
const { name: fullName, age: years } = person;
const { name, age, country = "USA" } = person;
```

5. map(), filter(), và reduce() khác nhau như thế nào?

6. Promise là gì? Các trạng thái của một Promise?
- Promise là một đối tượng đại diện cho một tác vụ bất đồng bộ, có thể hoàn thành (resolve) hoặc thất bại (reject) trong tương lai.
- Promise có ba trạng thái:
+ Pending (Đang chờ): Đây là trạng thái ban đầu của một Promise. Khi một Promise được tạo ra, nó sẽ ở trạng thái pending cho đến khi nó được hoàn thành (resolved) hoặc bị từ chối (rejected).
+ Fulfilled (Đã hoàn thành): Promise chuyển sang trạng thái fulfilled khi nó được resolve thành công. Khi ở trạng thái này, Promise trả về một giá trị (value) mà bạn có thể sử dụng.
+ Rejected (Đã bị từ chối): Promise chuyển sang trạng thái rejected khi nó bị reject (từ chối). Khi ở trạng thái này, Promise trả về một lý do (reason) hoặc thông báo lỗi (error).

7. Sự khác nhau giữa async/await và Promise.then()?
- cú pháp
- cách bắt lỗi

8. Symbol và BigInt là gì?
9. WeakMap và WeakSet là gì?
10. Giải thích về Modules (import/export) trong ES6.

# Câu hỏi về TypeScript
1. TypeScript khác gì với JavaScript?
2. Các kiểu dữ liệu cơ bản trong TypeScript?
3. Sự khác nhau giữa any, unknown, và never?
4. Khi nào sử dụng interface và khi nào sử dụng type?
5. Generics là gì? Lấy ví dụ.
6. Mapped Types là gì?
7. Utility Types phổ biến trong TypeScript (Partial<T>, Readonly<T>, Pick<T>, Omit<T>)?
8. Enum trong TypeScript hoạt động như thế nào?
9. type assertion là gì?
10. Khi nào nên dùng readonly và const?

# Câu hỏi về Object-Oriented Programming (OOP) trong JavaScript/TypeScript
1. Các nguyên lý OOP trong JavaScript?
2. class và prototype khác nhau như thế nào?
3. this trong JavaScript hoạt động như thế nào?
4. Các cách để bind this (call(), apply(), bind()) trong JavaScript?
5. Tính kế thừa (extends và super) trong TypeScript?
6. Sự khác nhau giữa private, protected, và public trong TypeScript?
7. Khi nào dùng abstract class thay vì interface?
8. static trong class có ý nghĩa gì?
9. Decorator trong TypeScript là gì?
10. Tính đa hình (polymorphism) trong TypeScript?

# Câu hỏi về DOM và Event Handling
1. Event bubbling và event capturing là gì?
2. event.preventDefault() và event.stopPropagation() khác nhau thế nào?
3. Sự khác nhau giữa document.querySelector() và getElementById()?
4. Khi nào nên sử dụng event delegation?
5. Khi nào dùng addEventListener() thay vì onclick?

# Câu hỏi về Async JavaScript
1. Microtask queue và macrotask queue khác nhau như thế nào?
2. setTimeout(fn, 0) có thực sự chạy ngay lập tức không?
3. Khi nào nên sử dụng Promise.all(), Promise.race(), Promise.any()?
4. Tại sao await chỉ hoạt động bên trong một async function?
5. Các cách xử lý lỗi khi dùng async/await?

# Câu hỏi về Performance Optimization
1. Kỹ thuật tối ưu hiệu suất JavaScript?
2. Khi nào sử dụng lazy loading?
3. Khi nào nên sử dụng memoization?
4. JavaScript Engine hoạt động như thế nào?
5. Khi nào nên sử dụng Web Workers?

# Câu hỏi về Testing trong JavaScript/TypeScript
1. Sự khác nhau giữa Unit Test, Integration Test và End-to-End Test?
2. Jest và Mocha khác nhau thế nào?
3. Mocking trong testing là gì?
4. Cách kiểm tra một function có bị gọi trong Jest?
5. TDD (Test-Driven Development) là gì?

# Câu hỏi về Security trong JavaScript
1. Các lỗ hổng bảo mật phổ biến trong JavaScript?
2. CORS là gì?
3. XSS (Cross-Site Scripting) và cách phòng tránh?
4. CSRF (Cross-Site Request Forgery) là gì?
5. Khi nào nên sử dụng Content Security Policy (CSP)?

# Câu hỏi về JavaScript Runtime và Build Tools
1. Node.js hoạt động như thế nào?
2. Khi nào nên sử dụng Webpack, Rollup, Parcel?
3. Tree shaking trong Webpack là gì?
4. Khi nào nên dùng Babel?
5. Deno khác gì với Node.js?
