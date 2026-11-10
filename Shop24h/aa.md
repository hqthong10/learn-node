# Giai đoạn 1: Phân tích và thiết kế hệ thống quản lý cửa hàng tiện lợi

Thư mục `Shop24h` hiện đang trống. Tài liệu dưới đây là bản thiết kế để anh/chị xem xét, chưa có code. Các quyết định cần anh/chị xác nhận nằm ở **mục 10**.

---

## 1. Giả định nghiệp vụ

| # | Giả định | Lý do |
|---|---|---|
| A1 | Tiền tệ là VND, lưu dạng **số nguyên đồng** (`Number`, kiểm tra `Number.isSafeInteger`). Không dùng số thập phân. | VND không có đơn vị lẻ. Dùng số nguyên thì tránh được sai số dấu phẩy động. |
| A2 | Giá bán **đã gồm VAT**. MVP không tách thuế và không kết nối hóa đơn điện tử. | Giữ phạm vi nhỏ. Có thể bổ sung sau qua nhà cung cấp hóa đơn điện tử. |
| A3 | MVP có **1 cửa hàng** nhưng mọi dữ liệu kho và giao dịch đều có `storeId`. Sản phẩm, danh mục, khách hàng, khuyến mãi và nhà cung cấp dùng chung toàn chuỗi. | Mở rộng lên nhiều cửa hàng mà không phải migrate schema. |
| A4 | Giỏ hàng nằm ở client (máy POS). Server không lưu giỏ. Server cung cấp `previewCheckout` để tính giá, sau đó `checkout` **tính lại toàn bộ**. | Server không phải giữ trạng thái. Không tin dữ liệu giá từ client. |
| A5 | Thanh toán gồm CASH, CARD, BANK_TRANSFER (QR). Thu ngân xác nhận đã nhận tiền thì hóa đơn chuyển thẳng sang `COMPLETED`. MVP không tích hợp cổng thanh toán. | Đúng với quy trình tại quầy. Có thể thêm `paymentTransactions` khi tích hợp cổng. |
| A6 | Giá vốn hàng bán tính theo **bình quân gia quyền di động**, lưu trên `inventoryStocks.avgCost` (theo từng cửa hàng). Trường `product.costPrice` chỉ là giá vốn tham khảo hoặc khởi tạo. | Đây là phương pháp phổ biến trong bán lẻ và tính được ngay khi nhập hàng. |
| A7 | Chi phí bổ sung và chiết khấu của phiếu nhập được **phân bổ vào giá nhập từng dòng theo tỷ lệ giá trị**, tạo ra giá vốn thực tế (landed cost). | Giá vốn chính xác hơn. |
| A8 | Mã hóa đơn và mã phiếu nhập (ví dụ `HD-20261021-000123`) lấy từ bộ đếm **chạy ngoài transaction**, nên **có thể bị nhảy số**. | Nếu bộ đếm nằm trong transaction, mọi lần thanh toán sẽ tranh chấp cùng một document. Đây là mã nội bộ, không phải số hóa đơn VAT theo luật. |
| A9 | Hủy hóa đơn (`cancel`) là **hủy toàn bộ**, chỉ MANAGER/ADMIN được làm và chỉ trong **ngày giao dịch**. Sau ngày đó phải dùng **trả hàng** (`return`), cho phép trả từng phần. | Phân biệt "hủy do nhập sai" với "khách trả hàng". |
| A10 | Báo cáo nhóm theo múi giờ `Asia/Ho_Chi_Minh`. Tuần bắt đầu từ thứ Hai (ISO week). | Đúng giờ kinh doanh thực tế. |
| A11 | Số điện thoại được chuẩn hóa về dạng `0xxxxxxxxx` (10 số, nhận cả `+84`/`84`). | Bảo đảm unique index có ý nghĩa. |
| A12 | Dùng điểm là một **khoản giảm giá**, làm giảm doanh thu thuần. Đây không phải phương thức thanh toán. | Cách hạch toán đơn giản và nhất quán với yêu cầu "không tính điểm trên phần giảm giá". |

## 2. Phạm vi MVP và các chức năng để sau

**MVP (v1):**
- Xác thực:
  - JWT access token và refresh token xoay vòng.
  - Đăng xuất bằng cách thu hồi session.
  - RBAC với 4 vai trò.
  - Audit log.
- Danh mục 2 cấp, sản phẩm và nhà cung cấp. Có tìm kiếm, lọc và phân trang.
- Phiếu nhập: DRAFT → CONFIRMED, hoặc DRAFT → CANCELLED. Có phân bổ chi phí và chiết khấu.
- Tồn kho:
  - Số tồn hiện tại và các bộ đếm tích lũy.
  - Lịch sử giao dịch kho chỉ ghi thêm, không sửa.
  - Điều chỉnh kho có lý do.
  - Kiểm kê: nhập số đếm thực tế, server tính chênh lệch.
  - Cảnh báo hàng sắp hết.
- Bán hàng:
  - `previewCheckout` và `checkout` có idempotency.
  - Hủy hóa đơn trong ngày.
  - Trả hàng từng phần.
- Khuyến mãi đủ 7 loại theo yêu cầu, có ưu tiên, cộng dồn có cấu hình và giới hạn số lần áp dụng.
- Khách hàng:
  - Tích điểm và **dùng điểm**.
  - Thu hồi điểm khi hủy hoặc trả hàng.
  - Điều chỉnh điểm thủ công có lý do.
- Báo cáo:
  - Doanh thu, lợi nhuận gộp, top sản phẩm, doanh thu theo danh mục.
  - Giá trị tồn kho, hàng sắp hết.
  - Lịch sử nhập hàng, thống kê điểm.

