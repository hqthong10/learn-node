DELIMITER //

CREATE OR REPLACE PROCEDURE import_stock_from_json(
  IN p_supplier_id BIGINT,
  IN p_employee_id BIGINT,
  IN p_items_json JSON,
  IN p_receipt_no VARCHAR(100)
)
BEGIN
  DECLARE v_total DECIMAL(12,2) DEFAULT 0;
  DECLARE v_receipt_id BIGINT;
  DECLARE v_rows INT;

  -- Tạo temporary table từ JSON
  DROP TEMPORARY TABLE IF EXISTS tmp_import_items;
  CREATE TEMPORARY TABLE tmp_import_items (
    product_id BIGINT UNSIGNED,
    quantity INT,
    import_price DECIMAL(12,2)
  ) ENGINE=MEMORY;

  INSERT INTO tmp_import_items (product_id, quantity, import_price)
  SELECT product_id, quantity, import_price
  FROM JSON_TABLE(p_items_json, '$[*]'
    COLUMNS (
      product_id BIGINT PATH '$.product_id',
      quantity INT PATH '$.quantity',
      import_price DECIMAL(12,2) PATH '$.import_price'
    )
  ) AS jt;

  -- Tính tổng
  SELECT COALESCE(SUM(quantity * import_price), 0) INTO v_total FROM tmp_import_items;

  START TRANSACTION;
    -- tạo phiếu nhập
    INSERT INTO import_receipts (receipt_no, supplier_id, employee_id, total_amount, created_at)
    VALUES (p_receipt_no, p_supplier_id, p_employee_id, v_total, NOW());
    SET v_receipt_id = LAST_INSERT_ID();

    -- chèn import_items và cập nhật tồn kho
    INSERT INTO import_items (receipt_id, product_id, quantity, import_price)
    SELECT v_receipt_id, product_id, quantity, import_price FROM tmp_import_items;

    -- cập nhật tồn kho
    UPDATE products p
    JOIN (SELECT product_id, SUM(quantity) AS total_q FROM tmp_import_items GROUP BY product_id) t
      ON p.id = t.product_id
    SET p.quantity_in_stock = p.quantity_in_stock + t.total_q;

    -- log inventory_movements
    INSERT INTO inventory_movements (product_id, change_qty, reason, related_id)
    SELECT product_id, quantity, 'import_receipt', v_receipt_id FROM tmp_import_items;

  COMMIT;

  -- trả về receipt id
  SELECT v_receipt_id AS receipt_id, v_total AS total_amount;
END;
//

DELIMITER ;
