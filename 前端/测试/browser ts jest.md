
## ts 配置

与 compilerOptions 并列的属性 include 标识待编译 ts 的路径， compilerOptions 内的 module 标识编译之后的参数类型，node 是 commonjs ，browser 是 es 。 ts 文件里面引入另外一个模块的时候需要用 js 的后缀，这样用 tsc 编译之后得到的才是正确的结果。但是在 test.js 文件里面可以直接引入 ts 后缀的文件（比如 tools.ts 则直接 import from 'tools' ）并调用第三方库直接执行 ts 文件。


