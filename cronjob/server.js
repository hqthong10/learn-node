// src/server.js
require('dotenv').config();
const { initCronJobs } = require('./app');

const startServer = async () => {
    try {
        console.log('Khởi động Cron Server...');
        initCronJobs();
        console.log('Cron Server đã sẵn sàng.');
    } catch (error) {
        console.error('Lỗi khi khởi động server:', error);
        process.exit(1);
    }
};

startServer();
