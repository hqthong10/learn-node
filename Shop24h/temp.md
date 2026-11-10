# PROMPT: XÂY DỰNG HỆ THỐNG QUẢN LÝ CỬA HÀNG TIỆN LỢI

## 1. Vai trò

Bạn là Senior Backend Engineer và Software Architect, có kinh nghiệm xây dựng hệ thống quản lý bán lẻ (Retail Management System), quản lý kho, bán hàng, khuyến mãi và chương trình khách hàng thân thiết.

Hãy thiết kế và triển khai một dự án Web Service quản lý cửa hàng tiện lợi tương tự Bách Hóa Xanh, với kiến trúc rõ ràng, code dễ bảo trì, bảo mật tốt và có khả năng mở rộng trong tương lai.

Không chỉ viết code để chạy được, bạn phải đảm bảo các nghiệp vụ thực tế, tính toàn vẹn dữ liệu và khả năng xử lý các tình huống phát sinh trong môi trường bán lẻ.

## 2. Công nghệ bắt buộc

Sử dụng các công nghệ sau:

- **Node.js:** TypeScript.
- **Web framework:** Express.js.
- **API:** GraphQL.
- **Database:** MongoDB.
- **ODM:** Mongoose.
- **Authentication:** JWT hoặc cơ chế xác thực phù hợp với hệ thống.
- **Validation:** Validate dữ liệu đầu vào tại API boundary.
- **Testing:** Jest và Supertest hoặc các công cụ tương đương.
- **Package manager:** pnpm.
- **Containerization:** Docker và Docker Compose cho môi trường phát triển.
- **API documentation:** GraphQL Schema, mô tả nghiệp vụ và hướng dẫn sử dụng API.

Ưu tiên các phiên bản ổn định, tương thích với nhau tại thời điểm triển khai. Không sử dụng thư viện đã lỗi thời hoặc API đã bị deprecated.

Không sử dụng REST API làm giao diện nghiệp vụ chính. Các nghiệp vụ của hệ thống phải được cung cấp thông qua GraphQL. Các endpoint phụ trợ như health check có thể sử dụng REST nếu cần thiết.

## 3. Mục tiêu dự án

Xây dựng backend cho hệ thống quản lý cửa hàng tiện lợi, hỗ trợ các nghiệp vụ:

1. Quản lý sản phẩm và danh mục.
2. Quản lý nhà cung cấp.
3. Nhập hàng và quản lý tồn kho.
4. Bán hàng và quản lý hóa đơn.
5. Quản lý khuyến mãi sản phẩm.
6. Quản lý khách hàng bằng số điện thoại.
7. Tích điểm khách hàng dựa trên giá trị hóa đơn.
8. Tra cứu lịch sử mua hàng và lịch sử điểm thưởng.
9. Quản lý nhân viên và phân quyền.
10. Báo cáo doanh thu, tồn kho và hiệu quả kinh doanh.

Thiết kế theo mô hình có thể mở rộng từ một cửa hàng lên nhiều cửa hàng trong tương lai, nhưng không triển khai microservices ở phiên bản đầu tiên.

## 4. Các module nghiệp vụ

### 4.1. Quản lý người dùng và phân quyền

Xây dựng các chức năng:

- Đăng nhập và đăng xuất.
- Quản lý tài khoản nhân viên.
- Phân quyền theo vai trò (RBAC).
- Quản lý trạng thái tài khoản.
- Ghi nhận người thực hiện các thao tác quan trọng.

Các vai trò ban đầu:

- ADMIN: Quản trị toàn hệ thống.
- MANAGER: Quản lý cửa hàng.
- CASHIER: Nhân viên bán hàng.
- INVENTORY_STAFF: Nhân viên quản lý kho.

Chỉ cho phép các vai trò có quyền phù hợp thực hiện từng nghiệp vụ.

### 4.2. Quản lý sản phẩm

Thông tin sản phẩm gồm:

