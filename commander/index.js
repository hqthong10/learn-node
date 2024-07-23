const { Command } = require('commander');
const program = new Command();

program
  .name('my-cli-app')
  .description('An example CLI application using commander')
  .version('1.0.0');

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

program.parse(process.argv);

// .allowUnknownOption(); // Cho phép đối số không xác định