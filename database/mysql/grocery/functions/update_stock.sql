DELIMITER //

CREATE OR REPLACE PROCEDURE update_stock(
  IN p_product_id BIGINT,
  IN p_change INT,
  IN p_reason VARCHAR(255),
  IN p_related_id BIGINT -- có thể NULL
)
BEGIN
  DECLARE v_exists INT;
  START TRANSACTION;
    SELECT COUNT(*) INTO v_exists FROM products WHERE id = p_product_id FOR UPDATE;
    IF v_exists = 0 THEN
      ROLLBACK;
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found';
    END IF;

    UPDATE products
    SET quantity_in_stock = quantity_in_stock + p_change
    WHERE id = p_product_id;

    INSERT INTO inventory_movements (product_id, change_qty, reason, related_id)
    VALUES (p_product_id, p_change, p_reason, p_related_id);
  COMMIT;
END;
//

DELIMITER ;
