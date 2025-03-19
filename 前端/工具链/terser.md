
对代码进行压缩、混淆

## sourcemap

存储压缩混淆后的代码到源代码的映射

## 运行脚本

`"compress":"terser src/index.js -o dist/index.js --source-map -o dist/index.js"`
   source-map 的输出文件会默认加上 .map