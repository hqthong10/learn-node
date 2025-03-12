# [v] let, const, và var khác nhau như thế nào?
- var có phạm vi function scope và global scope. Có thể khai báo lại và gán lại mà không bị lỗi. var được hoisted nhưng gán giá trị undefined trước khi nó thực sự được gán giá trị.
- let có phạm vi block scope, nghĩa là nó chỉ tồn tại trong cặp {}. let không thể khai báo lại trong cùng một phạm vi nhưng có thể gán lại giá trị. let được hoisted nhưng không thể sử dụng trước khi khai báo do Temporal Dead Zone (TDZ).
- const cũng có block scope như let. const phải được gán giá trị khi khai báo. const không thể gán lại giá trị mới sau khi đã khai báo. Tuy nhiên, nếu const là một object hoặc array, ta vẫn có thể thay đổi nội dung bên trong nó.

# [v] Giải thích về hoisting trong JavaScript?
- Hoisting là cơ chế mặc định của JavaScript để di chuyển tất cả các biến và hàm khi khai báo lên đầu scope trước khi chúng được thực thi.
- Lưu ý đối với cơ chế này nó chỉ di chuyển khai báo, còn việc gán giá trị thì giữ nguyên.

# [v] == và === khác nhau thế nào?
- ‘==’ là so sánh bằng lỏng lẻo (loose equality). Có chuyển đổi kiểu dữ liệu.
- ‘===’ là so sánh bằng chặt chẽ (strict equality). Không chuyển đổi kiểu dữ liệu. Chỉ bằng nhau nếu giá trị và kiểu dữ liệu giống nhau
```
    5 == "5" = true
    5 === "5" = false

    0 == false = true
    0 === false = false

    null == undefined = true
    null === undefined = false
```

# [v] null và undefined khác nhau thế nào?
- null biểu thị “không có giá trị”. Kiểu dữ liệu object. được gán = null
- undefined biểu thị “không được khai báo” hoặc “chưa có giá trị”. Kiểu dữ liệu undefined, không thể gán trược tiếp = undefined

# [v] Closures là gì? Lấy ví dụ.
- Closures là một hàm có thể nhớ và truy cập các biến trong phạm vi của nó ngay cả khi hàm đó được gọi bên ngoài phạm vi ban đầu.
- Nói cách khác, closures giúp một hàm “nhớ” được môi trường nơi nó được tạo ra
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

# [v] Giải thích về scope và lexical scope.
- Scope (phạm vi biến) trong JavaScript xác định nơi một biến có thể được truy cập trong mã của bạn.
- Có 3 loại scope chính:
    + Global Scope (Phạm vi toàn cục)
    + Function Scope (Phạm vi hàm)
    + Block Scope (Phạm vi khối - từ ES6)
- Lexical Scope (Phạm vi từ vựng) có nghĩa là một hàm có thể truy cập các biến trong phạm vi chứa nó (tức là nơi nó được định nghĩa, không phải nơi nó được gọi). Hàm con có thể truy cập biến của hàm cha dựa vào nơi nó được định nghĩa.

# [v] Callback function là gì?
- Callback function là một hàm được truyền vào một hàm khác như một đối số, và sẽ được gọi lại (callback) sau khi hàm chứa nó hoàn thành công việc.
- Callback giúp xử lý bất đồng bộ, tái sử dụng mã, và tăng tính linh hoạt của chương trình.

# [v] Sự khác nhau giữa synchronous và asynchronous trong JavaScript?
- Synchronous (Đồng bộ)
    + Mã chạy theo thứ tự từ trên xuống dưới.
    + Chặn chương trình cho đến khi câu lệnh hiện tại hoàn thành.
    + Nếu một tác vụ mất nhiều thời gian (như đọc file, gọi API), nó sẽ
    + chặn toàn bộ chương trình.

