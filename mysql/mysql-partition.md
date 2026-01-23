# Partition trong MYSQL
- Partition trong MySQL là một kỹ thuật dùng để chia nhỏ một bảng lớn thành nhiều phần nhỏ hơn (partition) dựa trên các quy tắc được định nghĩa trước.

- Mỗi partition có thể được lưu trữ và quản lý riêng biệt, giúp tối ưu hóa quá trình truy vấn và xử lý dữ liệu, đặc biệt khi làm việc với các bảng có lượng dữ liệu lớn.

## Mục đích sử dụng partition
1. Cải thiện hiệu suất truy vấn: Khi truy vấn dữ liệu, MySQL có thể chỉ truy xuất dữ liệu từ một số partition thay vì phải quét toàn bộ bảng.

2. Dễ dàng quản lý dữ liệu: Dữ liệu có thể được quản lý dễ dàng hơn theo các khoảng thời gian hoặc các điều kiện khác mà không cần chia nhỏ bảng thủ công.

3. Tối ưu hóa việc lưu trữ: Mỗi partition có thể lưu trữ ở các ổ đĩa khác nhau để cân bằng tải và tận dụng tài nguyên lưu trữ tốt hơn.

## Các kiểu partition trong MySQL
- MySQL hỗ trợ nhiều kiểu partition khác nhau tùy thuộc vào cách phân chia dữ liệu:

1. RANGE Partitioning:
    - Dữ liệu được phân chia theo các khoảng giá trị.
    - Ví dụ, phân chia theo khoảng thời gian hoặc giá trị số.

    ```
    CREATE TABLE orders (
        order_id INT,
        order_date DATE,
        customer_id INT
    )
    
    PARTITION BY RANGE (YEAR(order_date)) (
        PARTITION p0 VALUES LESS THAN (2020),
        PARTITION p1 VALUES LESS THAN (2021),
        PARTITION p2 VALUES LESS THAN MAXVALUE
    );
    ```

2. LIST Partitioning:
    - Dữ liệu được phân chia dựa trên các danh sách giá trị.
    - Thường sử dụng khi dữ liệu được phân chia theo các nhóm cụ thể (ví dụ: theo quốc gia, theo loại hàng hóa).
    ```
    CREATE TABLE customers (
        customer_id INT,
        customer_name VARCHAR(50),
        country VARCHAR(50)
    )

    PARTITION BY LIST (country) (
        PARTITION p_us VALUES IN ('USA'),
        PARTITION p_uk VALUES IN ('UK'),
        PARTITION p_ca VALUES IN ('Canada')
    );
    ```

3. HASH Partitioning:
    - Dữ liệu được phân chia ngẫu nhiên dựa trên một hàm băm.
    - Loại partition này thường được sử dụng khi dữ liệu không thể chia đều theo bất kỳ điều kiện nào cụ thể.

    ```
    CREATE TABLE logs (
        log_id INT,
        log_message TEXT
    )
    PARTITION BY HASH(log_id)
    PARTITIONS 4;
    ```

4. KEY Partitioning:
    - Giống như HASH Partitioning, nhưng sử dụng hàm băm mặc định của MySQL.
    - Thường được sử dụng cho các khóa chính hoặc khóa ngoại.

    ```
    CREATE TABLE users (
        user_id INT,
        user_name VARCHAR(50)
    )
    PARTITION BY KEY(user_id)
    PARTITIONS 3;
    ```

5. SUBPARTITION:
    - MySQL cũng hỗ trợ subpartition (phân vùng con) cho một số loại partition như RANGE và LIST.
    - Ví dụ: có thể phân chia theo RANGE và sau đó subpartition theo HASH.

    ```
        CREATE TABLE sales (
            sale_id INT,
            sale_date DATE,
            sale_amount DECIMAL(10, 2)
        )
        PARTITION BY RANGE (YEAR(sale_date))
        SUBPARTITION BY HASH(sale_id)
        SUBPARTITIONS 4 (
            PARTITION p0 VALUES LESS THAN (2019),
            PARTITION p1 VALUES LESS THAN (2020),
            PARTITION p2 VALUES LESS THAN MAXVALUE
        );
    ```

## Lợi ích và hạn chế
- Lợi ích:
    + Cải thiện tốc độ truy vấn: Đặc biệt với các bảng lớn, MySQL chỉ cần truy vấn một partition cụ thể thay vì phải quét toàn bộ bảng.
    + Dễ quản lý dữ liệu: Có thể dễ dàng xóa, nén, hoặc quản lý dữ liệu của một partition mà không ảnh hưởng đến các partition khác.
    + Tối ưu hóa việc lưu trữ: Có thể lưu các partition ở các thiết bị lưu trữ khác nhau để tối ưu hóa không gian và hiệu suất.

- Hạn chế:
    + Phức tạp: Quản lý partition có thể trở nên phức tạp, đặc biệt khi có nhiều loại partition khác nhau.
    + Giới hạn tính năng: Không phải tất cả các loại partition đều hỗ trợ các tính năng như foreign key.
    + Không phù hợp cho bảng nhỏ: Partition không có ý nghĩa nhiều đối với bảng nhỏ, vì có thể làm tăng độ phức tạp mà không có nhiều lợi ích về hiệu suất.

