
## main

表示包被 require 引入时的入口文件

## module

表示包被 import 引入时的入口文件

## exports

新版替代 main 和 module 的字段，下面两种写法同效

```json
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
```

```json
  "main": "dist/index.cjs",
  "module":"dist/index.js",
```


## types

表示当下包的类型说明文件存储的路路径