**Để dành cho phiên bản sau:**
- Trả hàng cho nhà cung cấp, hiện tạm dùng điều chỉnh kho.
- Chuyển kho giữa các cửa hàng.
- Hạn sử dụng và quản lý theo lô (batch/expiry). Đây là nghiệp vụ quan trọng với hàng tươi sống nhưng làm phức tạp kho đáng kể.
- Combo, mix-and-match giữa nhiều sản phẩm khác nhau, khuyến mãi cấp hóa đơn (ví dụ "hóa đơn trên 200k giảm 20k").
- Hạng thành viên, điểm hết hạn.
- Cổng thanh toán, hóa đơn VAT điện tử, ca làm việc và chốt két.
- Upload ảnh: MVP chỉ lưu URL.
- Bảng tổng hợp doanh thu theo ngày tính sẵn, read replica cho báo cáo, Redis cho rate limit.

## 3. Kiến trúc tổng thể

```
Client (POS / Admin web)
        │  HTTPS, GraphQL (POST /graphql), Bearer JWT
        ▼
┌─────────────────────── Express 5 ─────────────────────────┐
│ helmet · cors · rate-limit · requestId · pino logger      │
│ GET /health/live · GET /health/ready (REST phụ trợ)       │
│ ┌──────────────── Apollo Server 5 ──────────────────────┐ │
│ │ context: { user, storeId, loaders, requestId }        │ │
│ │ validation rules: depth limit, query complexity       │ │
│ │ formatError: che lỗi nội bộ                           │ │
│ │ Resolvers ─ authz(permission) ─ zod parse ─► Services │ │
│ └───────────────────────────────────────────────────────┘ │
│ Services (business logic) ─► Mongoose models              │
│ Domain thuần: pricing engine, loyalty calculator          │
└──────────────────────────┬────────────────────────────────┘
                           ▼
        MongoDB 8 (replica set rs0, 1 node ở môi trường dev)
```

**Các quyết định chính:**
- **Modular monolith**, chia module theo nghiệp vụ. Các module gọi nhau qua service, không truy cập trực tiếp model của module khác. Riêng báo cáo được đọc trực tiếp bằng aggregation.
- **GraphQL schema-first** (SDL `.graphql` trong từng module) kết hợp **graphql-codegen** để sinh kiểu TypeScript cho resolver. Schema SDL dễ đọc, dùng luôn làm tài liệu API, mà vẫn giữ được an toàn kiểu.
- **Validation:** GraphQL bảo đảm kiểu dữ liệu, **zod** kiểm tra quy tắc nghiệp vụ của input (độ dài, giá ≥ 0, số lượng nguyên dương, định dạng số điện thoại…). Việc kiểm tra chạy trong resolver trước khi gọi service.
- **Không có repository layer riêng.** Service dùng model Mongoose trực tiếp, tránh lớp trừu tượng không cần thiết.
- **Pricing engine** là hàm thuần (input: dòng hàng, giá, khuyến mãi, thời điểm; output: kết quả chi tiết). Nhờ vậy `previewCheckout` và `checkout` dùng chung một hàm, và có thể unit test riêng.
- **Phụ thuộc giữa các module chỉ đi một chiều:**
  - `sales` gọi `inventory`, `promotions`, `customers`, `loyalty`, `products`.
  - `purchasing` gọi `inventory`, `products`, `suppliers`.
  - Không module nào gọi ngược lại `sales`.
- **Lỗi:** dùng `AppError(code, message, details)`. Lỗi nghiệp vụ trả về `extensions.code` (ví dụ `INSUFFICIENT_STOCK`, `PRICE_CHANGED`). Lỗi không xác định được che thành `INTERNAL_SERVER_ERROR` kèm `requestId`. Stack trace chỉ ghi vào log.
- **Công nghệ dự kiến** (phiên bản cụ thể sẽ kiểm tra lại trên npm ở giai đoạn 2):
  - Nền tảng: Node 24 LTS, TypeScript 5, Express 5, `@apollo/server` 5 với `@as-integrations/express5`, Mongoose 8+, MongoDB 8.
  - Thư viện: zod, argon2 (argon2id), jose (JWT), dataloader, graphql-query-complexity, pino, helmet, express-rate-limit.
  - Kiểm thử: Jest, supertest, mongodb-memory-server (**MongoMemoryReplSet**).
  - Công cụ: ESLint 9 (flat config) với typescript-eslint, Prettier.

## 4. Collection và quan hệ dữ liệu