- Mã sản phẩm (SKU), duy nhất.
- Tên sản phẩm.
- Mã vạch (barcode), nếu có.
- Danh mục sản phẩm.
- Đơn vị tính.
- Giá vốn.
- Giá bán.
- Mô tả.
- Hình ảnh, nếu cần.
- Trạng thái kinh doanh.
- Thời gian tạo và cập nhật.

Yêu cầu:

- Thêm, sửa, xem và ngừng kinh doanh sản phẩm.
- Tìm kiếm theo tên, SKU và barcode.
- Lọc theo danh mục và trạng thái.
- Hỗ trợ phân trang.
- Không xóa cứng sản phẩm đã được sử dụng trong hóa đơn hoặc lịch sử kho.
- Giá vốn và giá bán phải được kiểm tra hợp lệ.

### 4.3. Quản lý danh mục và nhà cung cấp

Danh mục sản phẩm hỗ trợ cấu trúc phù hợp với hàng hóa cửa hàng tiện lợi.

Thông tin nhà cung cấp gồm:

- Mã nhà cung cấp.
- Tên nhà cung cấp.
- Số điện thoại.
- Địa chỉ.
- Email.
- Trạng thái hoạt động.
- Ghi chú.

Hỗ trợ quản lý nhà cung cấp và tra cứu lịch sử nhập hàng từ từng nhà cung cấp.

### 4.4. Nghiệp vụ nhập hàng

Xây dựng quy trình nhập hàng từ nhà cung cấp.

Thông tin phiếu nhập:

- Mã phiếu nhập.
- Nhà cung cấp.
- Danh sách sản phẩm.
- Số lượng nhập của từng sản phẩm.
- Giá nhập từng sản phẩm.
- Tổng tiền hàng.
- Chiết khấu hoặc chi phí bổ sung nếu có.
- Tổng giá trị phiếu nhập.
- Người tạo phiếu.
- Người xác nhận nhập hàng.
- Trạng thái phiếu.
- Thời gian nhập hàng.

Các trạng thái đề xuất:

- DRAFT: Phiếu nháp.
- CONFIRMED: Đã xác nhận và cập nhật kho.
- CANCELLED: Đã hủy theo quy trình hợp lệ.

Quy tắc nghiệp vụ:

- Phiếu nháp không làm thay đổi tồn kho.
- Chỉ khi xác nhận phiếu nhập thành công mới cập nhật tồn kho.
- Một phiếu nhập không được xác nhận nhiều lần.
- Mọi thay đổi tồn kho phải có lịch sử giao dịch.
- Không cho phép sửa trực tiếp lịch sử nhập kho đã xác nhận.
- Nếu cần điều chỉnh, phải tạo nghiệp vụ điều chỉnh hoặc hoàn trả phù hợp.
- Việc xác nhận phiếu nhập và cập nhật tồn kho phải bảo đảm tính nhất quán dữ liệu.

### 4.5. Nghiệp vụ bán hàng

Xây dựng chức năng bán hàng tại quầy (POS backend).

Quy trình cơ bản:

1. Nhân viên tìm sản phẩm bằng barcode, SKU hoặc tên.
2. Thêm sản phẩm vào giỏ hàng.
3. Nhập số lượng cần mua.
4. Hệ thống kiểm tra giá bán và khuyến mãi đang có hiệu lực.
5. Khách hàng có thể cung cấp số điện thoại để tích điểm.
6. Hệ thống tính tổng tiền hàng, giảm giá, số tiền phải thanh toán và điểm thưởng dự kiến.
7. Nhân viên xác nhận thanh toán.
8. Hệ thống tạo hóa đơn và cập nhật tồn kho.
9. Hệ thống ghi nhận điểm thưởng cho khách hàng nếu đủ điều kiện.
10. Hỗ trợ tra cứu hóa đơn và lịch sử bán hàng.

Thông tin hóa đơn gồm:

