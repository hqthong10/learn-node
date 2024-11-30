# Docker là gì?

Docker là một nền tảng mã nguồn mở giúp đơn giản hóa quá trình phát triển, triển khai và chạy các ứng dụng bằng cách sử dụng các container.

Docker container là một đơn vị phần mềm độc lập và có thể thực thi, chứa tất cả các thành phần cần thiết để chạy một ứng dụng.

# Lợi ích của Docker
Docker mang lại nhiều lợi ích cho quá trình phát triển và triển khai ứng dụng:

1. Tính nhất quán: Docker đảm bảo rằng ứng dụng sẽ hoạt động nhất quán trên nhiều môi trường khác nhau, từ máy phát triển đến máy chủ sản xuất.
2. Tính di động: Docker container có thể chạy trên nhiều nền tảng khác nhau, bao gồm máy tính cá nhân, máy chủ vật lý, máy ảo, và các dịch vụ đám mây.
3. Hiệu quả tài nguyên: Docker container nhẹ hơn so với máy ảo vì chúng chia sẻ kernel của hệ điều hành chủ và chỉ bao gồm các thành phần cần thiết để chạy ứng dụng.
4. Tính linh hoạt: Docker cho phép dễ dàng mở rộng và thu nhỏ ứng dụng bằng cách thêm hoặc xóa các container.
5. Tích hợp CI/CD: Docker tích hợp tốt với các công cụ CI/CD, giúp tự động hóa quá trình xây dựng, kiểm thử và triển khai ứng dụng.

# Kiến trúc của Docker Engine
Docker Engine là một ứng dụng client-server, Các thành phần chính của Docker Engine gồm có:

- Server hay còn được gọi là docker daemon (dockerd): chịu trách nhiệm tạo, quản lý các Docker objects như images, containers, networks, volume.

- REST API: docker daemon cung cấp các api cho Client sử dụng để thao tác với Docker

- Client là thành phần đầu cuối cung cấp một tập hợp các câu lệnh sử dụng api để người dùng thao tác với Docker. (Ví dụ docker images, docker ps, docker rmi image v.v..)


# Kiến trúc của Docker
Docker sử dụng mô hình kiến trúc client-server. Docker server (hay còn gọi là daemon) sẽ chịu trách nhiệm build, run, distrubute Docker container. Docker client và Docker server có thể nằm trên cùng một server hoặc khác server. Chúng giao tiếp với nhau thông qua REST API dựa trên UNIX sockets hoặc network interface.
Bao gồm các thành phần chính sau:

1. Docker Client: Docker client là giao diện dòng lệnh (CLI) cho phép người dùng tương tác với Docker daemon. Người dùng có thể sử dụng Docker client để gửi các lệnh như docker build, docker pull, docker run đến Docker daemon.

2. Docker Daemon: Docker daemon chạy trên hệ điều hành máy chủ và chịu trách nhiệm quản lý các container Docker. Docker daemon nhận các lệnh từ Docker client và thực hiện các tác vụ như xây dựng, chạy và phân phối các container.

3. Docker Registry: Docker registry là nơi lưu trữ các Docker image. Docker Hub là một registry công cộng phổ biến, nhưng người dùng cũng có thể thiết lập registry riêng của mình. Docker client có thể kéo (pull) các image từ registry và đẩy (push) các image lên registry.

4. Docker Objects: Các đối tượng Docker bao gồm Docker images, containers, networks và volumes. Docker images là các mẫu chỉ đọc dùng để tạo container. Docker containers là các instance đang chạy của Docker images. Docker networks cho phép các container giao tiếp với nhau. Docker volumes cung cấp khả năng lưu trữ dữ liệu bền vững cho các container.

