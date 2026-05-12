- tải kafka
curl -O https://downloads.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz


- Giải nén:
tar -xzf kafka_2.13-3.7.0.tgz
cd kafka_2.13-3.7.0

Trong thư mục này có:
bin/
config/
libs/

Tất cả CLI nằm trong:
bin/

- base
bin/kafka-topics.sh
bin/kafka-console-producer.sh
bin/kafka-console-consumer.sh
bin/kafka-consumer-groups.sh
bin/kafka-configs.sh
bin/kafka-acls.sh