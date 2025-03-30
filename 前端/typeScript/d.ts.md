
## 图片模块导入

为了让图片可以用 import 默认导入，需要写 d.ts 文件
```ts
declare module '*.svg'{

    const src:string

    export default src

}
```