

## extends 

继承 json 时，路径也会继承，而不是在当下目录下用相对路径重新计算


## compilerOptions

### types 

值是一个数组，设置 ts 引入的类型说明文件，比如需要引入 node_modules/vitest/globals.d.ts 则
`"types":["vitest/globals"]`

### declaration

值为 true 表示编译后的文件生成类型说明文件

### esModuleInterop

commonjs 模块的导出没有默认导出（export default）
如果希望用默认导入的方式导入 commonjs 模块，就需要让 esModuleInterop 为 true


### 路径别名

开发时可以把路径 @ 换成根目录的 src

```json
        "baseUrl": "./",
        "paths": {
            "@/*":["src/*"]
        }
```



### moduleResolution

默认是 Classic ，前端构建一般用 Bundler ，使用 Bundler 还可以在 import 时忽略文件后缀名