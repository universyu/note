
## vite.config.ts

利用注解方便编写
```ts
import { defineConfig,ConfigEnv,UserConfig } from 'vite'
```

如果在 defineConfig 中传递函数，那么可以获得环境变量显示运行时的指令以及运行环境

```ts
export default defineConfig(({command,mode}:ConfigEnv):UserConfig=>{
    console.log(command)
    console.log(mode)
    return {
        server:{
            port:3000,
            open:true
        }
    }
})
```

利用 loadEnv 可以获取环境变量配置文件

```ts
import { loadEnv } from 'vite'
// 根据当下运行的 mode 在 ./ 目录找 .env 文件，并且从其中读取以 VITE_ 为前缀的变量
    const env = loadEnv(mode,'./','VITE_')

    return {
        server:{
            port:Number(env.VITE_PORT),
            open:Boolean(env.VITE_OPEN)
        }
    }
```


### react hmr 

首先安装 `@vitejs/plugin-react`，然后在配置文件中加入插件：`plugins:[react()]`，对应的 react 文件中不可以直接 export default 一个无名组件，必须导出一个有名函数才能应用 hmr 


### 依赖预构建

引入的第三方库会自动构建在 node_modules/.vite/deps 中，并会把 web 端运行的文件中 import 库的地址重写成 node_modules/.vite/deps.... 的形式。

可以用 optimizeDeps 字段里面的 exclude 选择排除掉部分包不做预构建


### 路径别名

运行时可以把 @ 换成根目录的 src

```ts
        resolve:{
            alias:{
                '@':path.resolve(__dirname,'./src')
            }
        }
```

需要安装 @types/node 而且需要 import path from 'path'