- Mã hóa đơn duy nhất.
- Danh sách sản phẩm.
- Số lượng.
- Giá bán tại thời điểm mua.
- Giá vốn hoặc dữ liệu cần thiết để tính lợi nhuận.
- Giá trị trước giảm giá.
- Chi tiết khuyến mãi.
- Tổng tiền giảm.
- Tổng tiền thanh toán.
- Thông tin khách hàng nếu có.
- Điểm được cộng hoặc sử dụng.
- Nhân viên thực hiện.
- Phương thức thanh toán.
- Trạng thái hóa đơn.
- Thời gian giao dịch.

Quy tắc quan trọng:

- Không cho phép bán vượt tồn kho.
- Giá và thông tin khuyến mãi phải được xác định lại ở phía server khi thanh toán.
- Không tin tưởng giá hoặc tổng tiền do client gửi lên.
- Không cho phép client tự quyết định số điểm được cộng.
- Không cho phép cùng một yêu cầu thanh toán tạo ra nhiều hóa đơn hoặc trừ kho nhiều lần.
- Xử lý an toàn khi nhiều nhân viên bán cùng một sản phẩm tại cùng thời điểm.
- Sử dụng transaction phù hợp của MongoDB để bảo đảm tính nhất quán giữa hóa đơn, tồn kho và điểm thưởng.
- Thiết kế cơ chế idempotency cho thao tác tạo hóa đơn hoặc xác nhận thanh toán.
- Nếu giao dịch thất bại, không được để lại trạng thái dữ liệu dở dang.
- Hỗ trợ hủy hóa đơn hoặc hoàn trả hàng theo quy trình riêng, có kiểm soát quyền và lịch sử điều chỉnh.

### 4.6. Quản lý tồn kho

Theo dõi tồn kho theo sản phẩm và cửa hàng.

Thông tin cần quản lý:

- Số lượng tồn hiện tại.
- Số lượng đã nhập.
- Số lượng đã bán.
- Số lượng điều chỉnh.
- Ngưỡng tồn kho tối thiểu.
- Lịch sử biến động tồn kho.

Yêu cầu:

- Tồn kho chỉ được thay đổi thông qua các nghiệp vụ hợp lệ.
- Ghi nhận lịch sử nhập, xuất bán, hoàn trả và điều chỉnh.
- Hỗ trợ kiểm kê và điều chỉnh tồn kho.
- Phát hiện sản phẩm sắp hết hàng.
- Không cập nhật tồn kho bằng cách ghi đè tùy tiện từ client.
- Có cơ chế chống cập nhật đồng thời gây mất dữ liệu.
- Thiết kế để sau này hỗ trợ nhiều cửa hàng và nhiều kho.

Phân biệt rõ số lượng tồn hiện tại và lịch sử giao dịch kho. Lịch sử kho phải có tham chiếu đến nghiệp vụ phát sinh.

### 4.7. Quản lý khuyến mãi sản phẩm

Hỗ trợ tạo và quản lý chương trình khuyến mãi.

Các loại khuyến mãi ban đầu:

- Giảm giá theo phần trăm.
- Giảm giá theo số tiền cố định.
- Giá bán khuyến mãi.
- Mua X sản phẩm tặng Y sản phẩm.
- Mua từ một số lượng nhất định để được giảm giá.
- Khuyến mãi theo thời gian.
- Khuyến mãi theo danh sách sản phẩm hoặc danh mục.

Thông tin chương trình:

- Mã chương trình.
- Tên chương trình.
- Loại khuyến mãi.
- Danh sách sản phẩm hoặc danh mục áp dụng.
- Giá trị giảm.
- Thời gian bắt đầu và kết thúc.
- Số lượng áp dụng tối đa nếu có.
- Trạng thái.
- Điều kiện áp dụng.
- Quy tắc kết hợp với chương trình khác.

Quy tắc nghiệp vụ:

