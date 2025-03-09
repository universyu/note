
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


## 模拟模块

jest.mock 传入第一个参数是模块名称，第二个参数是模型的实现

调用处

```javascript
  
const axios = require('axios')

class User{
    static all(){
        return axios.get("/users.json").then(resp=>resp.data)
    }
}

module.exports = User
```

测试文件

```javascript
const User = require('../api/userApi')
const userData = require('./user.json')

jest.mock("axios", () => {
    const userData = require('./user.json')
    return {
        get: jest.fn(()=>Promise.resolve({data:userData}))
    };
});


test("test user data",async ()=>{
    await expect(User.all()).resolves.toEqual(userData)

})
```

## 模拟文件模块

jest.mock 传入第一个参数为文件路径，第二个参数为具体实现，下面的程序假设文件中导出一个 sum 函数返回 100

```javascript
const {sum} = require('../utils/tools')

jest.mock("../utils/tools",()=>{
    const originalModule = jest.requireActual("../utils/tools");
    return {...originalModule,
        sum:jest.fn(()=>100)
    }
})

test("file module",()=>{
    const res = sum(1,2)
    expect(res).toBe(3)
})
```

## 模拟对象

jest.spyOn 可以监视对象上的方法

下面 tools 中函数实际调用的是原生的 setInterval 和 clearInterval

```typescript
import { startTimer,stopTimer } from "../ts/tools"

beforeEach(()=>{
    jest.useFakeTimers()
})

afterEach(()=>{
    jest.useRealTimers()
})

test("开始计时",()=>{
    const callback = jest.fn()
    const interval = 1000
    const setInterval = jest.spyOn(window,"setInterval")
    const timerId = startTimer(callback,interval)
    expect(setInterval).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(1)
    stopTimer(timerId)
})
```

## 模拟类

class 就是构造函数，只需要模拟模块，这个模块返回一个函数就可以了