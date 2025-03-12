# [v] MongoDB là gì?
- MongoDB là một hệ quản trị cơ sở dữ liệu NoSQL dạng document (Document Database).
- MongoDB lưu dữ liệu theo document (tài liệu JSON/BSON) giúp linh hoạt, dễ mở rộng và truy vấn nhanh.
- Lưu trữ dữ liệu dưới dạng JSON (Document-based).
- Không cần schema cố định, có thể thay đổi cấu trúc dữ liệu linh hoạt.
- Dễ mở rộng theo chiều ngang (Horizontal Scaling) bằng cách thêm server.
- Tốc độ truy vấn nhanh, phù hợp với Big Data, Realtime Apps.
- MongoDB gồm:
    + Database: Chứa nhiều collection (tương tự database trong SQL).
    + Collection: Chứa nhiều document (tương tự table trong SQL).
    + Document: Lưu trữ dữ liệu dưới dạng JSON/BSON (tương tự row trong SQL). vi du:

# [v] MongoDB lưu trữ dữ liệu dưới dạng gì?
- Lưu trữ dữ liệu dưới dạng JSON (Document-based).

# [v] Khi nào nên sử dụng MongoDB thay vì SQL?
- Dữ liệu linh hoạt, không có cấu trúc cố định.
- Cần tốc độ truy vấn nhanh, ứng dụng realtime.
- Dự án có dữ liệu lớn, cần mở rộng theo chiều ngang.
- Cần tích hợp dễ dàng với Node.js, Express.js.

# Các kiểu dữ liệu trong mongodb
- Kiểu dữ liệu số (Numeric Types)
    + Int32 ~ Int
    + Int64 ~ BigInt
    + Double
    + Decimal128
- Kiểu chuỗi (String Type)
    + String
- Kiểu Boolean
    + Boolean
- Kiểu ngày giờ (Date & Time Types)
    + Date
- Kiểu ObjectId
- Kiểu mảng (Array)
- Kiểu nhúng tài liệu (Embedded Document)
- Kiểu dữ liệu nhị phân (Binary Data)
- Kiểu Null
- Kiểu Symbol
- Kiểu JavaScript Code

# [v] Tài liệu (document) trong MongoDB là gì?
- Trong MongoDB, document là đơn vị dữ liệu cơ bản, tương đương với một bản ghi (record) trong SQL.
- Mỗi tài liệu được lưu trữ dưới dạng JSON-like (BSON - Binary JSON), có cấu trúc linh hoạt và không yêu cầu schema cố định như trong SQL.

# [v] Cấu trúc của một document MongoDB như thế nào?
Một document trong MongoDB bao gồm các cặp key-value, ví dụ:
```
{
  "_id": ObjectId("65b3d4e2f1a2b3c4d5e6f7g8"),
  "name": "John Doe",
  "age": 30,
  "email": "johndoe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "skills": ["JavaScript", "MongoDB", "Node.js"]
}
```
- _id: Mỗi document có một ID duy nhất, mặc định là kiểu ObjectId.
- Hỗ trợ kiểu dữ liệu đa dạng: String, Number, Boolean, Array, Object…
- Không cần schema cố định: Các document trong cùng một collection có thể có cấu trúc khác nhau.

# Một collection là gì?
# Phân biệt database, collection, document trong MongoDB?
# Lệnh để tạo database, collection, và thêm document?
- use databaseName
- db.createCollection("collectionName")
- db.collectionName.insertOne()
- db.collectionName.insertMany()

# Cách tìm kiếm dữ liệu với find() và findOne()?

# Cách update và xóa dữ liệu (updateOne(), updateMany(), deleteOne(), deleteMany())


# Index là gì? Các loại index trong MongoDB?
- Index (chỉ mục) trong MongoDB giúp tăng tốc độ truy vấn bằng cách tạo cấu trúc dữ liệu cho phép tìm kiếm nhanh hơn thay vì quét toàn bộ collection.
    + Không có index → MongoDB phải duyệt qua toàn bộ dữ liệu → chậm.
    + Có index → MongoDB truy cập trực tiếp đến dữ liệu cần tìm → nhanh hơn nhiều.
- Single Field Index (Index trên một trường)
    + Đánh index trên một trường giúp tăng tốc truy vấn với trường đó.
    + db.collection.createIndex({ fieldName: 1 }); // Sắp xếp tăng dần
    + db.collection.createIndex({ fieldName: -1 }); // Sắp xếp giảm dần
- Compound Index (Index trên nhiều trường)
    + Đánh index trên nhiều trường cùng lúc giúp tối ưu truy vấn kết hợp.
    + db.collection.createIndex({ field1: 1, field2: -1 });
- Multikey Index (Index cho mảng)
    + Dùng khi trường chứa mảng giá trị để tìm kiếm nhanh hơn.
    + db.collection.createIndex({ tags: 1 });
- Text Index (Index cho tìm kiếm văn bản)
    + Dùng để tìm kiếm toàn văn (full-text search) trong chuỗi dữ liệu.
    + db.collection.createIndex({ fieldName: "text" });
- Geospatial Index (Index cho dữ liệu địa lý)
    + Dùng để tìm kiếm dữ liệu vị trí (longitude, latitude).
    + db.collection.createIndex({ location: "2dsphere" });
