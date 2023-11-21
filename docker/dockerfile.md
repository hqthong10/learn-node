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