| Collection | Trường chính | Index | Ghi chú |
|---|---|---|---|
| `stores` | code, name, address, status | unique `code` | Seed sẵn 1 cửa hàng |
| `users` | username, passwordHash, fullName, role, storeIds[], status, failedLoginCount, lockedUntil | unique `username` | Xóa mềm bằng `status=DISABLED` |
| `sessions` | userId, refreshTokenHash, expiresAt, revokedAt, userAgent, ip | `userId`, TTL `expiresAt` | Dùng để đăng xuất và thu hồi token |
| `categories` | code, name, parentId, ancestors[], status, sortOrder | unique `code`, `parentId` | 2 cấp, ví dụ "Đồ uống" > "Nước ngọt" |
| `products` | sku, barcode, name, nameNormalized, categoryId, unit, costPrice, salePrice, description, imageUrl, status (ACTIVE / INACTIVE / DISCONTINUED), createdBy/updatedBy | unique `sku`, unique sparse `barcode`, `{categoryId,status}`, text/regex trên `nameNormalized` | Tên bỏ dấu để tìm kiếm. Không xóa cứng nếu đã có giao dịch. |
| `suppliers` | code, name, phone, email, address, status, note | unique `code` | |
| `purchaseOrders` | code, storeId, supplierId, **items[]** {productId, skuSnapshot, nameSnapshot, quantity, unitCost, allocatedUnitCost, lineTotal}, subtotal, discountAmount, extraCost, totalAmount, status, createdBy, confirmedBy, confirmedAt, cancelledBy, cancelReason | unique `code`, `{storeId,status,createdAt}`, `{supplierId,createdAt}` | Dòng hàng nhúng (embedded) vì số lượng có giới hạn và luôn đọc cùng phiếu |
| `inventoryStocks` | storeId, productId, quantity, avgCost, minQuantity, receivedQty, soldQty, returnedQty, adjustedQty, updatedAt | **unique `{storeId,productId}`**, `{storeId,quantity}` | Trạng thái hiện tại. Chỉ được cập nhật bằng `$inc` có điều kiện. |
| `inventoryTransactions` | storeId, productId, type (PURCHASE_RECEIPT / SALE / SALE_CANCEL / SALE_RETURN / ADJUSTMENT / STOCKTAKE), quantityChange (±), balanceAfter, unitCost, refType, refId, refCode, reason, createdBy, createdAt | `{storeId,productId,createdAt}`, `{refType,refId}`, **unique `{refType,refId,productId,type}`** | Chỉ ghi thêm, không bao giờ sửa. Unique index chặn việc ghi trùng. |
| `inventoryAdjustments` | code, storeId, type (MANUAL / STOCKTAKE), lines[] {productId, systemQty, countedQty, delta, reason}, createdBy, idempotencyKey | unique `code`, unique `{storeId,idempotencyKey}` | Chứng từ gốc cho các điều chỉnh kho |
| `promotions` | code, name, type, scope {productIds[], categoryIds[]}, config theo loại, startAt, endAt, priority, stackable, maxUsage, usedCount, status, storeIds[] (tùy chọn) | unique `code`, `{status,startAt,endAt}`, `scope.productIds`, `scope.categoryIds` | Không sửa giá trị của chương trình đã có hóa đơn áp dụng, chỉ được kết thúc sớm hoặc tạo bản mới |
| `salesInvoices` | code, storeId, **idempotencyKey**, requestHash, **lines[]** {productId, sku, name, unit, categoryId, quantity, unitPrice, unitCost, grossAmount, discountAmount, netAmount, appliedPromotions[] {promotionId, code, name, type, discountAmount}, returnedQuantity}, subtotal, promotionDiscount, pointsRedeemed, pointsDiscount, totalDiscount, payableAmount, payment {method, amountTendered, change}, customer {customerId, phone, name} snapshot, loyalty {pointsEarned, policySnapshot}, status (COMPLETED / CANCELLED / PARTIALLY_RETURNED / RETURNED), cashierId, completedAt, cancelledBy/At/reason | unique `code`, **unique `{storeId,idempotencyKey}`**, `{storeId,completedAt}`, `{customer.customerId,completedAt}`, `{status,completedAt}` | Dòng hàng nhúng (giới hạn ≤ 200 dòng). Lưu snapshot đầy đủ giá, giá vốn và khuyến mãi. |
| `salesReturns` | code, invoiceId, storeId, lines[] {productId, quantity, refundAmount, unitCost, restock}, refundAmount, pointsRevoked, pointsRefunded, reason, createdBy, idempotencyKey | unique `code`, `{invoiceId}`, unique `{storeId,idempotencyKey}` | |
| `customers` | code, phone, fullName, pointsBalance, totalSpent, status, createdAt | **unique `phone`**, unique `code` | `pointsBalance` và `totalSpent` là cache, có thể đối soát lại |
| `loyaltyTransactions` | customerId, type (EARN / REDEEM / REVOKE_EARN / REFUND_REDEEM / ADJUST), points (±), balanceAfter, invoiceId, returnId, reason, createdBy, createdAt | `{customerId,createdAt}`, **unique partial `{invoiceId,type}` với type ∈ {EARN, REDEEM}** | Nguồn dữ liệu gốc để đối soát điểm |
| `systemSettings` | key, value, version, updatedBy | unique `key` | Chính sách điểm (`loyalty.policy`), ngưỡng mặc định… |
| `counters` | key (ví dụ `HD-20261021`), seq | unique `key` | Sinh mã nghiệp vụ |
| `auditLogs` | actorId, action, entityType, entityId, before/after (đã lọc trường nhạy cảm), requestId, ip, createdAt | `{entityType,entityId}`, `{actorId,createdAt}` | Chỉ ghi thêm |

**Quan hệ chính:**
- `products.categoryId` → `categories`.
- `purchaseOrders.supplierId` → `suppliers`.
- `inventoryStocks` / `inventoryTransactions` → `products` và `stores`.
- `salesInvoices.customer.customerId` → `customers`.
- `loyaltyTransactions` → `customers` và `salesInvoices`.

Hóa đơn và phiếu nhập lưu snapshot nên khi đọc lịch sử không cần `populate`. Khi resolver cần dữ liệu liên quan, ví dụ `product.category` hay `invoice.cashier`, sẽ dùng **DataLoader theo từng request**.

**Bảng phân quyền (RBAC):** khai báo trong code dưới dạng hằng `permission → roles`. MVP chưa có collection `roles` vì 4 vai trò đã cố định, và lưu trong code thì dễ test, dễ review hơn.

