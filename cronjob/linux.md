# 
find /path/to/folder -type f -mtime +7 -delete

-type f → chỉ file (không xóa folder)
-mtime +7 → file sửa đổi > 7 ngày
-delete → xóa

- Chạy mỗi ngày lúc 02:00 sáng
0 2 * * * find /path/to/folder -type f -mtime +7 -delete

- Chạy mỗi giờ
0 * * * * find /path/to/folder -type f -mtime +1 -delete

- Chỉ thứ 2–6
0 2 * * 1-5 find /path/to/folder -type f -mtime +7 -delete

# Mở crontab
crontab -e

# file .sh
#!/bin/bash
TARGET_DIR="/path/to/folder"
LOG="/var/log/cleanup.log"

find "$TARGET_DIR" -type f -mtime +7 -delete >> "$LOG" 2>&1

# list
crontab -l
