CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255), -- Chỉ sử dụng cho chat nhóm
    is_group BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE cho nhóm, FALSE cho cá nhân
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_members (
    conversation_id INT,
    user_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT,
    sender_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE message_read_status (
    message_id INT,
    user_id INT,
    read_at TIMESTAMP,
    PRIMARY KEY (message_id, user_id),
    FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tạo Cuộc Trò Chuyện Mới: Chat Cá Nhân
INSERT INTO conversations (is_group) VALUES (FALSE);

-- Tạo Cuộc Trò Chuyện Mới: Chat Nhóm
INSERT INTO conversations (name, is_group) VALUES ('Group Chat Name', TRUE);

-- Thêm Thành Viên Vào Cuộc Trò Chuyện
INSERT INTO conversation_members (conversation_id, user_id) VALUES (1, 2); -- thêm user_id 2 vào conversation_id 1

-- Gửi Tin Nhắn
INSERT INTO messages (conversation_id, sender_id, content) 
VALUES (1, 2, 'Hello, how are you?');

-- Lấy Tin Nhắn Trong Cuộc Trò Chuyện
SELECT m.message_id, m.content, m.created_at, u.username 
FROM messages m
JOIN users u ON m.sender_id = u.user_id
WHERE m.conversation_id = 1
ORDER BY m.created_at ASC;

-- Đánh Dấu Tin Nhắn Đã Đọc
INSERT INTO message_read_status (message_id, user_id, read_at) 
VALUES (1, 2, NOW()); -- user_id 2 đã đọc message_id 1

-- Kiểm Tra Tin Nhắn Đã Đọc
SELECT m.message_id, u.username, r.read_at
FROM messages m
LEFT JOIN message_read_status r ON m.message_id = r.message_id
LEFT JOIN users u ON r.user_id = u.user_id
WHERE m.conversation_id = 1 AND r.read_at IS NOT NULL;
