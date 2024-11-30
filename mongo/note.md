- distinct: được sử dụng để lấy danh sách các giá trị duy nhất (distinct values) từ một trường cụ thể trong các tài liệu của một collection.
    + db.collection.distinct(field, query, options)

- $addToSet: Toán tử $addToSet trong MongoDB được sử dụng trong các biểu thức cập nhật và tổng hợp để thêm các giá trị vào một mảng, nhưng chỉ khi giá trị đó chưa tồn tại trong mảng. Điều này đảm bảo rằng mảng chỉ chứa các giá trị duy nhất.

- Discriminators trong Mongoose là một tính năng mạnh mẽ cho phép bạn tạo ra các sub-models (mô hình con) dựa trên một schema gốc (mô hình mẹ). Discriminators giúp quản lý dữ liệu phân loại (ví dụ: các loại đối tượng tương tự nhau nhưng có thuộc tính khác biệt) trong cùng một collection, nhưng với các schema khác nhau.