# Các Thành Phần Chính của Docker Object
1. Image: Docker container được tạo ra từ Docker image. Docker image là một mẫu chỉ đọc chứa tất cả các thành phần cần thiết để chạy một ứng dụng.
Docker image là một mẫu chỉ đọc chứa tất cả các thành phần cần thiết để chạy một ứng dụng, bao gồm mã nguồn, runtime, thư viện, và các công cụ hệ thống. Docker image được xây dựng từ một file cấu hình gọi là Dockerfile. Dockerfile chứa các lệnh để xây dựng image, chẳng hạn như cài đặt các gói phần mềm và sao chép mã nguồn vào image.

2. Container Runtime: Docker container chạy trên một container runtime, chẳng hạn như Docker Engine.
Docker container là một instance đang chạy của Docker image. Container cung cấp một môi trường cách ly để chạy ứng dụng, giúp đảm bảo rằng ứng dụng sẽ hoạt động nhất quán trên nhiều môi trường khác nhau. Container chia sẻ kernel của hệ điều hành chủ, nhưng có hệ thống file, mạng và không gian tiến trình riêng.

3. Filesystem: Mỗi container có một hệ thống file riêng biệt, được tạo ra từ Docker image.

4. Networking: Docker container có thể giao tiếp với các container khác và với mạng bên ngoài thông qua các mạng Docker.

5. Isolation: Docker container cung cấp một môi trường cách ly cho ứng dụng, giúp ngăn chặn xung đột giữa các ứng dụng.

# Docker Hub
Docker Hub là một dịch vụ lưu trữ và chia sẻ các container image do Docker cung cấp. Đây là kho lưu trữ container image lớn nhất thế giới, cho phép các nhà phát triển và cộng đồng mã nguồn mở tìm kiếm, sử dụng và chia sẻ các container image. Docker Hub cung cấp một nền tảng để lưu trữ các image công khai hoặc riêng tư, giúp các nhóm phát triển và doanh nghiệp dễ dàng quản lý và phân phối các ứng dụng container hóa.

## Các Tính Năng Chính của Docker Hub
- Docker Hub cung cấp nhiều tính năng hữu ích cho việc quản lý và chia sẻ container image:

1. Repositories: Docker Hub cho phép người dùng tạo các repository để lưu trữ và quản lý các container image. Người dùng có thể đẩy (push) và kéo (pull) các image từ repository này.

2. Teams & Organizations: Docker Hub hỗ trợ việc quản lý quyền truy cập cho các nhóm và tổ chức, cho phép các thành viên trong nhóm hoặc tổ chức truy cập vào các repository riêng tư.

3. Docker Official Images: Docker Hub cung cấp các image chính thức được Docker xác thực, đảm bảo chất lượng và bảo mật.

4. Docker Verified Publisher Images: Docker Hub cũng cung cấp các image từ các nhà cung cấp đã được xác thực, đảm bảo chất lượng và độ tin cậy.

5. Builds: Docker Hub có thể tự động xây dựng các container image từ mã nguồn trên GitHub hoặc Bitbucket và đẩy chúng lên Docker Hub.

6. Webhooks: Docker Hub hỗ trợ webhooks để kích hoạt các hành động sau khi đẩy thành công một repository, giúp tích hợp Docker Hub với các dịch vụ khác.

7. Docker Hub CLI Tool và API: Docker Hub cung cấp công cụ dòng lệnh (CLI) và API để tương tác với Docker Hub, giúp tự động hóa các quy trình quản lý container image.

- Lợi Ích của Docker Hub
Docker Hub mang lại nhiều lợi ích cho các nhà phát triển và doanh nghiệp:

1. Thư Viện Image Lớn: Docker Hub là kho lưu trữ container image lớn nhất thế giới, với hàng trăm nghìn image từ cộng đồng và các nhà cung cấp đã được xác thực. Điều này giúp người dùng dễ dàng tìm kiếm và sử dụng các image chất lượng cao.

2. Bảo Mật: Docker Hub cung cấp các tính năng bảo mật như quét lỗ hổng bảo mật cho các image và hỗ trợ xác thực hai yếu tố (2FA) để bảo vệ tài khoản người dùng.