| Quyền | ADMIN | MANAGER | CASHIER | INVENTORY_STAFF |
|---|---|---|---|---|
| Quản lý user | ✔ | — | — | — |
| Sửa sản phẩm (trừ giá) | ✔ | ✔ | — | ✔ |
| **Sửa giá bán / giá vốn** | ✔ | ✔ | — | — |
| Xem sản phẩm | ✔ | ✔ | ✔ | ✔ |
| Tạo phiếu nhập | ✔ | ✔ | — | ✔ |
| Xác nhận / hủy phiếu nhập | ✔ | ✔ | — | ✔ (*) |
| **Điều chỉnh / kiểm kê kho** | ✔ | ✔ | — | ✔ (chỉ kiểm kê) |
| Thanh toán (checkout) | ✔ | ✔ | ✔ | — |
| **Hủy hóa đơn / trả hàng** | ✔ | ✔ | — | — |
| Quản lý khuyến mãi | ✔ | ✔ | — | — |
| Tạo / tra cứu khách hàng | ✔ | ✔ | ✔ | — |
| Lịch sử mua hàng của khách | ✔ | ✔ | ✔ (chỉ khách đang phục vụ) | — |
| **Điều chỉnh điểm thủ công** | ✔ | ✔ | — | — |
| Báo cáo | ✔ | ✔ | — | Chỉ báo cáo kho |

(*) Xem câu hỏi Q6 ở mục 10.

## 5. Các luồng nghiệp vụ

### 5.1. Nhập hàng
1. `createPurchaseOrder` (DRAFT): kiểm tra nhà cung cấp và sản phẩm đang hoạt động, gộp các dòng trùng sản phẩm, tính `subtotal` và `total` ở server. **Tồn kho chưa thay đổi.**
2. `updatePurchaseOrder`: chỉ cho phép khi phiếu đang DRAFT (dùng điều kiện `status: DRAFT` trong filter).
3. `confirmPurchaseOrder`, chạy trong một **transaction**:
   - `updateOne({_id, status:'DRAFT'}, {$set:{status:'CONFIRMED', confirmedBy, confirmedAt}})`. Nếu `matchedCount = 0` thì trả lỗi `PURCHASE_ORDER_NOT_DRAFT`.
   - Phân bổ chiết khấu và chi phí bổ sung để ra `allocatedUnitCost`.
   - Với mỗi dòng: upsert `inventoryStocks` bằng `$inc quantity, receivedQty`, đồng thời tính lại `avgCost = (q·avg + inQ·inCost)/(q+inQ)`. Phép tính này dùng pipeline update để đảm bảo tính nguyên tử.
   - Ghi `inventoryTransactions` loại PURCHASE_RECEIPT, rồi ghi `auditLog`.
4. `cancelPurchaseOrder`: chỉ hủy được phiếu DRAFT. Phiếu CONFIRMED không sửa, không hủy. Muốn chỉnh thì dùng điều chỉnh kho (hoặc phiếu trả nhà cung cấp ở v2).

### 5.2. Bán hàng (checkout)
```
POS: quét barcode → products(search) → giỏ hàng ở client
   → previewCheckout(lines, customerPhone?, pointsToRedeem?)   [Query, không ghi]
   ← chi tiết giá, khuyến mãi, điểm dự kiến, cảnh báo (hết hàng, SP ngừng KD)
   → checkout(idempotencyKey, lines[{productId, quantity}], customerPhone?,
              pointsToRedeem?, payment{method, amountTendered?},
              expectedPayableAmount)
```
Server xử lý `checkout` theo các bước sau:
1. Validate input. Input **không có trường giá, giảm giá hay điểm cộng**.
2. Tra `salesInvoices` theo `{storeId, idempotencyKey}`:
   - Đã tồn tại và `requestHash` khớp: trả lại hóa đơn cũ.
   - Đã tồn tại nhưng hash khác: trả lỗi `IDEMPOTENCY_KEY_REUSED`.
3. Sinh mã hóa đơn (bộ đếm nằm ngoài transaction).
4. Chạy `session.withTransaction(...)`. Hàm này tự retry khi gặp `TransientTransactionError` hoặc `UnknownTransactionCommitResult`. Các bước bên trong:
   1. Lấy thời điểm `now` từ server và đọc sản phẩm. Nếu có sản phẩm không ACTIVE thì trả lỗi `PRODUCT_NOT_SELLABLE` kèm danh sách sản phẩm.
   2. Đọc các khuyến mãi đang hiệu lực tại `now`, sau đó chạy **pricing engine**.
   3. Nếu khách dùng điểm: kiểm tra chính sách, sau đó `customers.updateOne({_id, status:'ACTIVE', pointsBalance:{$gte:p}}, {$inc:{pointsBalance:-p}})`.
   4. So sánh `payableAmount` với `expectedPayableAmount`. Nếu khác nhau thì trả lỗi `PRICE_CHANGED` kèm giá mới, để thu ngân xác nhận lại với khách.
   5. Với mỗi dòng: `inventoryStocks.updateOne({storeId, productId, quantity:{$gte:qty}}, {$inc:{quantity:-qty, soldQty:qty}})`. Nếu `matchedCount = 0` thì trả lỗi `INSUFFICIENT_STOCK` và hủy toàn bộ transaction.
   6. Với khuyến mãi có `maxUsage`: `updateOne({_id, usedCount:{$lt:maxUsage}}, {$inc:{usedCount:1}})`. Nếu không cập nhật được thì trả lỗi `PROMOTION_EXHAUSTED`, tương tự `PRICE_CHANGED`.
   7. Tính điểm cộng, rồi insert hóa đơn. Unique index trên `idempotencyKey` là lớp chặn cuối cùng.
   8. Insert `inventoryTransactions` (SALE, `unitCost = avgCost` hiện tại) và `loyaltyTransactions` (REDEEM, EARN).
   9. Cập nhật `customers`: `$inc pointsBalance (+earn)` và `totalSpent`.
5. Nếu gặp lỗi duplicate key trên `idempotencyKey` (hai request trùng chạy song song): đọc hóa đơn đã thắng và trả về.

