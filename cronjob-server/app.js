// src/app.js
const cron = require('node-cron');
const { cronJobs } = require('./config/cronConfig');

// Khởi chạy tất cả các jobs
const initCronJobs = () => {
    cronJobs.forEach((job) => {
        cron.schedule(job.schedule, job.task, {
            scheduled: job.scheduled || true,
            timezone: job.timezone || 'UTC',
        });
        console.log(`Job "${job.name}" được khởi chạy với lịch: ${job.schedule}`);
    });
};

module.exports = { initCronJobs };
