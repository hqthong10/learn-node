import mysql from 'mysql2/promise';
import crypto from 'crypto';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    connectionLimit: 10, // Số kết nối tối đa trong hồ
    queueLimit: 0 // Không giới hạn số người đứng chờ
});

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
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // insert order (idempotency bằng UNIQUE)
        const [orderRes]: any = await conn.query(
            `
                INSERT INTO orders (code, user_id, status, request_id)
                VALUES (?, ?, 0, ?)
            `,
            [generateOrderCode(), userId, requestId]
        );

        const orderId = orderRes.insertId;

        let total = 0;

        // sort để tránh deadlock
        carts.sort((a, b) => a.productId - b.productId);

        for (const item of carts) {
            const [res]: any = await conn.query(
                `
                UPDATE products
                SET stock = stock - ?
                WHERE id = ? AND stock >= ?
                `,
                [item.quantity, item.productId, item.quantity]
            );

            if (res.affectedRows === 0) {
                throw new Error('OUT_OF_STOCK');
            }

            const [[product]]: any = await conn.query(
                `
                SELECT price FROM products WHERE id = ?
                `,
                [item.productId]
            );

            const subtotal = product.price * item.quantity;

            await conn.query(
                `
                INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                VALUES (?, ?, ?, ?)
                `,
                [orderId, item.productId, item.quantity, product.price]
            );

            total += subtotal;
        }

        await conn.query(
            `
                UPDATE orders SET total_amount = ? WHERE id = ?
            `,
            [total, orderId]
        );

        await conn.commit();

        return orderId;
    } catch (e: any) {
        try {
            await conn.rollback();
        } catch {}

        // Kiểm tra nếu là lỗi trùng lặp khóa (Duplicate Key)
        if (e.code === 'ER_DUP_ENTRY' || e.errno === 1062) {
            console.error('Mã đơn hàng hoặc Request ID đã tồn tại!');
            return { success: false, message: 'Dữ liệu đã tồn tại', type: 'DUPLICATE' };
        }

        throw e;
    } finally {
        conn.release();
    }
}
