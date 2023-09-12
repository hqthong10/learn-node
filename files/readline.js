const fs = require('fs');
const readline = require('readline');
const mkdirp = require('mkdirp');

const info = {
    name: 'thong',
    status: 'có rồi'
}

let data = JSON.stringify(info);

const writeFile = async (path, name, content, option) => {
    await mkdirp(path);
    fs.writeFileSync(path+ '/' +name, content, option);
}

writeFile(`temp`, 'info.json', data, {mode: 0o775});
    
// fs.writeFileSync(`temp/info.json`, data, {mode: 0o775});