parking_tickets

lưu xe vào/ra
biển số
loại xe
thời gian vào
thời gian ra
giá tiền
trạng thái



CREATE TABLE parking_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- BIGINT vì là PRIMARY số lượng rất lớn
    license_plate VARCHAR(10) NOT NULL, -- các loại xe có cấu tạo biển số không giống nhau nên không dùng VAR
    type VARCHAR(5) NOT NULL,
    time_in DATETIME NOT NULL,
    time_out DATETIME,
    price DECIMAL(9,2), --
    status tinyint, -- 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
