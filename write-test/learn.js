
describe('sum module', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(1 + 2).toBe(3);
    });

    test('object assignment', () => {
        const data = {one: 1};
        data['two'] = 2;
        expect(data).toEqual({one: 1, two: 2})
    });

    test('array assignment', () => {
        const data = [];
        data.push(1);
        data.push(2);
        data.push(3);
        expect(data).toEqual([1, 2, 3])
    });

    test('undefined', () => {
      let a;
      expect(a).toStrictEqual(1);
    })

    test('adding positive numbers is not zero', () => {
        for (let a = 1; a < 10; a++) {
          for (let b = 1; b < 10; b++) {
            expect(a + b).not.toBe(0);
          }
        }
    });

    test('null', () => {
        expect.assertions(5);
        const n = null;
        expect(n).toBeNull();
        expect(n).not.toBeUndefined();
        expect(n).toBeDefined();
        expect(n).not.toBeTruthy();
        expect(n).toBeFalsy();
    });
      
    test('zero', () => {
      const z = 0;
      expect(z).not.toBeNull();
      expect(z).toBeDefined();
      expect(z).not.toBeUndefined();
      expect(z).not.toBeTruthy();
      expect(z).toBeFalsy();
    });

    test('two plus two', () => {
      const value = 2 + 2;
      expect(value).toBeGreaterThan(3);
      expect(value).toBeGreaterThanOrEqual(3.5);
      expect(value).toBeLessThan(5);
      expect(value).toBeLessThanOrEqual(4.5);
    
      // toBe and toEqual are equivalent for numbers
      expect(value).toBe(4);
      expect(value).toEqual(4);
    });

    test('adding floating point numbers', () => {
      const value = 0.1 + 0.2;
      //expect(value).toBe(0.3);           This won't work because of rounding error
      expect(value).toBeCloseTo(0.3); // This works.
    });

    test('there is no I in team', () => {
      expect('team').not.toMatch(/I/);
    });
    
    test('but there is a "stop" in Christoph', () => {
      expect('Christoph').toMatch(/stop/);
    });
});