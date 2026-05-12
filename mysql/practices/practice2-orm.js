import crypto from 'crypto';
const { AppDataSource } = require("./data-source");
const UserSchema = require("./entity/UserSchema");
const OrderSchema = require("./entity/OrderSchema");
const OrderItemSchema = require("./entity/OrderItemSchema");
const ProductSchema = require("./entity/ProductSchema");

function generateOrderCode(prefix = 'ORD') {
    // 1. Lấy ngày tháng hiện tại dạng YYMMDD
    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, ''); // Ví dụ: 241027

    // 2. Tạo chuỗi ngẫu nhiên ngắn (8 ký tự) để tránh trùng lặp tuyệt đối
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();

    // 3. Kết hợp: ORD-241027-A1B2C3D4
    return `${prefix}-${datePart}-${randomPart}`;
}

async function createOrder(carts, userId, requestId) {
    // TypeORM sẽ tự động mượn kết nối và quản lý Transaction
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
        try {
            // 1. Tạo đơn hàng mới
            const newOrder = transactionalEntityManager.create(OrderSchema, {
                code: generateOrderCode(),
                user_id: userId,
                status: 0,
                request_id: requestId,
                total_amount: 0
            });

            const savedOrder = await transactionalEntityManager.save(newOrder);
            const orderId = savedOrder.id;

            let total = 0;

            // 2. Sắp xếp để tránh Deadlock
            carts.sort((a, b) => a.productId - b.productId);

            for (const item of carts) {
                // 3. Trừ tồn kho (Atomic Update) - sử dụng QueryBuilder trong transaction
                const updateResult = await transactionalEntityManager
                    .createQueryBuilder()
                    .update(ProductSchema)
                    .set({ stock: () => `stock - ${item.quantity}` })
                    .where("id = :id AND stock >= :qty", { id: item.productId, qty: item.quantity })
                    .execute();

                // Kiểm tra xem có hàng để trừ không
                if (updateResult.affected === 0) {
                    throw new Error('OUT_OF_STOCK');
                }

                // 4. Lấy giá sản phẩm hiện tại
                const product = await transactionalEntityManager.findOneBy(ProductSchema, { id: item.productId });
                if (!product) throw new Error('PRODUCT_NOT_FOUND');

                const subtotal = product.price * item.quantity;

                // 5. Thêm chi tiết đơn hàng
                const orderItem = transactionalEntityManager.create(OrderItemSchema, {
                    order_id: orderId,
                    product_id: item.productId,
                    quantity: item.quantity,
                    unit_price: product.price
                });
                await transactionalEntityManager.save(orderItem);

                total += subtotal;
            }

            // 6. Cập nhật tổng tiền cuối cùng
            await transactionalEntityManager.update(OrderSchema, orderId, { total_amount: total });

            return { success: true, orderId };

        } catch (e) {
            // Xử lý lỗi trùng lặp (Duplicate Key)
            if (e.code === 'ER_DUP_ENTRY' || e.errno === 1062) {
                console.error('Mã đơn hàng hoặc Request ID đã tồn tại!');
                return { success: false, message: 'Dữ liệu đã tồn tại', type: 'DUPLICATE' };
            }

            // Ném lỗi để TypeORM tự động ROLLBACK
            throw e;
        }
    });
}