// src/config/cronConfig.js
const { exampleJob } = require('../jobs/exampleJob');

const cronJobs = [
    {
        name: 'Example Job',
        schedule: '0 * * * *', // Mỗi giờ chạy một lần
        task: exampleJob,
        timezone: 'Asia/Ho_Chi_Minh', // Thay đổi nếu cần
    },
];

module.exports = { cronJobs };