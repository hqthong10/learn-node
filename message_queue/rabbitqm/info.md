# Khai niem
RabbitMQ là một message broker (MOM - Message-Oriented Middleware), sử dụng giao thức AMQP (Advanced Message Queue Protocol). RabbitMQ là một phần mềm trung gian được sử dụng như là phương tiện liên lạc giữa các ứng dụng, dịch vụ với nhau.

- Một message queue gồm có:
    + Producer: là ứng dụng client, tạo message và publish tới broker.
    + Consumer: là ứng dụng client khác, kết nối đến queue, subscribe (đăng ký) và xử lý (consume) message.
    + Broker (RabbitMQ): nhận message từ Producer, lưu trữ chúng an toàn trước khi được lấy từ Consumer.
    
# setup
- docker
    docker run --name rabbitmq -p 5672:5672 rabbitmq
