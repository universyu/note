
## package.json 配置

### main 

代表包的入口文件

### broswser

browser 代表浏览器环境下包的入口文件，browser 也可以是一个对象，浏览器环境下用值写的模块替换对应的键写的模块

### type

指定包中缩写的代码格式

commonjs 只可以用 require 导入包，如果需要用 import 和 export 则需要把后缀改成 mjs
module 只可以 import 和 export，如果需要用 require 则后缀要改成 cjs

### script

表示可以执行的脚本，pre前缀可以在执行脚本前执行前置脚本，post前缀则是后置脚本

### exports

require 字段设置用 require 引入当下包时检索的文件的路径
import 字段设置用 import 引入当下包时检索的文件的路径

### 版本控制

^表示大于等于指定的版本号，但大版本号（最高位）不得超过指定版本号
~则是连次高位都不允许超过指定版本号


### 依赖限制

peerDependencies 记录的依赖要求使用此包的项目必须安装指定版本的依赖，不得与此包要求的依赖冲突

### 白名单

files 字段配置上传到 npm 官网时需要传的文件路径


## .npmignore 配置

设置不需要传到 npm 官网的文件路径