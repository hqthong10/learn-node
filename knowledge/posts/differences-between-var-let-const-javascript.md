Trong Javascript, bạn có thể khai báo các biến bằng từ các từ khóa var, let, và const. Nhưng sự khác biệt giữa chúng là gì? khi nào sử dụng chúng? Đó là những gì tôi sẽ giải thích trong hướng dẫn này.

### Var 
là từ khóa để khai báo biến trong các phiên bản cũ.
- Phạm vi hoạt động (scope): chỉ có hiệu lực trong function chứa nó (function scope) 
- Hoisting: Được hoisted lên đầu phạm vi nhưng không được khởi tạo.
- Có thể gán lại giá trị
- Có thể khai báo lại

```
console.log(x); // ❌ undefined (do hoisting)
var x = 10;
console.log(x); // ✅ 10

function test() {
    var y = 20;
}
console.log(y); // ❌ Lỗi, vì `var y` chỉ có hiệu lực trong function test()
```

+ var bỏ qua block scope
```
if (true) {
    var a = 5;
}
console.log(a); // ✅ 5 (Không bị giới hạn trong block)
```

## Let
Cách hiện đại, an toàn hơn var

- Phạm vi (scope): Block Scope (Chỉ tồn tại trong {} gần nhất).
- Hoisting: Được hoisted nhưng không khởi tạo (Gặp lỗi nếu truy cập trước khi khai báo).
- Có thể gán lại giá trị
- Không thể khai báo lại (khai báo lại biến cùng tên trong cùng phạm vi sẽ lỗi).
```
console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 10;
console.log(b); // ✅ 10

if (true) {
    let c = 20;
}
console.log(c); // ❌ ReferenceError: c is not defined (vì let có block scope)
```

+ Ưu điểm: Dùng let thay vì var để tránh lỗi do hoisting và scope leak.

### const
Dùng cho giá trị không đổi

- Phạm vi (scope): Block Scope (Như let).
- Hoisting: Được hoisted nhưng không khởi tạo (Lỗi nếu truy cập trước khi khai báo).
- Không thể gán lại giá trị (Không thể gán lại giá trị sau khi khai báo).
- Không thể khai báo lại (Không thể khai báo lại biến cùng tên).

```
const PI = 3.14;
PI = 3.1415; // ❌ TypeError: Assignment to constant variable.
```

+ const chỉ ngăn việc gán lại biến, nhưng nếu biến là object hoặc array, ta vẫn có thể thay đổi nội dung bên trong.
```
const person = { name: "John" };
person.name = "Doe"; // ✅ Hợp lệ (chỉ thay đổi thuộc tính, không gán lại object)

person = {}; // ❌ TypeError: Assignment to constant variable.
```

### So sánh nhanh
Đặc điểm	var	let	const
Phạm vi	Function Scope	Block Scope	Block Scope
Hoisting	Có (khởi tạo undefined)	Có (không khởi tạo)	Có (không khởi tạo)
Gán lại	✅ Có thể gán lại	✅ Có thể gán lại	❌ Không thể gán lại
Khai báo lại	✅ Có thể	❌ Không thể	❌ Không thể
Dùng khi nào?	Không khuyến khích	Dùng cho biến có thể thay đổi	Dùng cho giá trị cố định

### Khi nào dùng let, const hay var?
- Dùng const khi giá trị không thay đổi.
- Dùng let khi cần thay đổi giá trị trong block code.
- Không dùng var, vì có thể gây lỗi do hoisting và scope leak.
