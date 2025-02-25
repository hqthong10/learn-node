Factory Function là một hàm trả về một object mới mỗi khi được gọi, giống như một "nhà máy" sản xuất object. Factory Function giúp tạo nhiều object có cấu trúc giống nhau mà không cần dùng đến class hoặc new.

### Cách tạo một Factory Function.
Ví dụ, tạo một Factory Function để tạo đối tượng người dùng:
```
function createUser(name, age) {
    return {
        name,
        age,
        greet() {
            console.log(`Xin chào, tôi là ${this.name}, ${this.age} tuổi.`);
        }
    };
}

// Tạo nhiều user từ factory function
const user1 = createUser("Alice", 25);
const user2 = createUser("Bob", 30);

user1.greet(); // ✅ Xin chào, tôi là Alice, 25 tuổi.
user2.greet(); // ✅ Xin chào, tôi là Bob, 30 tuổi.
```

### Sử dụng Factory Function với Private Variables (Đóng gói dữ liệu)
Một lợi thế của Factory Function là có thể đóng gói dữ liệu bằng cách sử dụng closure, giúp tạo biến private mà không thể truy cập trực tiếp từ bên ngoài.
```
function createCounter() {
    let count = 0; // Biến private

    return {
        increment() {
            count++;
            console.log(`Count: ${count}`);
        },
        decrement() {
            count--;
            console.log(`Count: ${count}`);
        },
        getCount() {
            return count;
        }
    };
}

const counter = createCounter();
counter.increment(); // ✅ Count: 1
counter.increment(); // ✅ Count: 2
console.log(counter.getCount()); // ✅ 2

console.log(counter.count); // ❌ undefined (Không truy cập được trực tiếp)
```

### Factory Function với Object.create()
Nếu muốn kế thừa và tối ưu bộ nhớ, có thể kết hợp với Object.create(), giúp chia sẻ phương thức giữa nhiều object.
```
const userMethods = {
    greet() {
        console.log(`Xin chào, tôi là ${this.name}`);
    }
};

function createUser(name, age) {
    const user = Object.create(userMethods);
    user.name = name;
    user.age = age;
    return user;
}

const user3 = createUser("David", 35);
user3.greet(); // ✅ Xin chào, tôi là David
```
Không tạo lại phương thức mới trong mỗi object, tiết kiệm bộ nhớ.