### 5.3. Khuyến mãi (pricing engine)
- **Lọc khuyến mãi ứng viên:** `status=ACTIVE`, `startAt ≤ now < endAt`, sản phẩm nằm trong `productIds` hoặc danh mục (kể cả danh mục cha) nằm trong `categoryIds`, và còn lượt áp dụng.
- **Cách tính theo loại** (áp dụng ở cấp dòng hàng):

  | Loại | Cách tính discount của dòng |
  |---|---|
  | PERCENTAGE | `round(gross × pct / 100)`, có thể đặt `maxDiscountPerUnit` |
  | FIXED_AMOUNT | `min(amount, unitPrice) × qty` |
  | FIXED_PRICE (giá khuyến mãi) | `max(0, unitPrice − promoPrice) × qty` |
  | BUY_X_GET_Y | Cùng sản phẩm: `floor(qty/(X+Y)) × Y × unitPrice`. Khác sản phẩm: xem Q4. |
  | QUANTITY_TIER | Khi `qty ≥ minQty` thì giảm theo % hoặc theo số tiền mỗi đơn vị |
  | Theo thời gian | Mọi chương trình đều có `startAt/endAt`. Có thể thêm khung giờ trong ngày (`dailyTimeWindow`, ví dụ giờ vàng 18h–21h). |
  | Theo sản phẩm / danh mục | Xác định qua `scope` |

- **Ưu tiên và cộng dồn:**
  1. Trong các chương trình **không cộng dồn**, chọn **một** chương trình cho mức giảm lớn nhất cho khách. Nếu bằng nhau thì chọn `priority` cao hơn, sau đó `createdAt` sớm hơn.
  2. Các chương trình có `stackable=true` được áp tiếp lên phần giá còn lại, theo thứ tự `priority`.
  3. Giới hạn: `discount dòng ≤ gross dòng`, `payable ≥ 0`.
- **Lưu kết quả:** `appliedPromotions[]` và số tiền giảm thực tế được ghi vào từng dòng hóa đơn. Sau này sửa khuyến mãi cũng không ảnh hưởng hóa đơn cũ.

### 5.4. Tích điểm
- Chính sách lưu trong `systemSettings.loyalty.policy` (có `version`). Giá trị mặc định khi seed:
  - `earnAmountPerPoint = 10_000` (mỗi 10.000đ được 1 điểm).
  - `pointValue = 100` (1 điểm = 100đ).
  - `minRedeemPoints = 100`.
  - `maxRedeemPercent = 50` (dùng điểm tối đa 50% giá trị hóa đơn).
  - `earnEnabled = true`.
- `eligibleAmount = payableAmount`, tức đã trừ cả khuyến mãi và tiền giảm từ điểm.
- `pointsEarned = floor(eligibleAmount / earnAmountPerPoint)`. **Phần tiền lẻ bị bỏ, không cộng dồn sang hóa đơn sau** (xem Q3).
- Chính sách đang áp dụng được snapshot vào hóa đơn (`loyalty.policySnapshot`), để khi hủy hoặc trả hàng thì tính lại theo đúng chính sách cũ.
- Hóa đơn không có số điện thoại vẫn tạo bình thường, không cộng điểm.

## 6. Quy tắc tính tiền, tồn kho và điểm

**Tính tiền, áp dụng cho từng dòng rồi cộng lại:**
```
grossAmount        = unitPrice × quantity               (unitPrice lấy từ DB, không lấy từ client)
discountAmount     = Σ khuyến mãi áp dụng (≤ grossAmount)
netAmount          = grossAmount − discountAmount
subtotal           = Σ grossAmount
promotionDiscount  = Σ discountAmount
pointsDiscount     = pointsRedeemed × pointValue
                     ≤ maxRedeemPercent% × (subtotal − promotionDiscount)
payableAmount      = subtotal − promotionDiscount − pointsDiscount   (≥ 0)
change             = amountTendered − payableAmount     (chỉ với CASH, amountTendered ≥ payable)
```
- Phần tiền giảm từ điểm được **phân bổ xuống từng dòng theo tỷ lệ `netAmount`**. Phần dư do làm tròn dồn vào dòng cuối, để tổng các dòng luôn khớp với tổng hóa đơn. Việc phân bổ này cần cho tính tiền hoàn khi trả hàng từng phần.
- Mọi phép tính đều trên số nguyên. Phần trăm được làm tròn về đồng (`Math.round`) tại từng dòng.

**Tồn kho:**
- Chỉ thay đổi qua 5 nghiệp vụ: nhập hàng, bán hàng, hủy hóa đơn, trả hàng, điều chỉnh/kiểm kê. Mỗi lần thay đổi gồm `$inc` có điều kiện trên `inventoryStocks` và một bản ghi `inventoryTransactions` trong **cùng một transaction**.
- Không cho tồn kho âm (điều kiện `quantity ≥ qty` nằm ngay trong filter).
- Không có API nào cho phép đặt trực tiếp giá trị `quantity`.
- Kiểm kê: client gửi `countedQuantity` và `expectedSystemQuantity` (số hệ thống lúc bắt đầu đếm). Server áp dụng `delta = counted − current` với điều kiện `quantity == expectedSystemQuantity`. Nếu tồn kho đã thay đổi trong lúc đếm thì trả lỗi `STOCK_CHANGED_DURING_COUNT` để đếm lại hoặc xác nhận lại.
- Hàng sắp hết: `quantity ≤ minQuantity`.
- Trả hàng có cờ `restock`: hàng còn bán được thì nhập lại kho, hàng hỏng thì chỉ ghi nhận.

