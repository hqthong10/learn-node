ACID là một tập hợp các thuộc tính đảm bảo rằng các giao dịch cơ sở dữ liệu được thực hiện một cách đáng tin cậy. ACID là viết tắt của:

- Atomicity (Nguyên tử)
- Consistency (Nhất quán)
- Isolation (Cô lập)
- Durability (Bền vững)

### **Chi tiết về ACID**

#### **1. Atomicity (Nguyên tử)**

Atomicity đảm bảo rằng mỗi giao dịch là một đơn vị công việc nguyên tử. Điều này có nghĩa là hoặc tất cả các hoạt động trong giao dịch đều được thực hiện, hoặc không có hoạt động nào được thực hiện cả. Nếu một phần của giao dịch thất bại, toàn bộ giao dịch sẽ bị hủy bỏ, và cơ sở dữ liệu sẽ trở về trạng thái trước khi giao dịch được thực hiện.

Ví dụ:

```
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;
```

Nếu một trong hai lệnh UPDATE thất bại, giao dịch sẽ bị hủy và không có thay đổi nào được thực hiện.

#### **2. Consistency (Nhất quán)**

Consistency đảm bảo rằng giao dịch đưa cơ sở dữ liệu từ một trạng thái hợp lệ này sang một trạng thái hợp lệ khác. Các quy tắc toàn vẹn dữ liệu (constraints, triggers, etc.) phải được duy trì trước và sau giao dịch.

Ví dụ:

```
-- Nếu có ràng buộc CHECK balance >= 0 trên bảng accounts
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
-- Giao dịch sẽ thất bại nếu kết quả làm balance < 0
```

#### **3. Isolation (Cô lập)**

Isolation đảm bảo rằng các giao dịch thực hiện độc lập với nhau. Kết quả của giao dịch này không bị ảnh hưởng bởi các giao dịch khác đang chạy đồng thời. Các mức cô lập (isolation levels) khác nhau quy định mức độ các giao dịch có thể thấy hoặc bị ảnh hưởng bởi các thay đổi của giao dịch khác.

Các mức cô lập bao gồm:

- Read Uncommitted
- Read Committed
- Repeatable Read
- Serializable

Ví dụ:

```SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;```

#### **4. Durability (Bền vững)**

Durability đảm bảo rằng khi giao dịch đã được cam kết (committed), thay đổi sẽ được lưu trữ vĩnh viễn trong cơ sở dữ liệu, ngay cả khi có sự cố như mất điện hay hệ thống bị sập.

Ví dụ:

```
COMMIT;
-- Thay đổi đã được cam kết sẽ được lưu trữ vĩnh viễn
```

### **Ví Dụ Thực Tế về ACID**

Giả sử bạn có một ứng dụng ngân hàng thực hiện chuyển tiền giữa hai tài khoản:

```
BEGIN TRANSACTION;

-- Trừ tiền từ tài khoản gửi
UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;

-- Cộng tiền vào tài khoản nhận
UPDATE accounts SET balance = balance + 500 WHERE account_id = 2;

-- Nếu cả hai lệnh UPDATE thành công, cam kết giao dịch
COMMIT;
```

1. Atomicity: Nếu bất kỳ lệnh UPDATE nào thất bại, toàn bộ giao dịch sẽ bị hủy.
2. Consistency: Ràng buộc dữ liệu sẽ đảm bảo rằng tổng số tiền trong hệ thống không bị thay đổi.
3. Isolation: Nếu có giao dịch khác thực hiện đồng thời, mỗi giao dịch sẽ không ảnh hưởng đến kết quả của giao dịch còn lại.
4. Durability: Sau khi giao dịch được cam kết, thay đổi sẽ được lưu trữ vĩnh viễn ngay cả khi hệ thống gặp sự cố.

### Tổng Kết

Các thuộc tính ACID đảm bảo rằng các giao dịch cơ sở dữ liệu được thực hiện một cách đáng tin cậy, giữ cho cơ sở dữ liệu ở trạng thái nhất quán và đáng tin cậy ngay cả trong trường hợp có lỗi hoặc sự cố hệ thống. Điều này rất quan trọng để đảm bảo tính toàn vẹn và độ tin cậy của dữ liệu trong các hệ thống quản lý cơ sở dữ liệu.