- Asynchronous (Bất đồng bộ)
    + Không chặn chương trình, cho phép tiếp tục chạy các tác vụ khác trong khi chờ một tác vụ hoàn thành.
    + Dùng cho các tác vụ tốn thời gian như gọi API, đọc file, xử lý dữ liệu lớn.
    + JavaScript dùng Callback, Promise, và Async/Await để xử lý bất đồng bộ.

# Event Loop hoạt động như thế nào?
-- Vòng lặp sự kiện trong Node.js hay còn gọi là Event Loop cho phép Nodejs thực hiện nhiều thao tác cùng một lúc, Nodejs có thể một lúc xử lý cả ngàn request dù chỉ dùng một thread duy nhất. Vòng lặp sự kiện trong Node.js cho phép Node.js thực hiện những hoạt động I/O không chặn. Về bản chất thì Node.js là một ứng dụng đơn luồng, nhưng Node.js có thể hỗ trợ xử lý đồng thời thông qua định nghĩa về event và callbacks. Mọi API của Node.js là không đồng bộ và là một luồng, chúng sử dụng async function calls để duy trì đồng thời.

- Event Loop chính là cơ chế giúp JavaScript thực hiện xử lý được bất đồng bộ mà không bị chặn
- JavaScript sử dụng Event Loop để quản lý việc thực thi mã, bao gồm:
+ Call Stack (Ngăn xếp thực thi)
+ Web APIs / Background Tasks (Tác vụ nền)
+ Callback Queue (Hàng đợi callback)
+ Microtask Queue (Hàng đợi microtask - ưu tiên cao hơn callback queue)

- Call Stack: Chứa các hàm đang thực thi.
- Web APIs: Khi một tác vụ bất đồng bộ (như setTimeout, fetch) được gọi, nó được xử lý bởi trình duyệt hoặc Node.js.
3️⃣ Callback Queue: Khi tác vụ hoàn thành, callback của nó được đưa vào hàng đợi.
4️⃣ Microtask Queue: Chứa các Promise .then() và process.nextTick() (trong Node.js).
5️⃣ Event Loop: Liên tục kiểm tra nếu Call Stack rỗng thì lấy các hàm từ Microtask Queue (trước) hoặc Callback Queue (sau) để đưa vào Call Stack.

# [v] Debounce và Throttle là gì? Khi nào sử dụng?
- Debounce trì hoãn việc thực thi một hàm cho đến khi sự kiện cuối cùng kết thúc một khoảng thời gian nhất định. Ví dụ: Khi gõ văn bản vào ô tìm kiếm, API chỉ nên gọi sau khi người dùng dừng gõ khoảng 300ms, tránh gọi quá nhiều request không cần thiết.

- Throttle giới hạn số lần một hàm được gọi trong một khoảng thời gian nhất định, ngay cả khi sự kiện liên tục được kích hoạt. Ví dụ: Khi người dùng scroll, thay vì gọi sự kiện liên tục, ta chỉ muốn mỗi 200ms cập nhật vị trí cuộn một lần.

# [v] Destructuring, Spread & Rest
- Destructuring: cho phép bạn “trích xuất” các giá trị từ arrays hoặc objects vào các biến riêng biệt một cách nhanh chóng.
- Spread (Toán tử trải rộng): Spread (…) cho phép “trải rộng” các phần tử của một array hoặc các thuộc tính của một object vào một array/object khác.
- Rest (Toán tử còn lại): Rest (…) cho phép bạn gom các phần tử còn lại của một array hoặc các thuộc tính còn lại của một object vào một biến?

# [v] Template literals là gì?
- emplate literasl là một tính năng cho phép làm việc với chuỗi theo cách thuận tiện.
- sử dụng dấu backtick `...` thay vì dùng dấu nháy đơn ‘…’ hoặc nháy kép “…”
- Cho phép bạn nhúng các biến và biểu thức vào trong chuỗi của mình.
- Hỗ trợ xuống dòng mà không cần \n.
- dễ dàng nối chuỗi hơn

# [v] Sự khác nhau giữa arrow function và function thông thường?
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

