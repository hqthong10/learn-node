# 02 — Cài đặt

[← Mục lục](README.md) · Trước: [01 — Khái niệm](01-concepts.md) · Tiếp: [03 — CLI](03-cli.md)

## 1. Chạy Kafka bằng Docker (khuyên dùng)

### Cách mới: KRaft (không cần ZooKeeper)

Kafka 3.3+ dùng KRaft, Kafka 4.0 bỏ hẳn ZooKeeper. Dự án mới nên dùng cách này.

```yaml
# docker-compose.yml
services:
  kafka:
    image: confluentinc/cp-kafka:7.6.0
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk      # chuỗi base64 bất kỳ, cố định
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller  # 1 node làm cả hai vai
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:29092,CONTROLLER://0.0.0.0:9093,EXTERNAL://0.0.0.0:9092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,EXTERNAL://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      # chỉ 1 broker nên các topic nội bộ phải để replication 1
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_LOG_RETENTION_HOURS: 168
```

File [docker-compose.yml](docker-compose.yml) trong thư mục này chính là cấu hình trên, kèm sẵn Kafka UI (mục 3).

> Tài liệu cũ hay hướng dẫn kèm container `zookeeper` và `KAFKA_ZOOKEEPER_CONNECT` — cách này không còn được hỗ trợ từ Kafka 4.0.

### Khởi động

```bash
docker compose up -d
docker compose logs -f kafka       # chờ thấy "Kafka Server started"
docker compose down                # tắt
docker compose down -v             # tắt và xóa dữ liệu
```

---

## 2. Hiểu listener (hay gây lỗi nhất)

Client kết nối tới broker qua địa chỉ broker **quảng bá** (`ADVERTISED_LISTENERS`), không phải địa chỉ bạn gõ ban đầu.

| Client chạy ở đâu | Dùng địa chỉ |
|---|---|
| Máy host (Node.js app, terminal) | `localhost:9092` |
| Container khác cùng docker network | `kafka:29092` |
| Bên trong chính container kafka | `localhost:9092` hoặc `kafka:29092` |

> Kết nối được nhưng treo / báo `Connection refused` tới một host lạ → gần như chắc chắn sai `ADVERTISED_LISTENERS`.

---

## 3. Giao diện web (tùy chọn)

Thêm vào `docker-compose.yml` để xem topic, message, group bằng trình duyệt:

```yaml
  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092
    depends_on:
      - kafka
```

Mở http://localhost:8080.

---

## 4. Cài CLI trên máy (không dùng Docker)

```bash
curl -O https://downloads.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz
tar -xzf kafka_2.13-3.7.0.tgz
cd kafka_2.13-3.7.0
```

Thư mục gồm `bin/` (CLI), `config/`, `libs/`. Các lệnh chính:

```
bin/kafka-topics.sh             quản lý topic
bin/kafka-console-producer.sh   gửi message
bin/kafka-console-consumer.sh   đọc message
bin/kafka-consumer-groups.sh    quản lý group, lag, offset
bin/kafka-configs.sh            đổi cấu hình topic/broker
bin/kafka-acls.sh               phân quyền
```

> Tên lệnh khác nhau tùy nơi chạy:
> - Bản tải từ Apache / image `apache/kafka`: `kafka-topics.sh` (có `.sh`, image apache nằm ở `/opt/kafka/bin/`)
> - Image Confluent (`confluentinc/cp-kafka`): `kafka-topics` (không có `.sh`)
>
> Tài liệu này dùng cú pháp Confluent.

macOS cũng có thể `brew install kafka`.

---

## 5. Cài thư viện Node.js

```bash
npm install kafkajs
```

Tiếp tục ở [04 — Node.js](04-nodejs.md).
