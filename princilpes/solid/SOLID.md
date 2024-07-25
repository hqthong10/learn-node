SOLID là một bộ nguyên tắc thiết kế phần mềm định hình cách bạn cấu trúc mã nguồn của mình.

Nó bao gồm:

- Single Responsibility Principle (SRP): Mỗi module hoặc class nên chỉ có một trách nhiệm duy nhất.
- Open/Closed Principle (OCP): Phần mềm nên mở rộng được mà không cần phải sửa đổi mã nguồn hiện có.
- Liskov Substitution Principle (LSP): Các đối tượng trong chương trình của bạn nên thể hiện đầy đủ khả năng của các lớp cơ sở của chúng.
- Interface Segregation Principle (ISP): Nên tách biệt các giao diện lớn thành các giao diện nhỏ và cụ thể.
- Dependency Inversion Principle (DIP): Module cấp cao không nên phụ thuộc vào module cấp thấp. Cả hai nên phụ thuộc vào abstraction.

### S - Single Responsibility Principle (Nguyên tắc đơn trách nhiệm)
Một module hoặc class nên chỉ có một lý do để thay đổi.

Ví dụ, một lớp User nên chỉ quản lý các hoạt động liên quan đến việc quản lý người dùng, chẳng hạn như đăng nhập, đăng ký, và thay đổi mật khẩu.

```
class Task {
  constructor() {}

  addTask(task: string): void {
    // Logic để thêm một công việc vào hệ thống
  }

  editTask(taskId: number, newTask: string): void {
    // Logic để sửa một công việc trong hệ thống
  }

  deleteTask(taskId: number): void {
    // Logic để xóa một công việc khỏi hệ thống
  }

  getTask(taskId: number): string {
    // Logic để lấy thông tin về một công việc từ hệ thống
    return "";
  }
}

class MyTaskManager {
  constructor() {}

  addTask(task: string): void {
    // Logic để thêm một công việc vào hệ thống
  }

  deleteTask(taskId: number): void {
    // Logic để xóa một công việc khỏi hệ thống
  }
}

class TaskEditor {
  constructor() {}

  editTask(taskId: number, newTask: string): void {
    // Logic để sửa một công việc trong hệ thống
  }

  getTask(taskId: number): string {
    // Logic để lấy thông tin về một công việc từ hệ thống
    return "";
  }
}
```
 
 ### O - Open/Closed Principle (Nguyên tắc mở đóng)
Phần mở rộng cần phải dễ dàng hơn là sửa đổi mã hiện có. Thay vì chỉnh sửa mã nguồn hiện có, hãy tạo ra các phần mở rộng mới.

Ví dụ, bạn có thể tạo ra các lớp kế thừa từ một lớp cơ sở, chứ không phải chỉnh sửa lớp cơ sở đó.

```
// Interface hoặc abstract class định nghĩa phương thức tính toán giảm giá
interface DiscountCalculator {
  calculateDiscount(price: number): number;
}

// Lớp con tính toán giảm giá dựa trên phần trăm
class PercentageDiscountCalculator implements DiscountCalculator {
  private percentage: number;

  constructor(percentage: number) {
    this.percentage = percentage;
  }

  calculateDiscount(price: number): number {
    return price * (this.percentage / 100);
  }
}

// Lớp con tính toán giảm giá dành cho khách hàng VIP
class VipDiscountCalculator implements DiscountCalculator {
  calculateDiscount(price: number): number {
    // Logic tính toán giảm giá cho khách hàng VIP
    return price * 0.1; // Giả sử giảm 10% cho VIP
  }
}

// Sử dụng tính năng tính toán giảm giá mà không cần sửa đổi mã nguồn hiện có
function applyDiscount(
  price: number,
  discountCalculator: DiscountCalculator
): number {
  const discount = discountCalculator.calculateDiscount(price);
  return price - discount;
}

// Sử dụng các lớp tính toán giảm giá
const originalPrice = 100;
const percentageDiscount = new PercentageDiscountCalculator(20); // Giảm giá 20%
const vipDiscount = new VipDiscountCalculator();

console.log("Original price:", originalPrice);
console.log(
  "Price after percentage discount:",
  applyDiscount(originalPrice, percentageDiscount)
);
console.log(
  "Price after VIP discount:",
  applyDiscount(originalPrice, vipDiscount)
);
```

### L - Liskov Substitution Principle (Nguyên tắc thay thế Liskov)
Các đối tượng của một lớp con phải có thể thay thế cho các đối tượng của lớp cha mà không làm thay đổi tính đúng đắn của chương trình.

Ví dụ, một lớp Square nên có thể thay thế cho lớp Rectangle mà không làm thay đổi logic ứng dụng.

