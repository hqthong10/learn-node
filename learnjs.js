function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const log = debounce(() => console.log("Hello!"), 1000);
log();
log();
log(); // Chỉ chạy 1 lần sau 1 giây
log(); // Chỉ chạy 1 lần sau 1 giây
log(); // Chỉ chạy 1 lần sau 1 giây
log(); // Chỉ chạy 1 lần sau 1 giây
log(); // Chỉ chạy 1 lần sau 1 giây