3. Tích Hợp CI/CD: Docker Hub hỗ trợ tích hợp với các công cụ CI/CD như GitHub và Bitbucket, giúp tự động hóa quy trình xây dựng và triển khai ứng dụng.

4. Quản Lý Quyền Truy Cập: Docker Hub cho phép quản lý quyền truy cập cho các repository riêng tư, giúp các nhóm và tổ chức dễ dàng kiểm soát ai có thể truy cập và sử dụng các image.

5. Tính Di Động: Docker Hub giúp các nhà phát triển dễ dàng chia sẻ và phân phối các container image, đảm bảo rằng ứng dụng có thể chạy nhất quán trên nhiều môi trường khác nhau.


# Các Câu Lệnh Docker Container Cơ Bản
- docker --version: Hiển thị phiên bản Docker hiện tại
```
docker --version
```

- docker pull: Kéo một Docker image từ Docker Hub.
```
docker pull <image_name>
```

- Docker build: Sử dụng lệnh docker build để xây dựng Docker image từ Dockerfile

```
docker build -t my-image .
```

- docker images
Lệnh docker images sẽ liệt kê tất cả các image đang có
```
docker images
```

- docker search images
Lệnh docker search images liệt kê tất cả các image đang có trên docker hub

```
docker search images
```

- docker pull
Lệnh docker pull sẽ download image từ docker hub

```
docker pull image_name
```
- docker push
Sử dụng lệnh docker push để đẩy Docker image lên Docker Hub

```
docker push <your-username>/my-first-repo
```

- docker run

Lệnh docker run tạo và chạy một container từ một Docker image. Đây là lệnh quan trọng nhất trong Docker vì nó cho phép bạn kiểm soát hành vi của container bằng cách chỉ định tên container, image và nhiều tùy chọn khác.

```
docker run -d --name my-container nginx
docker run -d -p 8080:8080 --name my-container my-image
```
Lệnh trên sẽ tạo và chạy một container từ image nginx và đặt tên cho container là my-container.

- docker create
Lệnh docker create tạo một container mới từ một Docker image nhưng không khởi động nó. Lệnh này hữu ích khi bạn muốn thiết lập cấu hình container trước khi khởi động.

```
docker create --name my-container nginx
```
Lệnh trên sẽ tạo một container từ image nginx và đặt tên cho container là my-container.

- docker start
Lệnh docker start khởi động một container đã được tạo trước đó.

```
docker start my-container
```
Lệnh trên sẽ khởi động container có tên my-container.

- docker stop
Lệnh docker stop dừng một hoặc nhiều container đang chạy.

```
docker stop my-container
```
Lệnh trên sẽ dừng container có tên my-container.

- docker restart
Lệnh docker restart khởi động lại một hoặc nhiều container đang chạy.

```
docker restart my-container
```
Lệnh trên sẽ khởi động lại container có tên my-container.

- docker pause
Lệnh docker pause tạm dừng các tiến trình bên trong một container đang chạy.

```
docker pause my-container
```
Lệnh trên sẽ tạm dừng container có tên my-container.

- docker unpause

Lệnh docker unpause tiếp tục các tiến trình bên trong một container đã bị tạm dừng.

```
docker unpause my-container
```
Lệnh trên sẽ tiếp tục container có tên my-container.

- docker rm

Lệnh docker rm xóa một hoặc nhiều container đã dừng.

```
docker rm my-container
```
Lệnh trên sẽ xóa container có tên my-container

- docker rmi: Xóa một Docker image.

```
docker rmi <image_name>
```

- docker ps

Lệnh docker ps liệt kê tất cả các container đang chạy.

```docker ps```
Lệnh trên sẽ liệt kê tất cả các container đang chạy.

- docker ps -a

Lệnh docker ps -a liệt kê tất cả các container, bao gồm cả các container đã dừng.
```
docker ps -a
```
Lệnh trên sẽ liệt kê tất cả các container, bao gồm cả các container đã dừng.