```
class Rectangle {
  protected width: number;
  protected height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  // Phương thức để thay đổi kích thước của hình chữ nhật
  resize(newWidth: number, newHeight: number): void {
    this.width = newWidth;
    this.height = newHeight;
  }
}

class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }

  // Phương thức resize không thích hợp cho hình vuông
  resize(newSize: number): void {
    this.width = newSize;
    this.height = newSize;
  }
}

function printArea(rectangle: Rectangle): void {
  console.log("Area:", rectangle.getWidth() * rectangle.getHeight());
}

const rectangle = new Rectangle(3, 4);
const square = new Square(5);

printArea(rectangle); // Kết quả: 12
printArea(square); // Kết quả: 25 (Thực tế: 20)
```

### I - Interface Segregation Principle (Nguyên tắc phân chia giao diện)
Không nên buộc các client phải phụ thuộc vào các phương thức mà họ không sử dụng. Thay vào đó, hãy tách giao diện thành các giao diện nhỏ hơn và phân phối chỉ cho những ai cần chúng.

Ví dụ, hãy tách một interface lớn thành các interface nhỏ hơn, dễ quản lý.

```
interface EmployeeManagement {
  addEmployee(employee: Employee): void;
  deleteEmployee(employeeId: number): void;
  updateEmployee(employeeId: number, data: any): void;
  getEmployeeDetails(employeeId: number): Employee;
  calculateSalary(employeeId: number): number;
}

class HRDepartment implements EmployeeManagement {
  addEmployee(employee: Employee): void {
    // Logic để thêm một nhân viên mới vào hệ thống
  }

  deleteEmployee(employeeId: number): void {
    // Logic để xóa một nhân viên khỏi hệ thống
  }

  updateEmployee(employeeId: number, data: any): void {
    // Logic để cập nhật thông tin của một nhân viên
  }

  getEmployeeDetails(employeeId: number): Employee {
    // Logic để lấy thông tin chi tiết của một nhân viên
    return new Employee();
  }

  calculateSalary(employeeId: number): number {
    // Logic để tính toán lương của một nhân viên
    return 0;
  }
}

// convert

interface EmployeeOperations {
  addEmployee(employee: Employee): void;
  deleteEmployee(employeeId: number): void;
  updateEmployee(employeeId: number, data: any): void;
  getEmployeeDetails(employeeId: number): Employee;
}

interface SalaryCalculator {
  calculateSalary(employeeId: number): number;
}

class HRDepartment implements EmployeeOperations, SalaryCalculator {
  addEmployee(employee: Employee): void {
    // Logic để thêm một nhân viên mới vào hệ thống
  }

  deleteEmployee(employeeId: number): void {
    // Logic để xóa một nhân viên khỏi hệ thống
  }

  updateEmployee(employeeId: number, data: any): void {
    // Logic để cập nhật thông tin của một nhân viên
  }

  getEmployeeDetails(employeeId: number): Employee {
    // Logic để lấy thông tin chi tiết của một nhân viên
    return new Employee();
  }

  calculateSalary(employeeId: number): number {
    // Logic để tính toán lương của một nhân viên
    return 0;
  }
}
```

### D - Dependency Inversion Principle (Nguyên tắc đảo ngược sự phụ thuộc)
Các module cấp cao không nên phụ thuộc vào các module cấp thấp. Cả hai nên phụ thuộc vào các abstraction.

Ví dụ, thay vì lớp User trực tiếp thực hiện các thao tác với cơ sở dữ liệu, nó nên phụ thuộc vào một interface Database, cho phép thay đổi cơ sở dữ liệu mà không làm thay đổi lớp User.

```
class DatabaseService_No {
  constructor() {}

  saveTask(task: Task): void {
    // Logic để lưu một công việc vào cơ sở dữ liệu
  }

  getTask(taskId: number): Task {
    // Logic để lấy thông tin về một công việc từ cơ sở dữ liệu
    return new Task();
  }
}

class TaskManager_No {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = new DatabaseService();
  }

  addTask(task: Task): void {
    this.dbService.saveTask(task);
  }

  getTask(taskId: number): Task {
    return this.dbService.getTask(taskId);
  }
}

interface DataService {
  saveTask(task: Task): void;
  getTask(taskId: number): Task;
}

class DatabaseService implements DataService {
  constructor() {}

  saveTask(task: Task): void {
    // Logic để lưu một công việc vào cơ sở dữ liệu
  }

  getTask(taskId: number): Task {
    // Logic để lấy thông tin về một công việc từ cơ sở dữ liệu
    return new Task();
  }
}

class TaskManager {
  private dbService: DataService;

  constructor(dataService: DataService) {
    this.dbService = dataService;
  }

  addTask(task: Task): void {
    this.dbService.saveTask(task);
  }

  getTask(taskId: number): Task {
    return this.dbService.getTask(taskId);
  }
}
```