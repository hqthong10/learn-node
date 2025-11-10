DELIMITER //

CREATE OR REPLACE FUNCTION calc_loyalty_points(p_total DECIMAL(12,2))
RETURNS INT
DETERMINISTIC
BEGIN
  RETURN FLOOR(p_total / 1000); -- Quy tắc: 1000 VND = 1 point (có thể thay đổi)
END;
//

DELIMITER ;