- docker stats

Lệnh docker stats hiển thị thống kê sử dụng tài nguyên theo thời gian thực cho một hoặc nhiều container.
```
docker stats my-container
```
Lệnh trên sẽ hiển thị thống kê sử dụng tài nguyên cho container có tên my-container.

- docker logs
Lệnh docker logs hiển thị các log được tạo ra bởi container.

```
docker logs my-container
```
Lệnh trên sẽ hiển thị các log của container có tên my-container.

- docker inspect
Lệnh docker inspect trả về thông tin chi tiết về một hoặc nhiều container.

```
docker inspect my-container
```
Lệnh trên sẽ trả về thông tin chi tiết về container có tên my-container.

# Dockerfile
Một file văn bản chứa các lệnh để xây dựng Docker Image. Mỗi lệnh trong Dockerfile tạo ra một lớp mới trong Docker Image.

```
# Sử dụng image chính thức của Node.js làm base image
FROM node:18

# Chỉ thị LABEL được sử dụng để thêm metadata vào image, chẳng hạn như thông tin về phiên bản, tác giả, hoặc mô tả.
LABEL maintainer="yourname@example.com"
LABEL version="1.0"
LABEL description="This is a sample image"

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các phụ thuộc của ứng dụng
RUN npm install

# Sao chép mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# Mở cổng 8080 để truy cập ứng dụng
EXPOSE 8080

# Chạy ứng dụng khi container khởi động
CMD ["node", "app.js"]
```

# Docker Compose

```
version: '3.8'  # Xác định phiên bản của Docker Compose

services: # Dịch vụ ứng dụng
  app:
    build:
      context: ./app
      dockerfile: Dockerfile  # Đường dẫn tới Dockerfile
    
    image: my_app_image  # Image Docker sử dụng, hoặc build từ Dockerfile
    
    container_name: my_app_container  # Đặt tên cho container
    
    command: npm start  # Lệnh để khởi động container
    
    ports:
      - "3000:3000"  # Ánh xạ cổng giữa máy chủ và container
    
    volumes:
      - ./code:/usr/src/app  # Mount volume từ máy chủ vào container
    
    environment:
      - NODE_ENV=production  # Biến môi trường
      - API_URL=http://db:3306  # Biến môi trường gọi API của DB
    
    depends_on:
      - db  # Khởi động sau dịch vụ db
    
    networks:
      - app-network  # Định nghĩa mạng sử dụng
    
    restart: always  # Chính sách khởi động lại container nếu lỗi
    
    expose:
      - "3000"  # Expose cổng của container nhưng không ánh xạ ra ngoài
    
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]  # Kiểm tra sức khỏe dịch vụ
      interval: 30s
      timeout: 10s
      retries: 3
    
    logging:
      driver: json-file  # Sử dụng log driver json-file
      options:
        max-size: "10m"
        max-file: "3"
    
    extra_hosts:
      - "host.docker.internal:host-gateway"  # Thêm ánh xạ host
    
    ulimits:
      nofile:
        soft: 20000
        hard: 40000
    
    tty: true  # Mở terminal cho container
    
    stdin_open: true  # Cho phép mở terminal tương tác

  # Dịch vụ database (ví dụ với MySQL)
  db:
    image: mysql:8  # Sử dụng image MySQL từ Docker Hub
    container_name: my_db_container  # Đặt tên cho container
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword  # Thiết lập biến môi trường cho MySQL
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"  # Ánh xạ cổng của MySQL
    volumes:
      - db-data:/var/lib/mysql  # Mount volume cho database
    networks:
      - app-network  # Kết nối với mạng

volumes:
  db-data:  # Volume để lưu trữ dữ liệu của MySQL

networks:
  app-network:  # Mạng bridge để kết nối giữa các dịch vụ
    driver: bridge
```