import crypto from 'crypto';
import { AppDataSource } from "./data-source";
import { Order } from "./entity/Order";
import { OrderItem } from "./entity/OrderItem";
import { Product } from "./entity/Product";

function generateOrderCode(prefix = 'ORD') {
    // 1. Lấy ngày tháng hiện tại dạng YYMMDD
    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, ''); // Ví dụ: 241027

    // 2. Tạo chuỗi ngẫu nhiên ngắn (8 ký tự) để tránh trùng lặp tuyệt đối
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();

    // 3. Kết hợp: ORD-241027-A1B2C3D4
    return `${prefix}-${datePart}-${randomPart}`;
}

async function createOrder(carts: any[], userId: number, requestId: any) {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
        try {
            // 1. Khởi tạo đơn hàng (Idempotency được xử lý bởi UNIQUE constraint trong DB)
            const newOrder = transactionalEntityManager.create(Order, {
                code: generateOrderCode(),
                user_id: userId, // Hoặc gán nguyên object user nếu có quan hệ
                status: 0,
                request_id: requestId,
                total_amount: 0
            });

            const savedOrder = await transactionalEntityManager.save(newOrder);
            const orderId = savedOrder.id;

            let total = 0;

            // 2. Sắp xếp giỏ hàng để tránh Deadlock (giống logic cũ)
            carts.sort((a, b) => a.productId - b.productId);

            for (const item of carts) {
                // 3. Trừ tồn kho có điều kiện (Atomic Update)
                const updateResult = await transactionalEntityManager
                    .createQueryBuilder()
                    .update(Product)
                    .set({ stock: () => `stock - ${item.quantity}` })
                    .where("id = :id AND stock >= :qty", { id: item.productId, qty: item.quantity })
                    .execute();

                if (updateResult.affected === 0) {
                    throw new Error('OUT_OF_STOCK');
                }

                // 4. Lấy giá sản phẩm hiện tại
                const product = await transactionalEntityManager.findOneBy(Product, { id: item.productId });
                if (!product) throw new Error('PRODUCT_NOT_FOUND');

                const subtotal = product.price * item.quantity;

                // 5. Thêm chi tiết hóa đơn
                const orderItem = transactionalEntityManager.create(OrderItem, {
                    order_id: orderId,
                    product_id: item.productId,
                    quantity: item.quantity,
                    unit_price: product.price
                });
                await transactionalEntityManager.save(orderItem);

                total += subtotal;
            }

            // 6. Cập nhật tổng tiền vào Order
            await transactionalEntityManager.update(Order, orderId, { total_amount: total });

            return { success: true, orderId };

        } catch (e: any) {
            // Xử lý lỗi Duplicate Key (Mã 1062)
            if (e.code === 'ER_DUP_ENTRY' || e.errno === 1062) {
                return { success: false, message: 'Dữ liệu đã tồn tại', type: 'DUPLICATE' };
            }
            
            // Re-throw để TypeORM tự động Rollback
            throw e;
        }
    });
}