
vite 的源代码是 no-bundle 的，也就是不会进行打包，所有模块都直接在网络中获取。但是第三方模块，也就是 node_modules 里面的部分会打包，这里用到的就是 esbuild

## bundle

运行默认只会做普通的代码转换，修改后缀名。加上 --bundle 就会把文件中所有的依赖都打包到一个文件中，而不是维持 import 的形式


## loader

如果源码有引入图片，比如 svg ，那么在打包时要加入其 loader 
`--loader:.svg=dataurl` 表示读取 svg 并转为 base64 的字符串

