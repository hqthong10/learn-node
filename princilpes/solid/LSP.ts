/*
 * L - Liskov Substitution Principle (Nguyên tắc thay thế Liskov)
 * Các đối tượng của một lớp con phải có thể thay thế cho các đối tượng của lớp cha mà không làm thay đổi tính đúng đắn của chương trình.
 * Ví dụ, một lớp Square nên có thể thay thế cho lớp Rectangle mà không làm thay đổi logic ứng dụng.
 */

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
