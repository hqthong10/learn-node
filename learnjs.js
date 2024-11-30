/*
 * Tìm phần tử thức lớn thứ 2 trong mảng
 */
// let arr = [19, 19, 3, 6, 4, 2, 5];
// // b1: loại bỏ phần tử trùng nhau
// let s = new Set(arr);
// arr = Array.from(s);
// console.log(arr);
// // b2: sắp xếp mảng giảm dần
// arr.sort((a, b) => b - a);
// console.log(arr);
// // b3: chọn kết quả
// console.log(arr[1]);

/**
 * Swap không dùng biến tạm
 */
// let a = 3;
// let b = 5;
// [b, a] = [a, b];
// console.log(a); // 5
// console.log(b); // 3

// const a = null;
// const a = undefined;
// const a = '';
// const b = a || 'hihi';
// console.log(b);

// const q = {
//   offset: '30',
//   limit: 15
// }
// const cond = {
//   search: 'thong'
// }
// q.offset > 0 && (cond.offset = +q.offset);
// q.max && (cond.offset = q.max);
// console.log(cond);

// const q = {
//   offset: 'as',
//   limit: 15
// }

// const OFFSET = +q.offset ?? 0;
// console.log(OFFSET);

// const params = {
//   event: undefined,
// };
// let { event = "1", app = "2", name = "3", login = "4" } = params ?? {};
// console.log("event", event);
// console.log("app", app);
// console.log("name", name);
// console.log("login", login);

// const arr1 = [1, 2, [3, [4, 5]], [6, 7], 8];
// const arr2 = arr1.flat();
// async function init() {
//   return null;
// }
// async function start() {
//   let _infoLive = (await init()) ?? {};

//   console.log("first", _infoLive);

//   _infoLive.start = _infoLive.start ? new Date(_infoLive.start) : "no";

//   _infoLive.hyb_type = "LVLE";
//   _infoLive.hyb_video = "video";

//   console.log("end", _infoLive);
// }

// const arr = ["a", "b", "c"];
// let i = arr.splice(1, 1, "d");
// console.log(arr, i);

// const numbers = [2, 4, 9, 16, 10];
// let sum = numbers.reduceRight((total, value, index, array) => {
//   console.log(value);
//   return total > value ? total : value;
// }, 20);
// console.log(sum);

// const nameFolder = "14977.0d72ae61e97402a020768ba60dfa9e00";
// const [fo100, token] = nameFolder.split(".");
// console.log(fo100, token);

// const data = {
//     // code: 200,
//     // status: 'success',
//     // elements: []
// }
// const data = []

// if('code' in data || 'status' in data || 'elements' in data ) {
//     console.log('ok');
// } else {
//     console.log('no');
// }

// function isEmail(txt) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(txt);
// }

// console.log('isemail', isEmail('hq.thong10gmail.com'));

// const url = `mongodb://vhomenew:${encodeURIComponent(
//     '@@@vhomesolutionteamwork1717'
// )}@localhost:27017/vhomenew`;
// console.log(url)
// const n = [1,2,3, 4, 5, 6, 7, 8, 9];
// n.forEach((v,i) => {
//     if(i == 4) {
//         i = 8;
//         return;
//     };
//     console.log(v);
// })

// let a = {}
// a = {
//   name: 'thong',
//   age: 18
// }
// console.log(a);

// let b = 'other';
// b = 'other 2'
// console.log(b);

// const a = JSON.stringify(1)
// const b = JSON.parse(a);
// console.log(a, 'hi',b);

// const q = {
//     FB050:  1,
//     // FB100: '',
//     FB200: 2,
//     OBJ: {
//         num: 'a'
//     }
// }
// +q.FB050 ===0 || +q.FB100 === 0 || +q.FB200 === 0
// console.log((+q.OBJ?.num || 0) <= 0);

//  let filename = '2QBRANDOMNAME53d2';
//  let arr = filename.split('QBRANDOMNAME');
//  console.log(arr)
//  console.log(parseInt(arr[arr.length - 1]) || 0)
// fs = require('fs')
// fsex = require('fs-extra')
// const stat2 =  fsex.statSync('./ffmpeg/liveconvert.js')
// console.log(stat2)

// const filename = 'var/www/static/hlstemp/name_720p/index.tss';
// let flag = true;
// let flagm3u8 = false;

// if(flag && (filename.endsWith('.ts') || (flagm3u8 = filename.endsWith('.m3u8')))) {
//     console.log('ok', flag, flagm3u8);
// }

// const fs = require('fs-extra');
// const readline = require('readline');
// const filename = './temp/hlstemp_index.m3u8'
// const rl = readline.createInterface({
//     input: fs.createReadStream(filename),
//     crlfDelay: Infinity
// });
// let maxDuraOfTs = 0;
// let tmpTime = 0;
// const objs = {
//     keys: [],
//     vals: []
// };
// let lineDis = null;

// rl.on('line', (line) => {
//     if(line.includes('EXTINF:')) {
//         tmpTime = +line.replace(/#EXTINF:|,/g, '');
//         maxDuraOfTs < tmpTime && (maxDuraOfTs = tmpTime);
//         console.log('EXTINF', tmpTime);
//     }
//     if(line.includes('.ts')) {
//         if (lineDis) {
//             objs.keys.push('DIS');
//             objs.vals.push(lineDis);
//             lineDis = null;
//         }
//         tmpKey = line.replace('.ts', '');
//         objs.keys.push(tmpKey);
//         objs.vals.push(tmpTime);
//     }
//     if(line.lastIndexOf('DISCONTINUITY') > 0) {
//         lineDis = line;
//     }
// })

// rl.on('close', () => {
//     console.log('maxDuraOfTs', maxDuraOfTs)
//     console.log('objs', objs)
//     console.log('objs.keys', objs.keys)
//     console.log('objs.vals', objs.vals)
// })

// rl.on('error', (e) => {
//     console.log('error =>', e);
// })

// const a = [2, 3, 4, 5, 6, 7, 8, 9, 10];
// const arr = a.slice(-5);

// console.log(a)
// console.log(arr)

// console.log(new Date(1720091155951))
// console.time('thong')
// console.time('thong')
// console.timeEnd('thong')
// console.timeEnd('thong')

// const logFilePath = 'application-' + new Date().toISOString().split('T')[0] + '.log'
// console.log(logFilePath)

// const arr = [1, 0, 2, 3, 0, -1, -1, 0, 2, 1];
// const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// const rs = arr.some((num) => num % 2 === 0);

// console.log(arr.slice(6,10));

// const func = (a, b, c, d) => {
//     console.log('a', a);
//     console.log('b', b);
//     console.log('c', c);
//     console.log('d', d);
// }

// const a = '11';
// const b = '22';
// const c = '33';
// const d = '44';

// func(b, c, d)

// const originalArray = [1, 2, 3, 4, 5];

// const newArray = originalArray.slice(0, 8);

// console.log(newArray); // Output: [2, 3, 4]
// console.log(originalArray); // Output: [1, 2, 3, 4, 5] (không thay đổi)

// const a = ['a', 'b', 'c', 'd'];

// console.log('thong', ['a', 'b', 'c'].some((item) => a.includes(item)))
// if (a.includes('a') || a.includes('b') || a.includes('c')) {
//     console.log('success')
// }

const fs = require("fs-extra");

const filepath = './ffmpeg/inps'


async function example () {
    const exists = await fs.pathExists(filepath)
  
    console.log(exists) // => false
  }
  
  example()