DELIMITER //

CREATE OR REPLACE PROCEDURE cancel_invoice(
  IN p_invoice_id BIGINT,
  IN p_reason VARCHAR(255)
)
BEGIN
  DECLARE v_status VARCHAR(20);
  DECLARE v_customer_id BIGINT;
  DECLARE v_total DECIMAL(12,2);
  DECLARE v_loyalty_net INT DEFAULT 0;

  START TRANSACTION;
    -- lock invoice row
    SELECT status, customer_id, total_amount INTO v_status, v_customer_id, v_total
    FROM invoices WHERE id = p_invoice_id FOR UPDATE;

    IF v_status IS NULL THEN
      ROLLBACK;
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invoice not found';
    END IF;

    IF v_status = 'cancelled' THEN
      ROLLBACK;
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invoice already cancelled';
    END IF;

    -- restore stock: for each invoice_items, add back quantity
    -- lock product rows then update
    -- lock products involved
    SELECT p.id INTO @dummy
    FROM products p
    JOIN invoice_items ii ON p.id = ii.product_id
    WHERE ii.invoice_id = p_invoice_id
    FOR UPDATE;

    -- add back stock
    UPDATE products p
    JOIN (
      SELECT product_id, SUM(quantity) AS qsum
      FROM invoice_items
      WHERE invoice_id = p_invoice_id
      GROUP BY product_id
    ) t ON p.id = t.product_id
    SET p.quantity_in_stock = p.quantity_in_stock + t.qsum;

    -- log inventory_movements
    INSERT INTO inventory_movements (product_id, change_qty, reason, related_id)
    SELECT product_id, SUM(quantity), 'cancel_invoice', p_invoice_id
    FROM invoice_items
    WHERE invoice_id = p_invoice_id
    GROUP BY product_id;

    -- reverse loyalty_history net effect for this invoice
    SELECT COALESCE(SUM(points_change),0) INTO v_loyalty_net FROM loyalty_history WHERE invoice_id = p_invoice_id;

    IF v_loyalty_net <> 0 AND v_customer_id IS NOT NULL THEN
      -- subtract the net points that were applied (note: v_loyalty_net could be positive or negative)
      -- we want to reverse their net effect on customer's balance
      -- so new_points = current_points - v_loyalty_net
      -- to be safe, lock customer row
      SELECT points INTO @cur_pts FROM customers WHERE id = v_customer_id FOR UPDATE;
      IF @cur_pts IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer not found';
      END IF;

      -- update points (subtract net effect)
      UPDATE customers SET points = GREATEST(0, points - v_loyalty_net) WHERE id = v_customer_id;

      -- insert reversal history entry (negative of previous net)
      INSERT INTO loyalty_history (customer_id, invoice_id, points_change, reason, created_at)
      VALUES (v_customer_id, p_invoice_id, -v_loyalty_net, CONCAT('cancel_invoice: ', p_reason), NOW());
    END IF;

    -- mark invoice as cancelled
    UPDATE invoices SET status = 'cancelled' WHERE id = p_invoice_id;

  COMMIT;

  SELECT CONCAT('cancelled:', p_invoice_id) AS result;
END;
//

DELIMITER ;