**Điểm:**
- `pointsBalance` luôn bằng tổng `loyaltyTransactions.points`. Sẽ có script `reconcile-loyalty` để kiểm tra.
- Khi hủy hóa đơn: ghi `REVOKE_EARN` (−pointsEarned) và `REFUND_REDEEM` (+pointsRedeemed).
- Khi trả hàng từng phần: `revoke = pointsEarned_gốc − floor(eligible_còn_lại / earnAmountPerPoint) − đã_thu_hồi_trước`. Điểm đã dùng được hoàn lại theo tỷ lệ của phần trả.
- Kết quả là tất định và không thu hồi vượt số điểm đã cộng.

**Định nghĩa các chỉ số báo cáo:**

| Chỉ số | Cách tính |
|---|---|
| Doanh số (gross sales) | Σ `subtotal` của hóa đơn COMPLETED / PARTIALLY_RETURNED / RETURNED |
| Giảm giá | Σ `promotionDiscount + pointsDiscount` |
| Hàng trả | Σ `salesReturns.refundAmount`, **ghi nhận vào ngày trả** (không sửa số liệu ngày bán) |
| **Doanh thu thuần** | Doanh số − Giảm giá − Hàng trả |
| Giá vốn hàng bán (COGS) | Σ `qty × unitCost` (snapshot) − giá vốn của hàng trả có nhập lại kho |
| **Lợi nhuận gộp** | Doanh thu thuần − COGS |
| Số hóa đơn / giá trị TB | Đếm hóa đơn không bị CANCELLED; giá trị TB = Doanh thu thuần / số hóa đơn |
| Hóa đơn hủy | **Loại hoàn toàn** khỏi doanh thu, thống kê riêng số lượng và giá trị |
| Giá trị nhập hàng | Σ `purchaseOrders.totalAmount` có trạng thái CONFIRMED. Báo cáo riêng, **không phải chi phí trong kỳ.** |
| Giá trị tồn kho | Σ `quantity × avgCost` |

## 7. Tình huống cạnh tranh dữ liệu và cách giải quyết

| # | Tình huống | Rủi ro | Giải pháp | Test kiểm chứng |
|---|---|---|---|---|
| 1 | Hai nhân viên cùng bán sản phẩm cuối cùng | Tồn kho âm, bán vượt | `$inc` có điều kiện `quantity ≥ qty`. MongoDB khóa ở cấp document nên chỉ một request thắng. Transaction phát hiện write conflict, request còn lại retry và nhận `INSUFFICIENT_STOCK`. | Gửi 10 checkout song song (`Promise.all`) với tồn kho = 1: đúng 1 thành công, tồn kho = 0, có đúng 1 bản ghi SALE |
| 2 | Hai request cùng xác nhận một phiếu nhập | Tồn kho cộng gấp đôi | Chuyển trạng thái có điều kiện `status: DRAFT`, kết hợp unique index `{refType,refId,productId,type}` trên `inventoryTransactions` | Gửi 2 confirm song song: 1 thành công, 1 nhận `PURCHASE_ORDER_NOT_DRAFT`, tồn kho chỉ cộng 1 lần |
| 3 | Client gửi lại request do timeout | Tạo 2 hóa đơn, trừ kho 2 lần | `idempotencyKey` (UUID do POS sinh cho mỗi lần thanh toán) với unique index; so sánh `requestHash`; xử lý lỗi duplicate key | Gửi tuần tự 2 lần và song song 2 lần cùng key: chỉ có 1 hóa đơn và 1 lần trừ kho. Cùng key nhưng khác payload: nhận `IDEMPOTENCY_KEY_REUSED`. |
| 4 | Tạo hóa đơn thành công nhưng cập nhật điểm thất bại | Khách mất điểm hoặc dữ liệu lệch | Hóa đơn, kho và điểm nằm trong **một transaction** nên hoặc thành công tất cả, hoặc không có gì. Các điều kiện nghiệp vụ của khách hàng (tồn tại, ACTIVE) được kiểm tra trước khi ghi. Unique index `{invoiceId, type:EARN}` chặn cộng điểm 2 lần. Script đối soát là lớp phòng vệ cuối. | Giả lập lỗi khi insert `loyaltyTransactions` (test hook hoặc mock): không có hóa đơn, tồn kho không đổi |
| 5 | Khách dùng điểm đồng thời ở nhiều hóa đơn | Dùng điểm vượt số dư | `$inc` có điều kiện `pointsBalance ≥ p` kết hợp transaction | Số dư 150, gửi 2 checkout song song mỗi cái dùng 100: 1 thành công, 1 nhận `INSUFFICIENT_POINTS`, số dư còn 50 |
| 6 | Khuyến mãi hết hạn ngay trước khi thanh toán | Khách thấy giá A nhưng bị tính giá B | Server luôn tính lại theo `now`. Nếu `payable ≠ expectedPayableAmount` thì trả `PRICE_CHANGED` kèm giá mới, thu ngân xác nhận rồi gửi lại. Client không bao giờ tự quyết định giá. | Preview khi khuyến mãi còn hiệu lực, đẩy `endAt` về quá khứ, checkout: nhận `PRICE_CHANGED`. Gửi lại với giá mới: thành công, không có khuyến mãi. |
| 7 | Hóa đơn bị hủy sau khi đã cộng điểm | Khách giữ điểm không hợp lệ | Hủy hóa đơn trong transaction: `status COMPLETED→CANCELLED` có điều kiện, nhập lại kho (SALE_CANCEL), REVOKE_EARN, REFUND_REDEEM | Hủy hóa đơn: điểm, kho và `usedCount` trở lại như trước. Hủy lần 2: nhận `INVOICE_NOT_CANCELLABLE`. Trường hợp khách đã tiêu hết điểm: xem Q2. |
| 8 | Nhân viên không có quyền điều chỉnh kho hoặc giá | Gian lận | Kiểm tra quyền tại resolver (`requirePermission`). `updateProduct` kiểm tra thêm quyền `PRODUCT_PRICE_UPDATE` nếu input có trường giá. Audit log ghi lại giá trước và sau. | CASHIER gọi `adjustInventory` hoặc `updateProduct{salePrice}`: nhận `FORBIDDEN`, dữ liệu không đổi |
| 9 | MongoDB mất kết nối giữa giao dịch | Dữ liệu dở dang | Transaction đảm bảo tính nguyên tử. `withTransaction` tự retry lỗi tạm thời. Retryable writes. `bufferCommands=false` để lỗi trả về ngay. Readiness trả 503. Client retry với **cùng `idempotencyKey`**. | Tạo lỗi ngay trước commit (abort giữa chừng): kiểm tra không có hóa đơn, tồn kho và điểm nguyên vẹn. Retry cùng key: thành công đúng 1 lần. |
| 10 | Sản phẩm ngừng kinh doanh vẫn nằm trong giỏ cũ | Bán hàng không được phép bán | Checkout chỉ chấp nhận sản phẩm `status=ACTIVE`. Preview trả cảnh báo. Lỗi `PRODUCT_NOT_SELLABLE` kèm danh sách sản phẩm. | Ngừng kinh doanh sản phẩm, rồi checkout giỏ có sản phẩm đó: bị từ chối, tồn kho không đổi |

