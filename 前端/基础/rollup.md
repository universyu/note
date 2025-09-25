
从入口文件出发解析引用关系，打包得到指定格式的产物。并会自动开启 Tree Shaking

## cjs 垫片实现异步引入

对于 import 函数打包成 commonjs 的情况，打包产物如下
```javascript
import("./foo.js").then(({ default: foo }) => {
    console.log(foo);
  });
			|
			|		
			|
Promise.resolve().then(function () { return require('./foo-CTDK9C2U.js'); }).then(({ default: foo }) => {
    console.log(foo);
  });
  
```

## 分块打包

选择 -d dist 可以把代码分块打包到指定文件夹，方便多个文件共同引用同一个文件。