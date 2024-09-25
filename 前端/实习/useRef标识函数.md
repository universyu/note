# useRef标识函数

用`useRef`标识函数可以防止无法避免连续触发的函数执行错误。

假设函数为`func`，设置一个ref变量，在进函数前自加，函数中令局部变量`times`等于`ref.current`，然后对于需要防抖的操作，根据`times`和`ref.current`是否相等决定是否执行

