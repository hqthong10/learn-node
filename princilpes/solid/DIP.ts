/**
 * D - Dependency Inversion Principle (Nguyên tắc đảo ngược sự phụ thuộc)
 * Các module cấp cao không nên phụ thuộc vào các module cấp thấp.
 * Cả hai nên phụ thuộc vào các abstraction.
 * Ví dụ, thay vì lớp User trực tiếp thực hiện các thao tác với cơ sở dữ liệu,
 * nó nên phụ thuộc vào một interface Database, cho phép thay đổi cơ sở dữ liệu mà không làm thay đổi lớp User.
 */

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
