
## 模拟函数

jest.fn 传入回调函数当做函数的实现，返回一个新的函数

### mockReturnValue

传入的参数用来指定函数的返回值

### mockRetureValueOnce

传入的参数用来指定函数第一次被调用的返回值

### mockImplementationOnce

传入的参数用来指定函数第一次调用的实现

### mock

存储模拟函数的调用记录和状态信息

#### calls

jest.fn.mock.calls 是一个二维数组，用来表示每次调用模拟函数的参数

#### results

一维数组，存储每次调用模拟函数的返回信息，包括 value 和 type
