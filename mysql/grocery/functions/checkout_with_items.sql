DELIMITER //

CREATE OR REPLACE PROCEDURE checkout_with_items(
  IN p_employee_id BIGINT,
  IN p_customer_id BIGINT,
  IN p_payment_method VARCHAR(50),
  IN p_items_json JSON,
  IN p_use_points INT
)
BEGIN
  DECLARE v_subtotal DECIMAL(12,2) DEFAULT 0;
  DECLARE v_discount DECIMAL(12,2) DEFAULT 0;
  DECLARE v_total DECIMAL(12,2) DEFAULT 0;
  DECLARE v_invoice_id BIGINT;
  DECLARE v_status VARCHAR(20);
  DECLARE v_point_value INT DEFAULT 1000; -- 1 point = 1000 VND
  DECLARE v_points_used INT DEFAULT 0;
  DECLARE v_current_points INT DEFAULT 0;
  DECLARE v_earned_points INT DEFAULT 0;

  -- create tmp items
  DROP TEMPORARY TABLE IF EXISTS tmp_items;
  CREATE TEMPORARY TABLE tmp_items (
    product_id BIGINT UNSIGNED,
    quantity INT,
    unit_price DECIMAL(12,2)
  ) ENGINE=MEMORY;

  INSERT INTO tmp_items (product_id, quantity, unit_price)
  SELECT product_id, quantity, unit_price
  FROM JSON_TABLE(p_items_json, '$[*]'
    COLUMNS (
      product_id BIGINT PATH '$.product_id',
      quantity INT PATH '$.quantity',
      unit_price DECIMAL(12,2) PATH '$.unit_price'
    )
  ) AS jt;

  -- validate tmp_items not empty
  SELECT COUNT(*) INTO @cnt FROM tmp_items;
  IF @cnt = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No items provided';
  END IF;

  -- subtotal
  SELECT COALESCE(SUM(quantity * unit_price), 0) INTO v_subtotal FROM tmp_items;

  -- points use validation
  SET v_points_used = IFNULL(p_use_points, 0);
  IF v_points_used < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'use_points must be >= 0';
  END IF;

  START TRANSACTION;
    -- if using points, lock and check customer points
    IF v_points_used > 0 THEN
      IF p_customer_id IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'customer_id required when using points';
      END IF;

      SELECT COALESCE(points,0) INTO v_current_points FROM customers WHERE id = p_customer_id FOR UPDATE;
      IF v_current_points IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'customer not found';
      END IF;
      IF v_points_used > v_current_points THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient customer points';
      END IF;
    END IF;

    -- Lock product rows for all products to avoid oversell
    -- We lock via SELECT ... FOR UPDATE on all involved product ids
    -- Build a list from tmp_items
    -- Note: use JOIN to lock
    SELECT p.id INTO @dummy
    FROM products p
    JOIN (SELECT DISTINCT product_id FROM tmp_items) t ON p.id = t.product_id
    FOR UPDATE;

    -- Verify stock for each product
    -- If any insufficient -> rollback + signal
    SELECT GROUP_CONCAT(CONCAT('id=', p.id, ':avail=', p.quantity_in_stock, ':req=', t.quantity) SEPARATOR '; ')
      INTO @debug
    FROM products p
    JOIN tmp_items t ON p.id = t.product_id
    WHERE p.quantity_in_stock < t.quantity;

    IF @debug IS NOT NULL AND CHAR_LENGTH(@debug) > 0 THEN
      ROLLBACK;
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = CONCAT('Insufficient stock for some products: ', @debug);
    END IF;

    -- compute discount from points
    SET v_discount = v_points_used * v_point_value;
    SET v_total = v_subtotal - v_discount;
    IF v_total < 0 THEN SET v_total = 0; END IF;

    SET v_status = IF(p_payment_method = 'cash', 'paid', 'pending');

    -- create invoice
    INSERT INTO invoices (invoice_no, employee_id, customer_id, status, total_amount, payment_method, created_at)
    VALUES (CONCAT('INV-', UNIX_TIMESTAMP(), '-', LPAD(FLOOR(RAND()*1000),3,'0')), p_employee_id, p_customer_id, v_status, v_total, p_payment_method, NOW());
    SET v_invoice_id = LAST_INSERT_ID();

    -- insert invoice_items from tmp
    INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price)
    SELECT v_invoice_id, product_id, quantity, unit_price FROM tmp_items;

    -- deduct stock
    UPDATE products p
    JOIN (SELECT product_id, SUM(quantity) AS total_q FROM tmp_items GROUP BY product_id) t
      ON p.id = t.product_id
    SET p.quantity_in_stock = p.quantity_in_stock - t.total_q;

    -- log inventory movements
    INSERT INTO inventory_movements (product_id, change_qty, reason, related_id)
    SELECT product_id, -quantity, 'sale_invoice', v_invoice_id FROM tmp_items;

    -- handle points used (subtract)
    IF v_points_used > 0 THEN
      UPDATE customers SET points = points - v_points_used WHERE id = p_customer_id;
      INSERT INTO loyalty_history (customer_id, invoice_id, points_change, reason, created_at)
      VALUES (p_customer_id, v_invoice_id, -v_points_used, 'use_points', NOW());
    END IF;

    -- if paid immediate, award points
    IF p_customer_id IS NOT NULL AND v_status = 'paid' THEN
      SET v_earned_points = FLOOR(v_total / v_point_value);
      IF v_earned_points > 0 THEN
        UPDATE customers SET points = points + v_earned_points WHERE id = p_customer_id;
        INSERT INTO loyalty_history (customer_id, invoice_id, points_change, reason, created_at)
        VALUES (p_customer_id, v_invoice_id, v_earned_points, 'purchase', NOW());
      END IF;
    END IF;

  COMMIT;

  -- return invoice id and totals
  SELECT v_invoice_id AS invoice_id, v_subtotal AS subtotal, v_discount AS discount, v_total AS total_amount, v_status AS status;
END;
//

DELIMITER ;
