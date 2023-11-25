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
async function init() {
  return null;
}
async function start() {
  let _infoLive = (await init()) ?? {};

  console.log("first", _infoLive);

  _infoLive.start = _infoLive.start ? new Date(_infoLive.start) : "no";

  _infoLive.hyb_type = "LVLE";
  _infoLive.hyb_video = "video";

  console.log("end", _infoLive);
}

start();