- Chỉ áp dụng khuyến mãi hợp lệ tại thời điểm bán.
- Không áp dụng chương trình đã hết hạn hoặc chưa bắt đầu.
- Có quy tắc ưu tiên khi nhiều khuyến mãi cùng áp dụng.
- Mặc định không cộng dồn các khuyến mãi, trừ khi được cấu hình rõ ràng.
- Kiểm tra giới hạn giảm giá và số tiền thanh toán không âm.
- Lưu lại thông tin khuyến mãi và giá trị giảm thực tế trên từng hóa đơn để bảo đảm khả năng kiểm tra lịch sử.
- Việc thay đổi khuyến mãi sau này không được làm thay đổi hóa đơn đã hoàn tất.

### 4.8. Quản lý khách hàng và tích điểm

Khách hàng được nhận diện bằng số điện thoại.

Thông tin khách hàng:

- Mã khách hàng.
- Họ tên.
- Số điện thoại duy nhất.
- Ngày tạo tài khoản.
- Tổng số điểm hiện có.
- Tổng số tiền đã mua.
- Trạng thái hoạt động.

Chức năng:

- Đăng ký hoặc tạo hồ sơ khách hàng.
- Tra cứu khách hàng bằng số điện thoại.
- Gắn khách hàng vào hóa đơn.
- Tra cứu lịch sử mua hàng.
- Tra cứu lịch sử tích và sử dụng điểm.
- Xem số điểm hiện có.
- Điều chỉnh điểm thông qua nghiệp vụ có phân quyền và ghi nhận lý do.

Quy tắc tích điểm:

- Xây dựng cấu hình tỷ lệ tích điểm, ví dụ: mỗi 10.000 đồng thanh toán hợp lệ được 1 điểm.
- Tỷ lệ tích điểm phải cấu hình được, không hardcode trong code nghiệp vụ.
- Chỉ tính điểm dựa trên giá trị hóa đơn đủ điều kiện theo chính sách đã cấu hình.
- Xác định rõ cách xử lý phần tiền lẻ không đủ một đơn vị tích điểm.
- Không tính điểm trên phần giảm giá.
- Không tự động tích điểm cho hóa đơn thất bại hoặc chưa hoàn tất.
- Một hóa đơn chỉ được cộng điểm một lần.
- Lưu lịch sử giao dịch điểm, gồm điểm cộng, điểm sử dụng, điểm điều chỉnh, lý do và hóa đơn liên quan.
- Nếu hóa đơn bị hủy hoặc hoàn trả, phải có cơ chế thu hồi hoặc điều chỉnh điểm tương ứng.
- Không chỉ dựa vào trường `points` trên khách hàng để làm nguồn dữ liệu duy nhất; cần có lịch sử giao dịch điểm để đối soát.

Quy tắc sử dụng điểm:

- Có thể phát triển chức năng dùng điểm để giảm giá hóa đơn.
- Nếu triển khai, cần cấu hình tỷ lệ quy đổi điểm thành tiền, số điểm tối thiểu và giới hạn sử dụng.
- Kiểm tra số điểm khả dụng tại thời điểm thanh toán.
- Không cho phép sử dụng điểm vượt số dư.
- Việc sử dụng điểm và hoàn tất hóa đơn phải nhất quán trong cùng quy trình giao dịch.
- Không cho phép hai giao dịch đồng thời sử dụng cùng một số điểm.

Nếu khách hàng không cung cấp số điện thoại, hóa đơn vẫn có thể được tạo và thanh toán nhưng không được cộng điểm khách hàng.

### 4.9. Báo cáo và thống kê

Xây dựng các truy vấn GraphQL phục vụ báo cáo:

- Doanh thu theo ngày, tuần và tháng.
- Số lượng hóa đơn.
- Giá trị hóa đơn trung bình.
- Sản phẩm bán chạy.
- Doanh thu theo sản phẩm hoặc danh mục.
- Lịch sử nhập hàng.
- Giá trị tồn kho.
- Sản phẩm tồn kho thấp.
- Lịch sử mua hàng của khách hàng.
- Thống kê điểm đã cộng, đã sử dụng và đã thu hồi.

Phân biệt doanh thu bán hàng với giá trị nhập hàng và lợi nhuận. Quy định rõ cách tính các chỉ số, đồng thời xử lý hóa đơn hủy và hoàn trả phù hợp.

