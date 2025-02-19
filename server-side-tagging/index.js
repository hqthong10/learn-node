const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route nhận dữ liệu từ web/app
app.post("/collect", async (req, res) => {
    try {
        const eventData = req.body; // Dữ liệu từ GTM Web Container
        console.log("Received event:", eventData);

        // Kiểm tra & lọc dữ liệu trước khi gửi đến GA4
        if (!eventData.client_id) {
            return res.status(400).json({ error: "Missing client_id" });
        }

        // Gửi request đến GA4
        const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
        const MEASUREMENT_ID = "G-XXXXXXXXXX"; // Thay bằng Measurement ID của bạn
        const API_SECRET = "YOUR_API_SECRET"; // Thay bằng API Secret từ GA4

        const gaPayload = {
            client_id: eventData.client_id,
            events: eventData.events || [],
        };

        await axios.post(`${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, gaPayload);

        res.json({ message: "Event sent to GA4" });
    } catch (error) {
        console.error("Error sending event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});




const axios = require("axios");

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Thay bằng Measurement ID của bạn
const API_SECRET = "YOUR_API_SECRET"; // Lấy từ Google Analytics Admin

const sendEventToGA = async () => {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${API_SECRET}`;

    const eventData = {
        client_id: "1234567890.0987654321", // ID người dùng (hoặc tự tạo)
        events: [
            {
                name: "purchase",
                params: {
                    currency: "USD",
                    value: 199.99,
                    transaction_id: "ORDER_12345",
                },
            },
        ],
    };

    try {
        const response = await axios.post(url, eventData);
        console.log("Sự kiện đã gửi thành công!", response.data);
    } catch (error) {
        console.error("Lỗi khi gửi sự kiện:", error.response ? error.response.data : error.message);
    }
};

sendEventToGA();