# Rest parameters và spread operator (...) khác nhau thế nào?

# [v] map(), filter(), và reduce() khác nhau như thế nào?
- map() Biến đổi từng phần tử của mảng
    + Duyệt qua từng phần tử của mảng
    + Trả về một mảng mới với số phần tử bằng với mảng ban đầu.
    + Không thay đổi mảng gốc.

- filter() Lọc ra các phần tử thỏa điều kiện
    + Duyệt qua từng phần tử của mảng
    + Trả về một mảng mới chỉ chứa các phần tử thỏa mãn điều kiện.
    + Không thay đổi mảng gốc.

- reduce() Tổng hợp giá trị từ mảng
    + Duyệt qua từng phần tử của mảng
    + Tích lũy giá trị vào một biến kết quả (accumulator).
    + Trả về một giá trị duy nhất (có thể là số, object, array,…).
    + Không thay đổi mảng gốc.

# [v] Promise là gì? Các trạng thái của một Promise?
- Promise là một đối tượng đại diện cho một tác vụ bất đồng bộ, có thể hoàn thành (resolve) hoặc thất bại (reject) trong tương lai.
- Promise có ba trạng thái:
    + Pending (Đang chờ): Đây là trạng thái ban đầu của một Promise. Khi một Promise được tạo ra, nó sẽ ở trạng thái pending cho đến khi nó được hoàn thành (resolved) hoặc bị từ chối (rejected).
    + Fulfilled (Đã hoàn thành): Promise chuyển sang trạng thái fulfilled khi nó được resolve thành công. Khi ở trạng thái này, Promise trả về một giá trị (value) mà bạn có thể sử dụng.
    + Rejected (Đã bị từ chối): Promise chuyển sang trạng thái rejected khi nó bị reject (từ chối). Khi ở trạng thái này, Promise trả về một lý do (reason) hoặc thông báo lỗi (error).

# [v] Sự khác nhau giữa async/await và Promise.then()?
- cú pháp
- cách bắt lỗi

# [v] Symbol và BigInt là gì?
Symbol là một kiểu dữ liệu nguyên thủy (primitive type) trong JavaScript, được giới thiệu từ ES6.
Symbol tạo ra một giá trị duy nhất, không trùng lặp
Không thể tự động chuyển đổi sang string hoặc number
Thường dùng để tạo key duy nhất trong Object mà không bị ghi đè.

BigInt là kiểu dữ liệu được giới thiệu từ ES11 (ES2020) để lưu trữ các số nguyên cực lớn, vượt quá giới hạn của Number.MAX_SAFE_INTEGER (2⁵³ - 1).
BigInt được tạo bằng cách thêm hậu tố n vào số nguyên.
Không thể sử dụng BigInt với Number thông thường (phải ép kiểu).

# [v] WeakMap và WeakSet là gì?
WeakMap và WeakSet là hai kiểu dữ liệu đặc biệt trong JavaScript có các đặc điểm khác biệt so với Map và Set. Chúng được gọi là “weak” (yếu) vì chúng không giữ mạnh các tham chiếu đến các đối tượng.

- WeakMap:
WeakMap là một dạng Map nhưng chỉ chấp nhận Object làm key.
Các key trong WeakMap có thể bị tự động xoá (garbage collected) nếu không còn tham chiếu đến nó ở nơi nào khác trong code.
Không thể lặp qua WeakMap vì nó không hỗ trợ phương thức .keys(), .values(), hay .entries().

- WeakSet:
WeakSet là một dạng Set nhưng chỉ chứa các Object.
Các phần tử trong WeakSet có thể bị tự động xoá (garbage collected) nếu không còn tham chiếu đến nó.
Không thể lặp qua WeakSet vì nó không hỗ trợ .values() hoặc .entries().