## 5. Thiết kế cơ sở dữ liệu MongoDB

Sử dụng Mongoose để thiết kế schema, model, validation và các quan hệ tham chiếu cần thiết.

Đề xuất các collection:

- users
- roles hoặc cấu hình quyền
- products
- categories
- suppliers
- purchaseOrders
- inventoryStocks
- inventoryTransactions
- salesInvoices
- promotions
- customers
- loyaltyTransactions
- paymentTransactions nếu cần
- auditLogs
- stores
- systemSettings

Có thể điều chỉnh danh sách trên khi phân tích nghiệp vụ.

Yêu cầu thiết kế:

- Sử dụng ObjectId phù hợp.
- Tạo unique index cho các mã nghiệp vụ và số điện thoại cần duy nhất.
- Thiết kế index cho các truy vấn thường dùng.
- Sử dụng schema validation phù hợp.
- Chọn embedded document hoặc reference dựa trên nhu cầu truy vấn, lịch sử và khả năng mở rộng.
- Lưu snapshot thông tin sản phẩm, giá và khuyến mãi trên hóa đơn để giữ nguyên lịch sử.
- Có chiến lược xử lý dữ liệu bị xóa hoặc ngừng hoạt động.
- Tránh thiết kế schema quá phức tạp hoặc lạm dụng populate.
- Không lưu các dữ liệu có thể tính toán lại nếu không có lý do rõ ràng.
- Cân nhắc khả năng tăng trưởng dữ liệu hóa đơn và lịch sử kho.

MongoDB transaction yêu cầu môi trường hỗ trợ replica set hoặc cấu hình tương đương. Hãy thiết lập MongoDB phù hợp trong Docker Compose và hướng dẫn cách chạy transaction ở môi trường phát triển.

## 6. Kiến trúc source code

Sử dụng kiến trúc module theo nghiệp vụ, phân tách rõ trách nhiệm.

Đề xuất cấu trúc:

src/
  config/
  common/
    errors/
    guards/
    middleware/
    utils/
  database/
  modules/
    auth/
    users/
    products/
    categories/
    suppliers/
    purchasing/
    inventory/
    sales/
    promotions/
    customers/
    loyalty/
    reports/
  graphql/
    schema/
    context/
    scalars/
  app.ts
  server.ts

Trong từng module, tổ chức các thành phần phù hợp như:

- models/
- inputs/ hoặc DTOs/
- services/
- repositories/ nếu thực sự cần
- resolvers/
- type definitions/ hoặc schema/
- tests/

Có thể thay đổi cấu trúc nếu có lý do kiến trúc rõ ràng.

Nguyên tắc:

- Resolver chỉ tiếp nhận request, kiểm tra quyền cần thiết và điều phối nghiệp vụ.
- Business logic phải nằm trong service hoặc các thành phần domain phù hợp.
- Không viết toàn bộ nghiệp vụ trong resolver.
- Tách validation, authentication và authorization.
- Xử lý lỗi tập trung.
- Không trả stack trace hoặc thông tin nội bộ cho client.
- Không tạo quá nhiều abstraction không cần thiết.
- Tránh phụ thuộc vòng giữa các module.

## 7. GraphQL API

Thiết kế GraphQL schema rõ ràng, có kiểu dữ liệu cụ thể.

Phân biệt:

- Query: tra cứu dữ liệu.
- Mutation: thay đổi dữ liệu hoặc thực hiện nghiệp vụ.
- Input types: dữ liệu đầu vào.
- Output types: dữ liệu trả về.
- Enum: trạng thái và các giá trị cố định.
- Pagination: phân trang.
- Error handling: lỗi nghiệp vụ và lỗi hệ thống.

Ví dụ các API cần có:

**Authentication**
- login
- me

**Products**
- products
- product
- createProduct
- updateProduct
- deactivateProduct

**Purchasing**
- createPurchaseOrder
- confirmPurchaseOrder
- cancelPurchaseOrder
- purchaseOrders
- purchaseOrder

