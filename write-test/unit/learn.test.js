/**
  Unit Test
  Mục đích: Kiểm tra các thành phần nhỏ nhất của ứng dụng (thường là các hàm hoặc phương thức) để đảm bảo rằng chúng hoạt động đúng cách với các đầu vào và đầu ra dự kiến.

  Cách viết: Sử dụng các thư viện testing framework như vitest, Jest, Mocha hoặc Jasmine để viết unit test cho từng hàm, module cụ thể.

  Lợi ích: Unit test giúp kiểm tra các thành phần nhỏ lẻ trong ứng dụng và dễ dàng phát hiện lỗi ở mức hàm hoặc module.
*/

// import { sum, concatenate } from '../utils'
const { sum, concatenate } = require('../utils');

describe('unit test module', () => {
    // test('adds 1 + 2 to equal 3', () => {
    //     expect(sum(1, 2)).toBe(3);
    // });
    
    // test('concatenate 1 + 2 to equal 3', () => {
    //     expect(concatenate(1, 2, ' ')).toBe('1 2');
    // });

    // test('object assignment', () => {
    //     const data = {one: 1};
    //     data['two'] = 2;
    //     data.three = 3;
    //     expect(data).toEqual({one: 1, two: 2, three: 3})
    // });

    // test('array assignment', () => {
    //     const data = [];
    //     data.push(1);
    //     data.push(2);
    //     data.push(3);
    //     expect(data).toEqual([1, 2, 3])
    // });

    // test('adding positive numbers is not zero', () => {
    //     for (let a = 1; a < 10; a++) {
    //       for (let b = 1; b < 10; b++) {
    //         expect(a + b).not.toBe(0);
    //       }
    //     }
    // });

    test('null', () => {
        const n = null;
        expect(n).toBeNull();
        expect(n).toBeDefined();
        expect(n).not.toBeUndefined();
        expect(n).not.toBeTruthy();
        expect(n).toBeFalsy();
    });
      
});