Các nguyên tắc chung:
- **Transaction không phải giải pháp duy nhất.** Mỗi tình huống kết hợp nhiều lớp: điều kiện nguyên tử, kiểm tra trạng thái, unique index và idempotency.
- Các mutation khác có rủi ro chạy trùng cũng có `idempotencyKey`: `processReturn`, `adjustInventory`, `adjustLoyaltyPoints`.

## 8. Cấu trúc thư mục dự kiến

```
shop24h/
├── docker/
│   ├── mongo/init-replica.sh        # rs.initiate + tạo user ứng dụng
│   └── mongo/keyfile.sh             # sinh keyfile lúc container khởi động (không commit)
├── docs/
│   ├── database-design.md
│   ├── business-flows.md            # nhập hàng, bán hàng, khuyến mãi, tích điểm
│   └── api-examples.md
├── scripts/
│   ├── seed.ts
│   └── reconcile.ts                 # đối soát tồn kho và điểm với lịch sử giao dịch
├── src/
│   ├── config/                      # env.ts (validate env bằng zod), logger.ts
│   ├── common/
│   │   ├── errors/                  # AppError, error codes, formatError
│   │   ├── auth/                    # permissions.ts (RBAC matrix), requirePermission
│   │   ├── middleware/              # requestId, rateLimit, cors, helmet
│   │   ├── validation/              # zod helpers, phone, money, pagination
│   │   └── utils/                   # money, date (tz VN), code generator, normalize text
│   ├── database/                    # connect, withTransaction helper, health
│   ├── graphql/
│   │   ├── schema.ts                # gộp typeDefs và resolvers của các module
│   │   ├── context.ts               # user, storeId, loaders, requestId
│   │   ├── scalars/                 # DateTime, ObjectId, Money (Int đồng)
│   │   ├── plugins/                 # depth/complexity limit, logging
│   │   └── generated/               # output của graphql-codegen
│   ├── modules/
│   │   ├── auth/  users/  stores/  settings/  audit/
│   │   ├── categories/  products/  suppliers/
│   │   ├── purchasing/  inventory/
│   │   ├── promotions/
│   │   │   └── pricing/             # pricing engine (hàm thuần) và unit test
│   │   ├── sales/                   # checkout, cancel, returns
│   │   ├── customers/  loyalty/
│   │   └── reports/
│   │       # mỗi module: <name>.model.ts, <name>.graphql, <name>.inputs.ts (zod),
│   │       #             <name>.service.ts, <name>.resolver.ts, __tests__/
│   ├── app.ts                       # tạo Express app và Apollo (không listen, để test dùng)
│   └── server.ts                    # listen và graceful shutdown
├── test/
│   ├── setup/                       # MongoMemoryReplSet, factories, helper gọi GraphQL
│   └── integration/                 # test luồng qua GraphQL bằng supertest
├── Dockerfile  docker-compose.yml  .env.example  .dockerignore  .gitignore
├── codegen.ts  eslint.config.js  jest.config.ts  tsconfig.json  package.json
└── README.md
```

Trong mỗi module, các file nằm phẳng thay vì chia thư mục con `models/ services/ resolvers/`. Module nào cũng chỉ có vài file, nên tách thêm thư mục chỉ làm khó điều hướng.

**Docker Compose:**
- MongoDB 8 chạy `--replSet rs0` một node, có bật xác thực (keyfile sinh lúc khởi động).
- Healthcheck tự gọi `rs.initiate` nếu replica set chưa khởi tạo.
- Port chỉ bind `127.0.0.1`.
- App chạy multi-stage build với user non-root, có healthcheck `/health/ready`.

