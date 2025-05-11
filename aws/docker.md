1. Cập nhật hệ thống
sudo yum update -y

2. Cài Docker
sudo dnf install -y docker
sudo yum install -y docker

3. Khởi động Docker và bật chạy cùng hệ thống
sudo systemctl start docker
sudo systemctl enable docker

4. Kiểm tra Docker đã hoạt động chưa
docker --version

5. (Tuỳ chọn) Chạy Docker không cần sudo
sudo usermod -aG docker $USER