# Quản lý partition
- Thêm partition:

```
ALTER TABLE orders
ADD PARTITION (PARTITION p3 VALUES LESS THAN (2022));
```

- Xóa partition:

```
ALTER TABLE orders
DROP PARTITION p2;
```

- Xem thông tin partition:

```
SHOW CREATE TABLE orders;
```

# Cách sử dụng partition trong truy vấn:
Trong MySQL, khi bảng được chia partition, các truy vấn sẽ tự động sử dụng partition tương ứng mà không cần thay đổi cú pháp SQL thông thường. Tuy nhiên, có thể tối ưu hóa các truy vấn để tận dụng partition tốt hơn.

1. Partition Pruning
MySQL tự động sử dụng tính năng partition pruning để chỉ quét partition chứa dữ liệu liên quan đến truy vấn, giúp tăng tốc độ truy vấn. Điều này xảy ra khi điều kiện WHERE trong truy vấn khớp với các giá trị phân vùng đã định nghĩa.

Ví dụ: Bảng orders được phân vùng theo năm order_date:
```
CREATE TABLE orders (
  order_id INT,
  order_date DATE,
  customer_id INT
)
PARTITION BY RANGE (YEAR(order_date)) (
  PARTITION p0 VALUES LESS THAN (2020),
  PARTITION p1 VALUES LESS THAN (2021),
  PARTITION p2 VALUES LESS THAN MAXVALUE
);
```

Khi truy vấn chỉ dữ liệu của năm 2020:
```
SELECT * 
FROM orders 
WHERE order_date >= '2020-01-01' AND order_date < '2021-01-01';
```
MySQL sẽ chỉ truy cập vào partition p1 (2020), bỏ qua các partition khác, giúp cải thiện tốc độ truy vấn.

2. Sử dụng EXPLAIN để kiểm tra partition pruning
- Bạn có thể sử dụng lệnh EXPLAIN để kiểm tra MySQL có đang thực hiện partition pruning hay không. Nếu có, output của EXPLAIN sẽ chỉ ra partition nào sẽ được quét.

```
EXPLAIN SELECT * 
FROM orders 
WHERE order_date >= '2020-01-01' AND order_date < '2021-01-01';
```
Trong output của EXPLAIN, bạn sẽ thấy phần partitions chỉ ra các partition sẽ được sử dụng.

3. Partition Key trong điều kiện truy vấn
Khi truy vấn dữ liệu, nếu bạn sử dụng trường dùng để phân vùng (partition key) trong điều kiện WHERE, MySQL sẽ tự động tối ưu hóa và chỉ truy xuất partition liên quan.
```
SELECT * 
FROM orders 
WHERE YEAR(order_date) = 2020;
```

4. Truy vấn dữ liệu từ nhiều partition
MySQL cũng hỗ trợ truy vấn dữ liệu từ nhiều partition. Khi không có điều kiện WHERE phù hợp với partition key, MySQL sẽ quét tất cả các partition.
```
SELECT * 
FROM orders 
WHERE customer_id = 123;
```
Vì customer_id không phải là partition key, MySQL sẽ quét tất cả các partition.

5. Sử dụng PARTITION trong truy vấn (Chỉ định partition cụ thể)
Trong một số trường hợp, bạn có thể chỉ định MySQL chỉ quét một hoặc một số partition cụ thể bằng cách sử dụng từ khóa PARTITION trong câu lệnh truy vấn.

```
SELECT * 
FROM orders PARTITION (p1, p2)
WHERE order_date >= '2020-01-01' AND order_date < '2022-01-01';
```
Câu lệnh này sẽ chỉ truy vấn dữ liệu từ các partition p1 và p2, không truy cập các partition khác.

6. Xóa dữ liệu trong partition cụ thể
```
DELETE FROM orders PARTITION (p0)
WHERE order_date < '2020-01-01';
```

7. Sử dụng partition với GROUP BY và ORDER BY
Khi sử dụng GROUP BY hoặc ORDER BY với partitioned table, MySQL vẫn hỗ trợ nhưng việc tối ưu hóa sẽ phụ thuộc vào cách dữ liệu được phân vùng.
```
SELECT YEAR(order_date), COUNT(*)
FROM orders
GROUP BY YEAR(order_date);
```
MySQL sẽ chỉ quét những partition liên quan nếu có partition key trong điều kiện WHERE.

8. Kết hợp partition với chỉ mục (index)
Ngoài việc sử dụng partition, bạn có thể tạo chỉ mục (index) cho các trường khác không phải partition key để tối ưu hóa hơn nữa.

```
CREATE INDEX idx_customer_id ON orders(customer_id);

SELECT * 
FROM orders 
WHERE customer_id = 123;
```
Khi đó, truy vấn theo customer_id sẽ sử dụng chỉ mục để tối ưu truy vấn:
