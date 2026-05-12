// API: Tạo order + trừ stock sản phẩm
// Yêu cầu business khi user đặt hàng:
// - tạo order
// - tạo order_items
// - trừ stock trong menu_items

async function makeOrder(userID, carts, discountCodes, requestId, restaurantId) {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [restaurantResult] = await conn.execute(`
                SELECT id, name
                FROM restaurants
                WHERE id = ?
            `, [restaurantId]);

        const restaurantName = restaurantResult?.[0]?.name || null;
        if (restaurantName == null) {
            throw new Error('RESTAURANT_NOT_EXIST');
        }

        let totalAmount = 0;
        let discountAmount = 0;

        for(const cart of carts) {
            totalAmount +=  cart.quantity * cart.price;
        }

        const discountApply = [];

        if(discountCodes.length > 0) {
            const placeholders = discountCodes.map(() => '?').join(',');
            const [discountResult] = await conn.execute(`
                    SELECT id, code, discount_type, discount_value, max_discount_amount, min_order_value
                    FROM promotions
                    WHERE code in (${placeholders}) and status = 1
                `, discountCodes);
            if (discountResult.length != discountCodes.length) {
                    throw new Error('DISCOUNT_ERROR');
            }
            
            for(const promotion in discountResult) {
                let = discountValue = 0;
                if(promotion.discount_type == 'percentage') {
                    let discountTemp = totalAmount / 100 * promotion.discount_value;
                    if (totalAmount < promotion.min_order_value) {
                            continue; // không áp dụng
                    }
                    discountTemp > promotion.max_discount_amount && (discountTemp = promotion.max_discount_amount);
                    discountValue = discountTemp;
                } else if(promotion.discount_type == 'fixed_amount') {
                    discountValue = promotion.discount_value;
                }
                discountAmount += discountValue;
                discountApply.push({
                    id: promotion.id,
                    code: promotion.code,
                    amount: discountValue,
                })
            }
        }

        const finalAmount = totalAmount - discountAmount;
    
        // tạo order
        const [orderResult] = await conn.execute(
            `INSERT INTO orders (code, user_id, restaurant_id, restaurant_name, total_amount, discount_amount, final_amount, status, request_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
            [genertateOrderCode(), userID, restaurantId, restaurantName, totalAmount, discountAmount, finalAmount, requestId]
        );

        const orderId = orderResult.insertId;

        
        for (const cart of carts) {
            // trừ stock trong menu_items
            const [resUpdate] = await conn.query(`
                UPDATE menu_items
                SET stock = stock - ?
                WHERE id = ? AND stock >= ?
            `,[cart.quantity, cart.productId, cart.quantity]);

            if (resUpdate.affectedRows === 0) {
                throw new Error('OUT_OF_STOCK');
            }

            // tạo order_items
            await conn.execute(`
                INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
                VALUES (?, ?, ?, ?, ?)
            `, [orderId, cart.productId, cart.quantity, cart.price, cart.quantity*cart.price]);
        }

        if(discountApply.length > 0) {
            // tạo order_promotions
            for(const discount of discountApply) {
                await conn.execute(`
                INSERT INTO order_promotions (order_id, promotion_id, discount_amount)
                VALUES (?, ?, ?)
            `, [orderId, discount.id, discount.amount]);
            }
        }

        await conn.commit();

        return orderId;
    } catch (e) {
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

async function makeOrder_AI_Anwser(userId, carts, requestId, restaurantId) {
  const conn = await pool.getConnection();

  try {
    // 🔹 1. Idempotency check (production-safe)
    const [exist] = await conn.execute(
      `SELECT id FROM orders WHERE request_id = ?`,
      [requestId]
    );
    if (exist.length) return exist[0].id;

    await conn.beginTransaction();

    // 🔹 2. Validate restaurant
    const [[restaurant]] = await conn.execute(
      `SELECT id, name FROM restaurants WHERE id = ?`,
      [restaurantId]
    );
    if (!restaurant) throw new Error('RESTAURANT_NOT_EXIST');

    // 🔹 3. Tính total (KHÔNG trust price client → lấy từ DB)
    const productIds = carts.map(c => c.productId);
    const placeholders = productIds.map(() => '?').join(',');

    const [products] = await conn.execute(
      `SELECT id, price, stock 
       FROM menu_items 
       WHERE id IN (${placeholders})`,
      productIds
    );

    const productMap = new Map(products.map(p => [p.id, p]));

    let totalAmount = 0;

    for (const cart of carts) {
      const product = productMap.get(cart.productId);
      if (!product) throw new Error('PRODUCT_NOT_EXIST');

      totalAmount += product.price * cart.quantity;
    }

    const finalAmount = totalAmount;

    // 🔹 4. Insert order
    const [orderResult] = await conn.execute(
      `INSERT INTO orders 
      (code, user_id, restaurant_id, restaurant_name, total_amount, final_amount, status, request_id)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        generateOrderCode(),
        userId,
        restaurantId,
        restaurant.name,
        totalAmount,
        finalAmount,
        requestId
      ]
    );

    const orderId = orderResult.insertId;

    // 🔹 5. Update stock (ATOMIC)
    for (const cart of carts) {
      const [res] = await conn.execute(
        `UPDATE menu_items
         SET stock = stock - ?
         WHERE id = ? AND stock >= ?`,
        [cart.quantity, cart.productId, cart.quantity]
      );

      if (res.affectedRows === 0) {
        // 🔥 phân biệt nguyên nhân
        const [[row]] = await conn.execute(
          `SELECT stock FROM menu_items WHERE id = ?`,
          [cart.productId]
        );

        if (!row || row.stock < cart.quantity) {
          throw new Error('OUT_OF_STOCK');
        } else {
          throw new Error('RETRY'); // race condition
        }
      }
    }

    // 🔹 6. Insert order_items (batch)
    const values = carts.map(cart => {
      const product = productMap.get(cart.productId);
      return [
        orderId,
        cart.productId,
        cart.quantity,
        product.price
      ];
    });

    await conn.query(
      `INSERT INTO order_items 
      (order_id, product_id, quantity, unit_price)
      VALUES ?`,
      [values]
    );

    await conn.commit();

    return orderId;

  } catch (err) {
    await conn.rollback();
    throw err;

  } finally {
    conn.release();
  }
}
