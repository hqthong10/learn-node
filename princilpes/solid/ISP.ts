/**
 * I - Interface Segregation Principle (Nguyên tắc phân chia giao diện)
 * Không nên buộc các client phải phụ thuộc vào các phương thức mà họ không sử dụng.
 * Thay vào đó, hãy tách giao diện thành các giao diện nhỏ hơn và phân phối chỉ cho những ai cần chúng.
 * Ví dụ, hãy tách một interface lớn thành các interface nhỏ hơn, dễ quản lý.
 */

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
