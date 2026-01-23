
test('test mock', () => {
    const mockFn = jest.fn();
    mockFn('arg1', 'arg2');
    
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

    const mockFn2 = jest.fn().mockReturnValue('return value');
    mockFn2();

    expect(mockFn2).toHaveReturned();
    console.log(expect(mockFn2).toHaveReturnedWith('return value'));

});