**Inventory**
- inventoryStock
- inventoryTransactions
- adjustInventory

**Sales**
- createSalesInvoice hoặc checkout
- salesInvoice
- salesInvoices
- cancelSalesInvoice
- processReturn nếu triển khai hoàn trả hàng

**Promotions**
- promotions
- promotion
- createPromotion
- updatePromotion
- deactivatePromotion

**Customers và loyalty**
- customerByPhone
- createCustomer
- customerPurchaseHistory
- customerLoyaltyHistory
- loyaltyBalance

**Reports**
- salesSummary
- topSellingProducts
- lowStockProducts
- inventorySummary

Đây là danh sách định hướng. Hãy thiết kế tên API và schema nhất quán với nghiệp vụ thực tế.

Đảm bảo:

- GraphQL context chứa thông tin user đã xác thực.
- Kiểm tra quyền tại server.
- Giới hạn độ sâu và độ phức tạp query khi phù hợp.
- Có cơ chế chống truy vấn quá nặng.
- Tránh N+1 query bằng DataLoader hoặc giải pháp phù hợp.
- Giới hạn kích thước danh sách trả về.
- Không để client tự truyền các trường nhạy cảm như giá cuối cùng, tồn kho, điểm thưởng hoặc trạng thái thanh toán để quyết định kết quả nghiệp vụ.

## 8. Bảo mật

Triển khai các biện pháp:

- Hash mật khẩu bằng Argon2 hoặc bcrypt.
- Xác thực và phân quyền tại backend.
- Validate và chuẩn hóa dữ liệu đầu vào.
- Bảo vệ khỏi NoSQL injection.
- Cấu hình CORS phù hợp.
- Giới hạn request và đăng nhập khi cần.
- Quản lý secrets bằng biến môi trường.
- Không commit file `.env`.
- Không log mật khẩu, token hoặc dữ liệu nhạy cảm.
- Bảo vệ thông tin khách hàng và lịch sử mua hàng.
- Kiểm soát quyền xem, tạo, sửa, hủy hóa đơn và điều chỉnh kho.
- Ghi audit log cho các thao tác quan trọng.

## 9. Tính toàn vẹn dữ liệu và nghiệp vụ production

Đây là yêu cầu bắt buộc.

Hãy phân tích và xử lý các trường hợp:

1. Hai nhân viên đồng thời bán sản phẩm cuối cùng trong kho.
2. Hai request đồng thời xác nhận cùng một phiếu nhập.
3. Client gửi lại request tạo hóa đơn do timeout.
4. Giao dịch tạo hóa đơn thành công nhưng cập nhật điểm thất bại.
5. Khách hàng đồng thời sử dụng điểm ở nhiều hóa đơn.
6. Khuyến mãi hết hạn ngay trước thời điểm thanh toán.
7. Hóa đơn bị hủy sau khi đã cộng điểm.
8. Nhân viên không có quyền điều chỉnh kho hoặc giá bán.
9. MongoDB mất kết nối trong quá trình giao dịch.
10. Một sản phẩm bị ngừng kinh doanh nhưng vẫn xuất hiện trong giỏ hàng cũ.

Với mỗi tình huống:

- Mô tả rủi ro.
- Đưa ra giải pháp.
- Triển khai code xử lý.
- Viết test kiểm chứng.

Không dùng transaction như giải pháp duy nhất cho mọi vấn đề. Hãy kết hợp điều kiện cập nhật nguyên tử, kiểm tra trạng thái, unique index, idempotency và transaction khi phù hợp.

## 10. Testing

Viết unit test và integration test cho các nghiệp vụ quan trọng.

Tối thiểu cần kiểm thử:

- Đăng nhập và phân quyền.
- CRUD sản phẩm.
- Nhập hàng và cập nhật tồn kho.
- Bán hàng thành công.
- Không cho phép bán vượt tồn kho.
- Áp dụng khuyến mãi.
- Tính tiền hóa đơn chính xác.
- Tích điểm chính xác.
- Không cộng điểm hai lần.
- Thu hồi điểm khi hủy hoặc hoàn trả.
- Không cho phép sử dụng điểm vượt số dư.
- Rollback dữ liệu khi transaction thất bại.
- Xử lý request trùng lặp.
- Các trường hợp truy cập trái quyền.