- Hashed Index (Index băm dữ liệu)
    + Dùng cho trường có dữ liệu ngẫu nhiên, không sắp xếp được (ví dụ: ObjectId, hash).
    + db.collection.createIndex({ fieldName: "hashed" });
- TTL Index (Index tự động xóa dữ liệu)
    + Dùng để tự động xóa tài liệu sau thời gian nhất định (phù hợp cho logs, sessions).
    + db.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // Xóa sau 1 giờ
    
# Khi nào nên sử dụng Compound Index?

# Giải thích sự khác nhau giữa Single Field Index, Multikey Index, Text Index, và Geospatial Index?

# Làm thế nào để kiểm tra Index đang hoạt động có hiệu quả không?

# Aggregation là gì? So sánh Aggregation với SQL GROUP BY?
- Aggregation trong MongoDB là một quá trình xử lý dữ liệu phức tạp bằng cách thực hiện nhiều phép biến đổi và tính toán trên tập dữ liệu.
- Nó tương tự như GROUP BY trong SQL nhưng linh hoạt hơn vì có thể áp dụng nhiều thao tác trên dữ liệu như lọc ($match), nhóm ($group), sắp xếp ($sort), và chuyển đổi cấu trúc ($project).
- MongoDB sử dụng Aggregation Pipeline, trong đó dữ liệu được xử lý qua nhiều bước (stages), mỗi bước sẽ biến đổi hoặc tính toán dữ liệu trước khi chuyển sang bước tiếp theo.

So sánh: Aggregation | GROUP BY
- Cách hoạt động:
    + Sử dụng Aggregation Pipeline với nhiều stage ($match, $group, $sort, $project, v.v.)
    + Dùng GROUP BY kết hợp với SELECT để nhóm dữ liệu
- Tính linh hoạt:
    + Rất linh hoạt, có thể thực hiện các phép toán phức tạp (lookup, unwind, map-reduce, v.v.)
    + Ít linh hoạt hơn, chủ yếu nhóm dữ liệu và tính toán trên từng nhóm
- Hiệu suất:
    + Tối ưu hơn khi làm việc với dữ liệu lớn, do chạy pipeline từng bước và có thể chạy song song
    + Có thể chậm nếu không có index phù hợp
- Truy vấn nâng cao:
    + Hỗ trợ nhiều phép biến đổi dữ liệu như $lookup (JOIN), $unwind, $facet, $bucket
    + Chủ yếu dùng để tính toán tổng hợp như SUM(), COUNT(), AVG()
- Hỗ trợ JSON:
    + Hoạt động trực tiếp trên document JSON mà không cần ánh xạ sang bảng quan hệ
    + Làm việc với bảng và cột (dữ liệu quan hệ)

# Aggregation Pipeline là gì?
- Aggregation Pipeline là một cơ chế mạnh mẽ trong MongoDB giúp xử lý và biến đổi dữ liệu trong các collection một cách có tổ chức thông qua chuỗi các giai đoạn (stages)
- Mỗi stage trong pipeline sẽ thao tác trên dữ liệu đầu vào và truyền kết quả cho stage tiếp theo.
- Dùng để thực hiện các truy vấn phức tạp, group dữ liệu, biến đổi dữ liệu, tính toán số liệu tổng hợp, v.v.

# Các stage chính trong aggregation pipeline ($match, $group, $sort, $limit, $lookup)?
- $match: Lọc dữ liệu giống như find
- $group: Gom nhóm dữ liệu và tính toán
- $project: Chọn/biến đổi trường dữ liệu
- $sort: Sắp xếp dữ liệu
- $limit: Giới hạn số lượng bản ghi
- $skip: Bỏ qua số lượng bản ghi
- $lookup: Join dữ liệu từ collection khác
- $unwind: Phá vỡ mảng thành các document riêng biệt
- $addFields: Thêm trường mới (Add/Modify Fields)
- $count: Đếm số lượng document
- $facet: Chia nhiều pipeline con (Multi-Pipeline)
- $replaceRoot / $replaceWith: Thay đổi root document

# Viết truy vấn để lấy tổng số đơn hàng của từng khách hàng bằng aggregation?

# Giải thích cơ chế sharding trong MongoDB?

# Khi nào nên dùng replication trong MongoDB?

# Phân biệt Primary Replica, Secondary Replica trong replication?

# Câu hỏi MongoDB thực tế
1. Khi nào MongoDB bị chậm và làm sao để tối ưu?
2. Làm sao để scale MongoDB khi số lượng dữ liệu tăng?
3. Khi nào nên dùng Sharding, khi nào nên dùng Replication?
4. MongoDB có hỗ trợ Authentication & Authorization không?
5. Cách bảo vệ MongoDB khỏi các lỗ hổng bảo mật?
6. Làm thế nào để backup và restore MongoDB database?

# Câu hỏi MongoDB thực hành
1. Lấy danh sách khách hàng có tổng số tiền mua hàng lớn nhất?
2. Tìm các sản phẩm có giá lớn hơn 1000$?
3. Lấy 5 sản phẩm bán chạy nhất trong tháng trước?
4. Tìm tất cả các khách hàng không có đơn hàng nào?