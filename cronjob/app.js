
import cron from 'node-cron';

const timeLog = () => {
    return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
        .format(new Date())
        .replace(',', '');
}

// Khởi chạy tất cả các jobs
export const initCronJobs = () => {
    try {
        console.log('vao day');
        cron.schedule(
            '*/2 * * * * *',
            () => {
                console.log(`[${timeLog()}] Example Job đang chạy...`);
            },
            {
                scheduled: true,
                timezone: 'Asia/Ho_Chi_Minh',
            }
        );
    } catch (error) {
        console.log('>> error', error);
    }
};
