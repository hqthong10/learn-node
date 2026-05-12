# base
docker exec -it kafka <command>

- Liệt kê tất cả topic
docker exec -it kafka kafka-topics \
    --bootstrap-server localhost:9092 \
    --list


- Tạo topic
docker exec -it kafka kafka-topics \
    --create \
    --topic order_created \
    --partitions 3 \
    --replication-factor 1 \
    --bootstrap-server localhost:9092


- Xem chi tiết topic
docker exec -it kafka kafka-topics \
    --describe \
    --topic order_created \
    --bootstrap-server localhost:9092


- Xóa topic
docker exec -it kafka kafka-topics \
    --delete \
    --topic order_created \
    --bootstrap-server localhost:9092

Lưu ý: broker phải bật
    delete.topic.enable=true


- Gửi message bằng CLI (producer)
docker exec -it kafka kafka-console-producer \
    --topic order_created \
    --bootstrap-server localhost:9092

Sau đó gõ:
    hello
    order 1
    order 2


- Đọc message bằng CLI (consumer)
docker exec -it kafka kafka-console-consumer \
--topic order_created \
--from-beginning \
--bootstrap-server localhost:9092

Flag quan trọng:
--from-beginning: đọc từ đầu topic


- Consumer với group
docker exec -it kafka kafka-console-consumer \
--topic order_created \
--group test-group \
--bootstrap-server localhost:9092


- Xem consumer group
docker exec -it kafka kafka-consumer-groups \
--bootstrap-server localhost:9092 \
--list


- Xem consumer lag
docker exec -it kafka kafka-consumer-groups \
--bootstrap-server localhost:9092 \
--describe \
--group order-group

Lệnh rất quan trọng khi debug.


- Tăng số partition
docker exec -it kafka kafka-topics \
--alter \
--topic order_created \
--partitions 10 \
--bootstrap-server localhost:9092

⚠️ Kafka chỉ cho tăng partition, không giảm.


- Reset offset consumer
Ví dụ reset đọc lại từ đầu:
docker exec -it kafka kafka-consumer-groups \
--bootstrap-server localhost:9092 \
--group order-group \
--topic order_created \
--reset-offsets \
--to-earliest \
--execute


- Xem metadata cluster
docker exec -it kafka kafka-broker-api-versions \
--bootstrap-server localhost:9092


- Config retention cho topic
docker exec -it kafka kafka-configs \
--bootstrap-server localhost:9092 \
--entity-type topics \
--entity-name order-events \
--alter \
--add-config retention.ms=86400000


- Cách bật Log Compaction
docker exec -it kafka kafka-topics \
--create \
--topic user-state \
--bootstrap-server localhost:9092 \
--partitions 3 \
--replication-factor 1 \
--config cleanup.policy=compact