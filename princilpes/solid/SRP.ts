/*
 * S - Single Responsibility Principle (Nguyên tắc đơn trách nhiệm)
 * Một module hoặc class nên chỉ có một lý do để thay đổi.
 * Ví dụ, một lớp User nên chỉ quản lý các hoạt động liên quan đến việc quản lý người dùng,
 * chẳng hạn như đăng nhập, đăng ký, và thay đổi mật khẩu.
 */

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