# [v] Giải thích về Modules (import/export) trong ES6.
Modules trong ES6 (ECMAScript 2015) là một cách để tổ chức và quản lý code JavaScript bằng cách chia nhỏ code thành các tệp (files) riêng biệt, mỗi tệp có thể chứa các hàm, biến, lớp, hoặc đối tượng. Các tệp này có thể được import (nhập) và export (xuất) để sử dụng lại code một cách linh hoạt và hiệu quả.

# [v] Các nguyên lý OOP trong JavaScript?
- Encapsulation (Đóng gói): Đóng gói là việc giới hạn quyền truy cập vào dữ liệu bên trong object, chỉ cho phép truy cập thông qua các phương thức cụ thể.
- Abstraction (Trừu tượng hóa): Trừu tượng hóa là việc ẩn đi chi tiết bên trong và chỉ để lộ những thứ cần thiết cho bên ngoài sử dụng.
- Inheritance (Kế thừa): Kế thừa giúp một class con có thể mở rộng class cha mà không cần viết lại toàn bộ code.
- Polymorphism (Đa hình): Đa hình cho phép sử dụng cùng một phương thức nhưng có thể hoạt động khác nhau tùy thuộc vào object cụ thể.

# class và prototype khác nhau như thế nào?
class chỉ là "syntactic sugar" của prototype

# this trong JavaScript hoạt động như thế nào?
Trong JavaScript, từ khóa this dùng để tham chiếu đến context (ngữ cảnh) mà nó đang được gọi. Tuy nhiên, giá trị của this thay đổi tùy vào cách hàm được gọi.

# [v] Các cách để bind this (call(), apply(), bind()) trong JavaScript?

# [v] Khi nào dùng abstract class thay vì interface?

# [v] static trong class có ý nghĩa gì?
- Thuộc tính và phương thức static thuộc về class, không phải instance.
- Không cần tạo instance của class để sử dụng.
- Không thể truy cập this (vì this trong class trỏ đến instance, mà static thuộc về class).
- Thường được dùng để lưu trữ giá trị hoặc hàm tiện ích chung.

# [v] Event bubbling và event capturing là gì?

# event.preventDefault() và event.stopPropagation() khác nhau thế nào?
- event.preventDefault()
    + Chặn hành vi mặc định của trình duyệt đối với một sự kiện.
    + Không ngăn sự kiện lan truyền (bubbling hoặc capturing).
    + Thường dùng khi muốn ngăn các hành vi mặc định như: Chặn gửi form (submit event), Chặn mở link (click event trên <a> tag), Chặn kéo thả file (dragover event)
- event.stopPropagation()
    + Ngăn sự kiện tiếp tục lan truyền (bubbling hoặc capturing) lên các phần tử cha.
    + Không chặn hành vi mặc định của trình duyệt.

