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
file: xác định loại file.
stat: xem metadata (quyền, thời gian tạo/sửa, inode...).
md5sum: tính mã băm MD5 để kiểm tra tính toàn vẹn.
sha256sum: tính mã băm SHA-256, an toàn hơn MD5.

  remve folder not empty
  rm -rf dir-name
  sudo chmod 777 foldername

# Database CLI
MySQL
mysql: đăng nhập và thao tác với MySQL.
mysqldump: sao lưu cơ sở dữ liệu.
Redis
redis-cli: kết nối Redis để kiểm tra key, cache, thống kê.
MongoDB
mongosh: shell tương tác với MongoDB.

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
  
-bash: tree: command not found

# git
	git pull: lấy và gộp thay đổi từ remote.
	git fetch: chỉ lấy thay đổi, chưa gộp.
	git log: xem lịch sử commit.
	git diff: so sánh thay đổi.
	git stash: cất tạm thay đổi chưa commit.

# Docker
	docker ps: xem container đang chạy.
	docker images: xem image.
	docker logs: xem log container.
	docker exec: chạy lệnh trong container.
	docker inspect: xem thông tin chi tiết.
	docker stats: xem CPU/RAM theo thời gian thực.
	docker network ls: xem network.
	docker volume ls: xem volume.

# Monitoring
dmesg: xem thông báo từ kernel.

iostat: thống kê I/O đĩa.

sar: thu thập và xem thống kê hiệu năng theo thời gian.

iotop: xem tiến trình đang đọc/ghi đĩa nhiều nhất.

# linux
- Hiển thị đường dẫn thư mục hiện tại:
    pwd

- Liệt kê file và thư mục
  	ls

- Hiển thị chi tiết
  	ls -l

- Hiện cả file ẩn
	ls -a

- Lệnh được dùng nhiều nhất.
  	ls -la

- Di chuyển thư mục.
	cd /path/to/directory
  
- Hiển thị toàn bộ file.
  	cat

- Mở file và cuộn lên xuống.
  	less

- Hiển thị đầu file.
	head
    head -n 10 file.txt

- Hiển thị cuối file.
	tail
	tail -n 10 file.txt

- Theo dõi log realtime.
  	tail -f
  
- Tạo thư mục mới:
    mkdir mydirectory
  
- Xóa file hoặc thư mục:
    rm file.txt
    rm -rf folder_name

- Sao chép file or thư mục:
    cp source.txt destination.txt
    cp -r source destination

- Di chuyển hoặc đổi tên file/thư mục.
    mv old.txt new.txt

- Tạo file rỗng
    touch new_file.txt

- Hiển thị thông tin hệ điều hành.
    uname -a

- Kiểm tra dung lượng ổ đĩa.
    df -h

- Xem thư mục chiếm bao nhiêu GB.
	du -sh

- Xem file chiếm bao nhiêu GB.
	du -sh filename

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

	+ Không phân biệt hoa thường.
		grep -i
	+ Hiện số dòng.
		grep -n
	+ Tìm trong toàn bộ thư mục.
		grep -r
  
- Thay đổi quyền truy cập file.
    chmod 777 file_name

- Thay đổi quyền sở hữu file.
    chown user:gruop file.txt

- Nén và giải nén
	+ Nén
		tar -cvf archive.tar folder_name
		zip (.zip)
		gzip (.gz)
	+ Giải nén
		tar -xvf archive.tar
		unzip (.zip)
		gunzip (.gz)

- Một số phím tắt CLI hữu ích
	Tab: Tự động hoàn thành lệnh hoặc tên file.
	Ctrl + C: Dừng lệnh đang chạy.
	Ctrl + L: Xóa màn hình terminal.
	Ctrl + R: Tìm kiếm trong lịch sử lệnh.
	!!: Chạy lại lệnh vừa thực thi.

- Tải file từ internet.
	wget

- Xử lý dữ liệu theo cột.
	awk
	ps aux | awk '{print $2}'

- Chỉnh sửa text.
	sed
	sed -i 's/localhost/127.0.0.1/g' .env

-  Sắp xếp
	sort names.txt

- ps process
    ps aux
    a: Liệt kê tất cả các tiến trình từ tất cả người dùng.
    u: Hiển thị chi tiết thông tin tiến trình theo định dạng thân thiện.
    x: Bao gồm các tiến trình không có terminal điều khiển.

  - Hiện uid, gid, group
  	id

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

- Dừng process.
	kill
	kill 12345

- Ép process dừng.
	kill -9

- Kill theo tên.
	pkill
	pkill node

- Tìm PID.
	pgrep
	pgrep nginx

- Hiển thị CPU, RAM, Swap, IO
	vmstat

- Server chạy bao lâu.
	uptime

- Xem port.
	ss
	ss -lnt

- Xem process đang dùng file hoặc port nào.
	lsof
	lsof -i :8080

- Kiểm tra DNS.
	dig

- Tra DNS.
	nslookup

- Xem đường đi của packet.
	traceroute

- Đăng nhập server.
	ssh

- Copy file.
	scp

- Đồng bộ file.
	rsync

- Quản lý service.
	systemctl
	systemctl restart nginx

- Xem log service.
	journalctl
	journalctl -u nginx

- Hiện toàn bộ biến môi trường.
	env

- Giống env.
	printenv

- Tạo biến môi trường.
	export

- Xem lịch chạy.
	crontab -l

- Sửa lịch.
	crontab -e

# Công cụ nâng cao
- strace: theo dõi các system call của tiến trình, rất hữu ích khi debug ứng dụng bị treo hoặc lỗi quyền.

- ltrace: theo dõi các lời gọi đến thư viện (library calls).

- tcpdump: bắt và phân tích gói tin mạng trực tiếp trên server.

- nc (Netcat): tạo kết nối TCP/UDP để kiểm tra cổng, gửi hoặc nhận dữ liệu.

- watch: chạy lặp lại một lệnh theo chu kỳ và hiển thị kết quả liên tục.

- xargs: chuyển đầu ra của một lệnh thành tham số đầu vào cho lệnh khác, rất mạnh khi kết hợp với find, grep.

- tee: vừa hiển thị kết quả ra màn hình vừa ghi vào file.
