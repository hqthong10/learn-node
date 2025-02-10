# start redis server:
  sudo service redis-server start

# stop ffmpeg on Mac:
  sudo killall ffmpeg

# unzip
  unzip -o file.zip

# call python3
  python3 file.py

# flutter build_runner
  flutter pub run build_runner build --delete-conflicting-outputs

# PostgreSql
brew services start postgresql@15

# rabbitmq
  brew services start rabbitmq
  brew services stop rabbitmq

# file
  remve folder not empty
  rm -rf dir-name
  sudo chmod 777 foldername

# mongodb
  mongodump --host <remote_host> --port <remote_port> --username <username> --password <password> --authenticationDatabase <auth_db> --db <database_name> --out ./path/to/dump_directory

  mongodump --host 149.28.138.234 --port 22 --username root --password Tung@001 --authenticationDatabase vhomenew --db vhomenew --out ./backup

  mongorestore --host localhost --port 27017 --username <username> --password <password> --authenticationDatabase <auth_db> --db <database_name> /path/to/dump_directory/<database_name>

  mongorestore --host localhost --port 27017 --username vhomelocal --password vhomelocal --authenticationDatabase vhomenew --db vhomenew /Documents/dev/vhomenew

# nginx
  - restart, reload, status:
    sudo systemctl restart nginx
    sudo systemctl reload nginx
    sudo systemctl status nginx

  - Hiển thị thông tin cấu hình và phiên bản của Nginx, bao gồm các module đã được biên dịch:
    nginx -V
  

# linux
  - ls -l

  - cd /path/to/directory
  
  - Hiển thị đường dẫn thư mục hiện tại:
    pwd
  
  - Tạo thư mục mới:
    mkdir mydirectory
  
  - Xóa file hoặc thư mục:
    rm file.txt
    rm -r folder_name   :  Xóa thư mục và nội dung bên trong

  - Sao chép file hoặc thư mục:
    cp source.txt destination.txt

  - Di chuyển hoặc đổi tên file/thư mục.
    mv old.txt new.txt

  - Tạo file rỗng
    touch new_file.txt

  - Hiển thị thông tin hệ điều hành.
    uname -a

  - Kiểm tra dung lượng ổ đĩa.
    df -h

  - Hiển thị thông tin về RAM và swap.
    free -h

  - Hiển thị các tiến trình đang chạy.
    top
    htop

  - Hiển thị tên người dùng hiện tại.
    whoami
  
  - Gửi request HTTP
    curl piepme.com

  - Kiểm tra kết nối mạng.
    ping google.com

  - Hiển thị thông tin mạng.
    ifconfig hoặc ip a

  - Tìm file
    find /path -name file_name

  - Tìm kiếm nội dung trong file
    grep "keyword" file.txt

  - Hiển thị nội dung file
    cat file.txt

  - Hiển thị phần đầu/cuối của file.
    head -n 10 file.txt
    tail -n 10 file.txt

  - Thay đổi quyền truy cập file.
    chmod 777 file_name

  - Thay đổi quyền sở hữu file.
    chown user:gruop file.txt

  - Nén và giải nén
    tar -cvf archive.tar folder_name   : Nén
    tar -xvf archive.tar               : Giải nén
    gzip/gunzip                        : Nén/giải nén file .gz

  - Một số phím tắt CLI hữu ích
    Tab: Tự động hoàn thành lệnh hoặc tên file.
    Ctrl + C: Dừng lệnh đang chạy.
    Ctrl + L: Xóa màn hình terminal.
    Ctrl + R: Tìm kiếm trong lịch sử lệnh.
    !!: Chạy lại lệnh vừa thực thi.
  
  - Tải file từ internet.
    wget
  
  - ps process
    ps aux
    a: Liệt kê tất cả các tiến trình từ tất cả người dùng.
    u: Hiển thị chi tiết thông tin tiến trình theo định dạng thân thiện.
    x: Bao gồm các tiến trình không có terminal điều khiển.

- Hiển thị thông tin chi tiết về bộ nhớ của một tiến trình
  pmap <PID>

- Thư mục /proc chứa thông tin chi tiết về các tiến trình.
  /proc

- Hiển thị thông tin chi tiết của một tiến trình
  cat /proc/<PID>/status

- Hiển thị các file mở bởi một tiến trình.
  lsof
  lsof -p <PID>

- Theo dõi các system calls và tín hiệu của tiến trình.
  strace -p <PID>

- Liệt kê tất cả các dịch vụ:
  systemctl list-units --type=service

- Kiểm tra trạng thái của một dịch vụ:
  systemctl status <service-name>