Sử dụng MongoDB phục vụ testing với cấu hình phù hợp. Không giả định rằng transaction hoạt động trên MongoDB standalone.

## 11. Docker và môi trường phát triển

Tạo:

- Dockerfile.
- docker-compose.yml.
- `.env.example`.
- Cấu hình kết nối MongoDB.
- MongoDB replica set phục vụ transaction trong môi trường phát triển.
- Health check phù hợp.
- Script chạy migration hoặc khởi tạo dữ liệu nếu cần.
- Seed dữ liệu mẫu.
- Script development, build, typecheck, lint và test.

Không đưa thông tin bí mật vào source code hoặc Docker image.

Hướng dẫn rõ cách cài đặt, khởi động, kiểm tra và dừng hệ thống.

## 12. Dữ liệu mẫu

Tạo seed data bao gồm:

- Các tài khoản theo vai trò.
- Danh mục sản phẩm.
- Một số sản phẩm phổ biến tại cửa hàng tiện lợi.
- Nhà cung cấp.
- Tồn kho ban đầu thông qua nghiệp vụ hoặc dữ liệu khởi tạo hợp lệ.
- Chương trình khuyến mãi.
- Khách hàng có số điện thoại mẫu.
- Một số hóa đơn và lịch sử điểm để kiểm thử báo cáo.

Thông tin đăng nhập demo phải được ghi rõ trong tài liệu phát triển, không dùng mật khẩu demo trong production.

## 13. Tài liệu dự án

Tạo README.md bằng tiếng Việt, bao gồm:

- Mục tiêu và phạm vi dự án.
- Kiến trúc hệ thống.
- Giải thích các module.
- Cấu trúc thư mục.
- Yêu cầu môi trường.
- Cách chạy bằng Docker Compose.
- Cấu hình biến môi trường.
- Cách tạo dữ liệu mẫu.
- Cách chạy test.
- Cách truy cập GraphQL Playground hoặc công cụ GraphQL phù hợp trong môi trường development.
- Các ví dụ Query và Mutation.
- Mô tả các quy tắc nghiệp vụ.
- Hướng dẫn xử lý các lỗi thường gặp.

Bổ sung tài liệu thiết kế database và luồng nghiệp vụ nhập hàng, bán hàng, tích điểm.

## 14. Quy trình triển khai

Không tạo toàn bộ dự án trong một lần bằng cách sinh hàng loạt file mà không kiểm tra.

Thực hiện theo từng giai đoạn:

**Giai đoạn 1: Phân tích và thiết kế**
- Xác định yêu cầu và các giả định nghiệp vụ.
- Làm rõ những quyết định ảnh hưởng đến tính đúng đắn của hệ thống.
- Thiết kế kiến trúc.
- Thiết kế database.
- Thiết kế luồng nghiệp vụ.
- Đề xuất GraphQL schema.
- Xác định rủi ro và phương án xử lý.

**Giai đoạn 2: Khởi tạo dự án**
- Khởi tạo Express, TypeScript, Apollo Server và Mongoose.
- Cấu hình môi trường.
- Thiết lập Docker Compose và MongoDB replica set.
- Thiết lập lint, format, typecheck và testing.
- Xây dựng health check và kết nối database.

**Giai đoạn 3: Authentication và nền tảng**
- Xây dựng đăng nhập.
- Phân quyền.
- Xử lý lỗi.
- Validation.
- Logging và audit log cơ bản.

**Giai đoạn 4: Sản phẩm và kho**
- Danh mục, sản phẩm và nhà cung cấp.
- Nhập hàng.
- Cập nhật tồn kho.
- Lịch sử giao dịch kho.

**Giai đoạn 5: Bán hàng**
- Tính giá và khuyến mãi.
- Checkout.
- Tạo hóa đơn.
- Cập nhật tồn kho an toàn.
- Xử lý idempotency và giao dịch đồng thời.

