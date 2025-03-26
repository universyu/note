

## extends 

继承 json 时，路径也会继承，而不是在当下目录下用相对路径重新计算


## compilerOptions

### types 

值是一个数组，设置 ts 引入的类型说明文件，比如需要引入 node_modules/vitest/globals.d.ts 则
`"types":["vitest/globals"]`

### declaration

值为 true 表示编译后的文件生成类型说明文件


