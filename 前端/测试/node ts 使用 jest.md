npm init -y 
npm install typescript
npx tsc init
`package.json` 中的脚本添加 “build” 为 “tsc”，“test” 为 “jest”

node 环境需要额外安装类型说明
npm i --save-dev @types/node

ts 使用 jest 需要额外安装类型说明
npm i --save-dev @types/jest

为了运行 jest 进行测试的时候可以直接运行 ts 代码，需要安装额外的依赖
npm i ts-jest -D  并将 jest 配置文件中的 preset 的值改为 "ts-jest"

ts 使用 commonjs 会默认把模块传到全局，为了防止报重复声明的错误，需要在 ts 的配置文件中开启 "esModuleInterop": true 并在进行导出的模块中标识它是一个 esmodule ，即 export {}

```typescript
function randomNum():number[]{
    let num:number = 0;
    let resNums = [];
    for(let i=0;i<4;i++){
        num = Math.floor(Math.random()*10)
        resNums.push(num)
    }
    return resNums
}

  
module.exports = {
    randomNum
}

export {}
```

