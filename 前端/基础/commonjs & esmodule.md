
## 导入导出

CommonJs

运行时同步加载导入的模块，导入的是一个快照。 require 就是一个同步的文件读取函数。
```javascript
module.exports = {
	...
};
const ... = require('.js')
```
ESModule

编译时确定 import 关系，运行时异步加载，导入的是值本身。import 可以动态导入， 返回的是一个 promise，可以顶级 await 
```javascript
export 
import 
```

循环引用：会取得中间半成品，会拿到 undefined ， 如果是 mjs 导出 let x = 0 这里的 x 提前被访问还会触发报错。

tree shaking 只有 mjs 才支持

