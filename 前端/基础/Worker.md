
new Worker 第一个参数是 worker 所在的 url， 第二个参数是 options

vite 语法糖：
``` javascript
import ReliefWorker from './ReliefWorker?worker&inline'
```
再调用 new ReliefWorker() 相当于是把 url 传成了 blob 版本的 ReliefWorker里面的代码，而第二个参数的 type 是 module

