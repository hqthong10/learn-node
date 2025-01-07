# Liquid

Liquid là một mã nguồn mở, Ngôn ngữ mẫu được sáng tạo bởi Shopify dựa trên nền tảng ngôn ngữ Ruby.

Nó là thành phần chính của các theme trong Shopify và được sử dụng để tải các nội dung động lên giao diện các cửa hàng.

Liquid sử dụng sự kết hợp các tag (nhãn), object (đối tượng) và filter (bộ lọc) để tải những nội dung động.

Chúng được sử dụng bên trong các tài liệu mẫu của Liquid, nhóm các tệp tin này tạo thành một theme.

### **Cấu trúc của Liquid**

- Objects: Được đại diện bởi các thẻ và cho phép bạn truy cập vào dữ liệu của cửa hàng.
- Tags: Cho phép bạn tạo logic trong các mẫu (templates).
- Filters: Cho phép bạn định dạng dữ liệu được hiển thị.


### **Các thành phần cơ bản của Liquid**

#### **Tag**

Liquid tags là những logic của chương trình để điều khiển những gì các template thực hiện. Tags nằm trong khối:{% %}.

```
{% if user.name == 'Nguyễn Văn A' %}
  Xin chào Nguyễn Văn A
{% endif %}

{% if product.available %}
  <p>Sản phẩm này có sẵn.</p>
{% else %}
  <p>Sản phẩm này không có sẵn.</p>
{% endif %}
```

Một số tag phổ biến khác bao gồm:

- {% for %}: Dùng để lặp qua một danh sách các item.
- {% include %}: Chèn một mẫu khác vào trong mẫu hiện tại.
- {% assign %}: Gán giá trị cho một biến.

### **Object**

Objects cho phép bạn truy cập vào dữ liệu của cửa hàng Shopify. Các object được đặt trong cặp dấu ngoặc nhọn đôi {{ }}.

Objects Liquid bao gồm nhiều thuộc tính để xuất nội dung động lên một trang.

Ví dụ, đối tượng product chứa 1 thuộc tính được gọi là title, thuộc tính này được sử dụng để xuất ra tên của một sảm phẩm.

```
{{ shop.name }}  <!-- Hiển thị tên cửa hàng -->
{{ product.title }}  <!-- Hiển thị tiêu đề sản phẩm -->
```

1. Global Objects

Những đối tượng dưới đây có thể được sử dụng và truy cập từ bất cứ tập tin nào trong theme của bạn, và được xác định như đối tượng toàn cục hoặc biến toàn cục.

2. Blogs

Đối tượng Liquid blogs dẫn tới đường link các bài viết trên giao diện cửa hàng của bạn

```
<ul>
  {% for article in blogs.myblog.articles  %}
   <li>{{ article.title | link_to: article.url }}</li>
  {% endfor %}
</ul>
```

3. Cart

Đối tượng Liquid cart dẫn tới giỏ hàng trong cửa hàng của bạn

4. Collections

Đối tượng liquid collections bao gồm một danh sách tất cả các bộ sưu tập trong cửa hàng

```
{% for product in collections.frontpage.products %}
  {{ product.title }}
{% endfor %}
```

5. current_page

Đối tượng current_page trả về số trang bạn đang duyệt thông qua thông tin về phân trang

```
{% if current_page != 1 %} Page {{ current_page }}{% endif %}
```

6. current_tags

Đối tượng current_tags sẽ bao gồm những danh sách các tag khác nhau dựa trên loại template mà nó đưa ra

```
{% if current_tags %}
  <h1>{{ blog.title | link_to: blog.url }} › {{ current_tags.first }}</h1>
{% else %}
  <h1>{{ blog.title }}</h1>
{% endif %}
```

7. customer

Đối tượng customer chỉ được định nghĩa khi một khách hàng đăng nhập vào cửa hàng.

```
{% if shop.customer_accounts_enabled %}
  {% if customer %}
    <a href="/account">My Account</a>
    {{ 'Log out' | customer_logout_link }}
  {% else %}
    {{ 'Log in' | customer_login_link }}
    {% if shop.customer_accounts_optional %}
      {{ 'Create an account' | customer_register_link }}
    {% endif %}
  {% endif %}
{% endif %}
```

8. linklists

Đối tượng linklists bao gồm một bộ sư tập tất cả các liên kết trong cửa hàng của bạn. Bạn có thể truy cập một linklist bằng cách gọi handle của nó trên linklists.

```
<ul>
 {% for link in linklists.categories.links %}
    <li>{{ link.title | link_to: link.url }}</li>
  {% endfor %}
</ul>
```

9. pages

Đối tượng pages tham chiếu đến tất cả các trang trong cửa hàng của bạn.

```
<h1>{{ pages.about.title }}</h1>
<p>{{ pages.about.author }} says...</p>
<div>{{ pages.about.content }}</div>
```

10. page_description

Người bán có thể định rõ một page_description. Trường này sẽ tự động được gắn với sản phẩm/ bộ sưu tập/ mô tả khoản mục

```
{% if page_description %}
  <meta name="description" content="{{ page_description }}" />
{% endif %}
```

11. page_title

Đối tượng page_title trả vè tên của trang hiện tại

```
{{ page_title }}
```

12. shop

Đối tượng shop trả về thông tin về cửa hàng (website) của bạn.

13. template

Đối tượng template trả về tên của template được sử dụng để hiển thị trang hiện tại, bỏ qua phần mở rộng .liquid. Đây là cách tốt nhất để bạn sử dụng đối tượng template trong một lớp

```
{% if template contains 'product' %}
  WE ARE ON A PRODUCT PAGE.
{% endif %}
```

14. settings

Đối tượng settings giúp bạn truy cập tới tất cả các cài đặt của theme.

```
{% if settings.use_logo %}
{{ 'logo.png' | asset_url | img_tag: shop.name }}
{% else %}
<span class="no-logo">{{ shop.name }}</span>
{% endif %}
{% if settings.featured_collection and settings.featured_collection != '' and collections[settings.featured_collection].handle == settings.featured_collection and collections[settings.featured_collection].products_count > 0 %}
{% for product in collections[settings.featured_collection].products %}
  {% include 'product-loop' %}
{% endfor %}
{% endif %}
```

15. theme

Đối tượng theme miêu tả theme hiện đang sử dụng/.

```
Go to your <a href="/admin/themes/{{ theme.id }}/settings">Customize theme page</a>.
```

16. themes

Đối tượng themes cung cấp quyền truy cập tới các theme công khai của các cửa hàng.

```
We have a beautiful mobile theme, it's called {{ themes.mobile.name | link_to_theme: "mobile" }}
```

### Filters

Filters được sử dụng để định dạng dữ liệu. Các filter được đặt sau object và được ngăn cách bằng dấu |.

```
{{ product.price | money }}  <!-- Định dạng giá tiền -->
{{ "shopify" | upcase }}  <!-- Chuyển đổi thành chữ hoa -->
```

### Ví dụ

- **Hiển thị danh sách sản phẩm**

```
<ul>
  {% for product in collections.frontpage.products %}
    <li>
      <h2>{{ product.title }}</h2>
      <p>{{ product.price | money }}</p>
      {% if product.available %}
        <p>Available</p>
      {% else %}
        <p>Out of Stock</p>
      {% endif %}
    </li>
  {% endfor %}
</ul>
```

- **Hiển thị thông tin khách hàng**

```
{% if customer %}
  <p>Chào, {{ customer.first_name }}!</p>
  <p>Bạn có {{ customer.orders_count }} đơn hàng.</p>
{% else %}
  <p>Chào, khách hàng!</p>
{% endif %}
```