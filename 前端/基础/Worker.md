
new Worker 第一个参数是 worker 所在的 url， 第二个参数是 options

vite 语法糖：
``` javascript
import ReliefWorker from './ReliefWorker?worker&inline'
```
再调用 new ReliefWorker() 相当于是把 url 传成了 blob 版本的 ReliefWorker里面的代码，而第二个参数的 type 是 module


## message 监听

self.onmessage 只能绑定一个事件，后面的事件会覆盖前面的。
self.addEventListener('message',function) 则可以注册更多的函数


## message 触发时间

在 worker 里面发 postmessage 的时候 js 里面的监听触发，在 js 里面发 postmessage 的时候 worker 里面的监听触发。


## transfer 

typedArrayBuffer 不可以 transfer，但是它的 buffer（ArrayBuffer）可以被 transfer，postmessage 第二个参数就写 { transfer } 这里 transfer 是一个数组


