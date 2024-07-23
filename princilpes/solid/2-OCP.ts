/*
 * O - Open/Closed Principle (Nguyên tắc mở đóng)
 * Phần mở rộng cần phải dễ dàng hơn là sửa đổi mã hiện có.
 * Thay vì chỉnh sửa mã nguồn hiện có, hãy tạo ra các phần mở rộng mới.
 * Ví dụ, bạn có thể tạo ra các lớp kế thừa từ một lớp cơ sở, chứ không phải chỉnh sửa lớp cơ sở đó.
 */

// Example

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
