- mongo container with password
  docker run -e MONGO_INITDB_ROOT_USERNAME=kimmoc -e MONGO_INITDB_ROOT_PASSWORD=abc123 --name mongo -p 27017:27017 -v $HOME/mongo:/data/db --rm -d mongo:latest --auth


# d
1. Build to image

```
docker build --rm --target development -t image_name:latest .
```

--rm: được sử dụng để xóa một container trung gian sau khi đã build thành công.
-f Tên_file: Bạn có thể tạo những file như Dockerfile.development. Với -f bạn có thể custom tên file
-t Tên_images_mới: Ở đây mình đang build images với tên là image_name. Trong thực tế người ta sẽ dùng thêm cả tag như lastest, development bằng cách thêm : và tên tag sau tên images như image_name:latest
.: Là context của docker. Bạn có thể ngầm hiểu là thư mục chứa Dockerfile cho đơn giản

2. Run

```
docker run -d -p 4000:3000 docker-examples:latest
docker run -p 3000:3000 -v .:/usr/src/app --name learn-nest learn-nest:latest
docker run docker-examples:latest
docker run -t -i docker-examples:latest node
```

--rm: Thường khi bạn stop docker thì docker đó sẽ ở trạng thái stop chứ không được terminate hoàn toàn. Thêm params này sẽ giúp terminate ngay khi stop
-d : chạy container trong background và trong ID container.
-p : xuất cổng container tới cổng máy cục bộ
-p l:c: l là port của máy tính của bạn và c là port của container. Params này sẽ có tác dụng map port. Nếu bạn sử dụng 80:3000 thì sẽ reverse port 3000 của container thành port 80 của máy tính
--name tên_container: đặt tên container giúp bạn có thể dễ dàng thao tác hơn
learn-nest:latest: tên images ở trên

3. Stop

```
docker stop learn-nest
```

4. Process

```
docker ps -a
```

5. Logs

```
docker logs -f container_name
```

6. Kill
   docker kill $(docker ps -q)

7. remove
   docker rm $(docker ps -a -q)

# create volume

```
docker volume create mongodb
docker volume create mongodb_config
```

# Create Network

```
docker network create mongodb
```

## Compose

1. up
   docker compose -f docker-compose.dev.yml up --build

2. down
   docker-compose down

# run

- 1: Normal
  docker run --rm -p 8081:8081 --name notes notes-service

- 2: attach it to the volumes and network
  docker run -it --rm -d -v mongodb:/data/db -v mongodb_config:/data/configdb -p 27017:27017 --network mongodb --name mongodb mongo

- 3: Set your environment variables
  docker run -it --rm -d --network mongodb --name notes -p 8081:8081 -e SERVER_PORT=8081 -e SERVER_PORT=8081 -e DATABASE_CONNECTIONSTRING=mongodb://mongodb:27017/yoda_notes notes-service

# Stop

docker stop notes mongodb

# Command

- List các container đang chạy
  docker ps

- Stop 1 container
  docker stop name

- Start lại 1 container đã dừng
  docker start name

- Xoá hoàn toàn 1 container
  docker rm name

- Inspect lại 1 container
  docker inspect name

- List các images
  docker images

- Xoá hoàn toàn 1 images
  docker rmi name


## docker-compose
0. build
   docker compose -f docker-compose.yml up --build

1. start
   docker-compose up

2. start background
   docker-compose up -d

3. stop
   docker-compose down

4. Tái xây dựng hình ảnh Docker
   docker-compose build

5. Logs
   docker-compose logs

6. Kiểm tra trạng thái container
   docker-compose ps


# docker-compose file
1. version
  Xác định phiên bản của Docker Compose. Các phiên bản phổ biến là 2, 2.1, 3, 3.8.
  Phiên bản quyết định các tính năng và cú pháp được hỗ trợ.
  ```
    version: '3.8'
  ```


# Câu hỏi và trả lời

- Docker volume được lưu ở đâu trong docker?
Volume được tạo và quản lý bởi Docker và không thể truy cập bằng thực thể khác docker. Nó được lưu trữ trong hệ thống file host Docker ở /var/lib/docker/volumes/ .

- Lệnh docker info là gì?
Lệnh lấy thông tin chi tiết về Docker được cài đặt trên hệ thống host. Thông tin có thể giống như số lượng container hoặc image và chúng đang chạy ở trạng thái nào và các thông số kỹ thuật phần cứng như tổng bộ nhớ được cấp phát, tốc độ của bộ xử lý, phiên bản kernel,…

- Ý nghĩa của các lệnh up, run và start của docker compose?
  + Sử dụng lệnh up để duy trì docker-compose (lý tưởng là mọi lúc), chúng ta có thể khởi động hoặc khởi động lại tất cả các mạng, dịch vụ và driver được liên kết với ứng dụng được chỉ định trong file docker-compos.yml. Bây giờ, nếu chúng ta đang chạy docker-compose ở chế độ “attached” thì tất cả log từ các container sẽ có thể truy cập được đối với chúng ta. Trong trường hợp docker-compose được chạy ở chế độ “detached”, thì khi các container được khởi động, nó sẽ thoát ra và không hiển thị log nào.
  + Sử dụng lệnh run, docker-compose có thể chạy các tác vụ một lần hoặc đột xuất dựa trên các yêu cầu nghiệp vụ. Ở đây, tên dịch vụ phải được cung cấp và docker chỉ bắt đầu dịch vụ cụ thể đó và cả các dịch vụ khác mà dịch vụ đích phụ thuộc (nếu có). Lệnh này hữu ích để kiểm tra container và cũng thực hiện các tác vụ như thêm hoặc xóa dữ liệu vào container,…
  + Sử dụng lệnh start, chỉ những container đó mới có thể được khởi động lại đã được tạo và sau đó dừng lại. Điều này không hữu ích cho việc tạo các container mới của riêng nó.

- Cách đăng nhập vào docker registry?
Sử dụng lệnh docker login để đăng nhập vào kho lưu trữ đám mây của riêng họ có thể được nhập và truy cập.

- Các instructions phổ biến trong Dockerfile?
  + FROM: dùng cho thiết lập image cơ sở cho instruction sắp tới. File docker được xem là hợp lệ nếu nó bắt đầu bằng FROM.
  + LABEL: dùng cho tổ chức image dựa trên dự án, module hoặc license. Nó còn giúp tự động hoá như một cặp key-value cụ thể trong khi xác định label mà sau này có thể được truy cập và xử lý theo chương trình.
  + RUN: dùng cho thực thi instruction theo sau nó trên top image hiện tại trong lớp mới. Lưu ý: mỗi lần thực thi lệnh RUN, chúng ta thêm các lớp trên image và sử dụng lớp đó cho các bước tiếp theo.
  + CMD: dùng cho cung cấp giá trị mặc định của container thực thi. Trong trường hợp nhiều lệnh CMD, lệnh cuối cùng sẽ được xem xét.