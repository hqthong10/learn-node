# Bài 1 — Thiết kế Redis cho Video Conference Room
- Room info: hash
    room:{id}
        - name
        - createAt
        ...

- List user trong room: set
    room:{id}:users = {user1, user2, user3}

- List producer/consumer: set
    room:{id}:producers = {p1, p2, p3}
    room:{id}:consumers = {c1, c2, c3}

- Mapping user → track (audio/video): zset
    room:{id}:user:{userid}:track:audio = {audio1, audio2}
    room:{id}:user:{userid}:track:video = {video1, video2}

- Stream state per user: string
    room:{id}:user:{userid}:state = status

- Danh sách active room: set
    room:actives = {room1id, room2id, room3id}

👉 Hãy đưa ra cấu trúc key + data type.


# Bài 2 — Thiết kế Redis cho bãi giữ xe nâng cao
- Lưu camera frame buffer (10 frame gần nhất)
parking:gate:{id}:camera:{cameraid}:frames (LIST)

- Lưu state camera (online/offline/error)
parking:gate:{id}:camera:{cameraid}:state (String)

- Lưu danh sách xe vừa vào trong 5 phút qua
parking:activeVehicles (zset)

- Lưu danh sách phân quyền nhân viên (cardId, permissionList)
parking:employee:{id}:cards (set)
parking:employee:{id}:permissions (set)

👉 Hãy trình bày bằng cấu trúc key + data type.

# Bài 3 — Thiết kế Redis cho hệ thống xử lý job AI
- Queue xử lý OCR
- Worker list
- Job retry count
- Log job (10 log gần nhất)
- Statistics (số job thành công/ngày, số job lỗi/ngày)

👉 Hãy đề xuất key + data type + TTL.