# Sự khác nhau giữa document.querySelector() và getElementById()?
- document.querySelector()
    + Chọn phần tử đầu tiên phù hợp với CSS selector.
    + Có thể chọn bằng id (#id), class (.class), tag (div), attribute ([type="text"]), v.v.
    + Hỗ trợ tất cả các CSS selector.
- document.getElementById()
    + Chọn phần tử duy nhất theo id.
    + Không cần dấu # khi chọn id.
    + Nhanh hơn querySelector() vì nó chỉ tìm theo id, không phải parse CSS selector.

# Khi nào nên sử dụng event delegation?
- Event Delegation là một kỹ thuật trong JavaScript giúp xử lý sự kiện một cách hiệu quả bằng cách gán sự kiện cho phần tử cha thay vì từng phần tử con.
- Khi có nhiều phần tử con động (Dynamic Elements)
- Khi có nhiều phần tử con (Performance Optimization)
- Khi cần xử lý sự kiện trên các phần tử con cụ thể

# Khi nào dùng addEventListener() thay vì onclick?
1. Khi cần thêm nhiều trình xử lý sự kiện trên cùng một phần tử
- addEventListener() cho phép gán nhiều hàm xử lý sự kiện trên cùng một phần tử, trong khi onclick chỉ có thể gán một hàm duy nhất (ghi đè lên bất kỳ hàm nào trước đó).
2. Khi cần gỡ bỏ sự kiện bằng removeEventListener()
3. Khi cần lắng nghe nhiều loại sự kiện khác nhau
4. Khi cần sử dụng capture hoặc once
5. Khi cần dùng Event Delegation

# Microtask queue và macrotask queue khác nhau như thế nào?
Trong JavaScript, khi một bất đồng bộ (asynchronous task) được lên lịch để thực thi, nó sẽ được đẩy vào một trong hai hàng đợi (queue):
- Microtask Queue (Hàng đợi vi tác vụ)
- Macrotask Queue (Hàng đợi đại tác vụ)
Cả hai queue này đều được xử lý trong Event Loop, nhưng có sự khác biệt quan trọng.

- Microtask Queue là gì?
    Microtasks được thực thi ngay sau khi call stack trống nhưng trước khi xử lý bất kỳ macrotask nào.

    Ví dụ các Microtasks trong JavaScript:
        Promises (.then, .catch, .finally)
        MutationObserver
        queueMicrotask()
    Quy tắc xử lý:
        Khi call stack rỗng, JavaScript sẽ ưu tiên xử lý tất cả microtasks trước.
        Nếu trong quá trình xử lý microtask có thêm microtask mới, nó sẽ được thêm vào queue và tiếp tục xử lý ngay lập tức trước khi chuyển sang macrotask.
- Macrotask Queue là gì?
    Macrotasks chạy sau khi tất cả microtasks đã hoàn thành.
        
    Ví dụ các Macrotasks trong JavaScript:
        setTimeout / setInterval
        setImmediate (Node.js)
        requestAnimationFrame (trong trình duyệt)
        I/O tasks (như đọc file, mạng, database...)
    Quy tắc xử lý:
        - Sau mỗi vòng của event loop, JavaScript sẽ ưu tiên xử lý tất cả microtasks trước.
        - Sau khi tất cả microtasks hoàn thành, event loop mới lấy một macrotask từ macrotask queue để xử lý.

# [v] setTimeout(fn, 0) có thực sự chạy ngay lập tức không?
- không

# Khi nào nên sử dụng Promise.all(), Promise.race(), Promise.any()?
- Promise.all() kết thúc khi tất cả Promise resovle hoặc có 1 Promise reject
- Promise.allSettled luôn luôn resolve kể cả khi có promise reject trong mảng
- Promise.race sẽ trả về kết quả ngay khi có một promise trong mảng trả về kết quả settled (fulfilled or rejected) và không quan tâm đến promise khác nữa
- Promise.any trả về resolve khi có ít nhất một promise trả về fulfilled và chỉ trả về reject khi tất cả promise đều là reject

# Tại sao await chỉ hoạt động bên trong một async function?

# Các cách xử lý lỗi khi dùng async/await?

# Kỹ thuật tối ưu hiệu suất JavaScript?

# Khi nào sử dụng lazy loading?

# Khi nào nên sử dụng memoization?

# JavaScript Engine hoạt động như thế nào?

# Khi nào nên sử dụng Web Workers?

# Sự khác nhau giữa Unit Test, Integration Test và End-to-End Test?

# Jest và Mocha khác nhau thế nào?

# Mocking trong testing là gì?

# Cách kiểm tra một function có bị gọi trong Jest?

# TDD (Test-Driven Development) là gì?

# Các lỗ hổng bảo mật phổ biến trong JavaScript?

# CORS là gì?

# XSS (Cross-Site Scripting) và cách phòng tránh?

# CSRF (Cross-Site Request Forgery) là gì?

# Khi nào nên sử dụng Content Security Policy (CSP)?

# Node.js hoạt động như thế nào?

# Khi nào nên sử dụng Webpack, Rollup, Parcel?

# Tree shaking trong Webpack là gì?

# Khi nào nên dùng Babel?

# Deno khác gì với Node.js?
