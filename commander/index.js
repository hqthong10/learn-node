const { Command } = require('commander');
const program = new Command();

// Thư viện này giúp bạn xử lý các tham số mà người dùng nhập vào từ terminal một cách chuyên nghiệp,
// thay vì phải tự bóc tách mảng process.argv một cách thủ công và phức tạp.

program
  .name('my-cli-app')
  .description('An example CLI application using commander')
  .version('1.0.0');

// Định nghĩa Option (Tùy chọn)
program.option('-d, --debug', 'hiển thị thông tin debug');

// Định nghĩa một lệnh đơn giản với một tùy chọn
program
  .command('greet <name>')
  .description('Greet a person')
  .option('-l, --lang <language>', 'Specify the language', 'en')
  .action((name, options) => {
    if (options.lang === 'en') {
      console.log(`Hello, ${name}!`);
    } else if (options.lang === 'es') {
      console.log(`Hola, ${name}!`);
    } else {
      console.log(`Language not supported: ${options.lang}`);
    }
  });

// Phân tích các tham số từ dòng lệnh
program.parse(process.argv);

// .allowUnknownOption(); // Cho phép đối số không xác định
// Xem trợ giúp: node index.js --help
// Chạy lệnh chào: node index.js greet "Tên của bạn"
// Chạy với tùy chọn debug: node index.js greet "Tên của bạn" --debug
