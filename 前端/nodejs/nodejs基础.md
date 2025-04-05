
### process.argv

`process.argv[0]`表示系统中`node.js`可执行文件的路径
`process.argv[1]`表示正在执行的`javaScript`文件的路径
后面的就依次根据输入而决定，假如`node server.js -d ./build/demo`
那么`process.argv[2]`就是`-d` 而`process.argv[3]`就是`./build/demo`

### http请求

`http.createServer`接受一个回调函数为参数，这个回调函数又接受两个参数，`request`和`response`回调函数在每次收到http请求的时候都会被调用
**基本结构示例**

```js
http
  .createServer( async function (request, response) {
    ...
  })
  .listen(port, host);
```