**Giai đoạn 6: Khách hàng và tích điểm**
- Tra cứu theo số điện thoại.
- Tích điểm.
- Lịch sử điểm.
- Sử dụng điểm nếu được đưa vào phạm vi.
- Xử lý hủy hóa đơn và hoàn trả.

**Giai đoạn 7: Báo cáo và hoàn thiện**
- Báo cáo doanh thu.
- Sản phẩm bán chạy.
- Tồn kho.
- Kiểm thử nghiệp vụ.
- Tối ưu truy vấn.
- Hoàn thiện tài liệu.

Sau mỗi giai đoạn, hãy chạy các kiểm tra phù hợp, sửa lỗi và báo cáo kết quả trước khi chuyển sang giai đoạn tiếp theo.

## 15. Cách làm việc của AI

- Trả lời và viết tài liệu bằng tiếng Việt.
- Code, tên biến, class, function và GraphQL schema sử dụng tiếng Anh nhất quán.
- Ưu tiên code đơn giản, dễ đọc, dễ bảo trì.
- Giải thích ngắn gọn lý do cho các quyết định kiến trúc quan trọng.
- Không tự ý bỏ qua yêu cầu nghiệp vụ.
- Không dùng dữ liệu giả để thay thế việc triển khai nghiệp vụ thật.
- Không tạo các hàm chỉ trả về dữ liệu hardcode để giả lập chức năng hoàn chỉnh.
- Không đánh dấu công việc hoàn thành nếu chưa triển khai và kiểm thử.
- Nếu có điểm chưa rõ, hãy nêu giả định hoặc hỏi tôi trước khi đưa ra quyết định ảnh hưởng lớn đến kiến trúc hay nghiệp vụ.
- Không viết quá nhiều code trong một bước.
- Khi sửa code hiện có, hãy kiểm tra cấu trúc dự án và giữ tương thích với những phần đã hoạt động.
- Không tự ý xóa hoặc ghi đè các file không liên quan.
- Không thực hiện commit hoặc push Git nếu chưa được yêu cầu.

## 16. Tiêu chí nghiệm thu

Dự án chỉ được xem là đạt yêu cầu khi:

1. Khởi động được bằng hướng dẫn đã cung cấp.
2. Kết nối MongoDB thành công.
3. Các GraphQL Query và Mutation hoạt động thực tế.
4. Phân quyền được kiểm tra tại backend.
5. Nhập hàng và bán hàng cập nhật kho chính xác.
6. Không xảy ra bán vượt tồn kho trong các tình huống cạnh tranh đã kiểm thử.
7. Tính tiền và áp dụng khuyến mãi chính xác.
8. Tích điểm đúng chính sách và không bị cộng trùng.
9. Có lịch sử biến động kho và lịch sử điểm thưởng.
10. Các lỗi nghiệp vụ được xử lý rõ ràng.
11. Các bài test quan trọng đều chạy thành công.
12. Có tài liệu đầy đủ để một developer khác tiếp tục phát triển dự án.

## Yêu cầu bắt đầu

Hãy bắt đầu với **Giai đoạn 1: Phân tích và thiết kế**.

Trước tiên, hãy trình bày:

1. Các giả định nghiệp vụ.
2. Phạm vi MVP và các chức năng để dành cho phiên bản sau.
3. Kiến trúc tổng thể.
4. Danh sách collection và quan hệ dữ liệu.
5. Các luồng nhập hàng, bán hàng, khuyến mãi và tích điểm.
6. Các quy tắc tính tiền, tồn kho và điểm thưởng.
7. Những tình huống cạnh tranh dữ liệu và cách giải quyết.
8. Cấu trúc thư mục dự kiến.
9. Kế hoạch triển khai và kiểm thử.

**Chưa viết code ở bước đầu tiên.** Hãy trình bày thiết kế để tôi xem xét và xác nhận trước khi chuyển sang giai đoạn khởi tạo dự án.