Bản giới thiệu API sơ bộ (đầy đủ sẽ có trong các file SDL):
- **Query:** `me, products, product, productByBarcode, categories, suppliers, purchaseOrders, purchaseOrder, inventoryStock(s), inventoryTransactions, lowStockProducts, promotions, promotion, previewCheckout, salesInvoice, salesInvoices, customerByPhone, customerPurchaseHistory, customerLoyaltyHistory, loyaltyPolicy, salesSummary, revenueByPeriod, topSellingProducts, revenueByCategory, inventorySummary, purchaseSummary, loyaltySummary`.
- **Mutation:** `login, refreshToken, logout, createUser, updateUser, setUserStatus, create/updateCategory, create/update/deactivateProduct, create/update/deactivateSupplier, create/update/confirm/cancelPurchaseOrder, adjustInventory, submitStocktake, create/update/deactivatePromotion, checkout, cancelSalesInvoice, processReturn, createCustomer, updateCustomer, adjustLoyaltyPoints, updateLoyaltyPolicy`.
- **Phân trang:**
  - Danh mục và danh sách quản trị dùng offset (`page`, `pageSize ≤ 100`).
  - Lịch sử có thể lớn (hóa đơn, giao dịch kho, điểm) dùng **cursor theo `(createdAt, _id)`**.

## 9. Kế hoạch triển khai và kiểm thử

| Giai đoạn | Nội dung | Kiểm tra khi kết thúc giai đoạn |
|---|---|---|
| 2. Khởi tạo | pnpm, TypeScript, ESLint/Prettier, Express và Apollo, Mongoose, env bằng zod, Docker Compose với replica set, health check, Jest với MongoMemoryReplSet | `pnpm typecheck && pnpm lint && pnpm test`, `docker compose up` thì `/health/ready` = 200; test chứng minh transaction rollback được |
| 3. Nền tảng | Users, sessions, login/refresh/logout (argon2id, rate limit và khóa tài khoản), RBAC, AppError/formatError, audit log, giới hạn depth/complexity, DataLoader | Test đăng nhập (đúng, sai, bị khóa, bị vô hiệu hóa), token hết hạn hoặc bị thu hồi, ma trận truy cập trái quyền |
| 4. Sản phẩm và kho | Categories, products, suppliers, purchasing, inventory, kiểm kê | CRUD và tìm kiếm, confirm phiếu nhập cập nhật kho và avgCost, confirm song song, điều chỉnh kho trái quyền, không xóa cứng sản phẩm đã có giao dịch |
| 5. Bán hàng | Pricing engine, preview/checkout, idempotency, cạnh tranh dữ liệu | Unit test pricing (7 loại khuyến mãi, ưu tiên, cộng dồn, làm tròn, payable ≥ 0); integration test cho tình huống 1, 3, 6, 9, 10 |
| 6. Khách hàng và điểm | Customers, tích và dùng điểm, hủy hóa đơn, trả hàng từng phần, điều chỉnh điểm | Tích điểm đúng, không cộng 2 lần, dùng vượt số dư, dùng đồng thời, thu hồi khi hủy hoặc trả; tình huống 4, 5, 7 |
| 7. Báo cáo và hoàn thiện | Aggregation báo cáo, seed dữ liệu đầy đủ, script đối soát, README và docs | Test báo cáo trên dataset cố định (đối chiếu số tính tay), tình huống 2 và 8 tổng hợp, chạy lại toàn bộ test suite |

Chiến lược kiểm thử:
- Unit test cho các hàm thuần (pricing, loyalty, phân bổ, chuẩn hóa).
- Integration test gọi `/graphql` qua supertest trên MongoMemoryReplSet. Đây là replica set thật nên transaction hoạt động thật, đúng yêu cầu không giả định chạy trên standalone.
- Test cạnh tranh dữ liệu dùng `Promise.all` và kiểm tra trạng thái DB sau đó: tồn kho, số bản ghi lịch sử, số dư điểm.

## 10. Câu hỏi cần anh/chị xác nhận

Mỗi câu đều có phương án em đề xuất. Nếu anh/chị đồng ý hết, chỉ cần trả lời "OK theo đề xuất".

1. **Dùng điểm để giảm giá có nằm trong MVP không?** Đề xuất: **có**, với các giá trị mặc định ở mục 5.4 (1 điểm = 100đ, tối thiểu 100 điểm, tối đa 50% hóa đơn). Anh/chị có thể muốn tỷ lệ khác.
2. **Hủy hoặc trả hàng khi khách đã tiêu hết điểm vừa được cộng?** Đề xuất: **cho phép số dư điểm âm**, khách không dùng được điểm cho đến khi dương trở lại. Lý do là không nên chặn việc hủy hay trả hàng. Phương án khác là chặn thao tác hủy.
3. **Phần tiền lẻ không đủ một đơn vị tích điểm:** đề xuất **bỏ, không cộng dồn sang hóa đơn sau**.
4. **Mua X tặng Y khác sản phẩm** (ví dụ mua 2 sữa tặng 1 bánh): đề xuất **thu ngân phải quét sản phẩm tặng vào giỏ** để trừ kho đúng, server giảm 100% giá sản phẩm đó. Nếu không quét thì không tự thêm vào.
5. **Giá vốn theo bình quân gia quyền di động** (A6): anh/chị có đồng ý không, hay muốn dùng FIFO hoặc giá nhập gần nhất?
6. **INVENTORY_STAFF có được tự xác nhận phiếu nhập không**, hay cần MANAGER duyệt? Đề xuất: **được**. Nếu muốn tách người tạo và người duyệt (maker-checker), em sẽ chặn người tạo tự xác nhận phiếu của mình.
7. **Hủy hóa đơn chỉ trong ngày, sau đó phải dùng trả hàng** (A9): thời hạn trả hàng là bao lâu? Đề xuất: **7 ngày**, cấu hình được.
8. **Giới hạn số lần áp dụng khuyến mãi (`maxUsage`)** tính theo số hóa đơn. Khi hủy hóa đơn có hoàn lại lượt không? Đề xuất: **có hoàn lại**.

Sau khi anh/chị xác nhận hoặc điều chỉnh, em sẽ lưu bản thiết kế này vào `docs/` rồi bắt đầu **Giai đoạn 2: Khởi tạo dự án**.