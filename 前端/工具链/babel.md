
转换语法，将新版语法转换为兼容旧版的形式

## 配置文件

babel.config.* 类型的表示项目级的配置文件，对整个项目都有效。
.babelrc 和 .babelrc.* 类型表示目录级的配置文件，只对当下目录及其所有子目录有效。

### babel/preset-typescript 

@babel/preset-typescript 用来做 ts -> js 的转译

### babel/preset-env

@babel/preset-env 是对 js 做兼容性转换，换成旧版语法


### useBuiltIns

presets 是一个数组，元素是数组，元素的元素是一个字符串加一个对象，对象是可选的 options
```js
module.exports = {
    presets: [
        ["@babel/preset-env",
            {
 //自动按需引入 poyfill ，源文件用 map 会在编译后的代码中修改 Array 的原型链把 map 加上去
                useBuiltIns: "usage", 
                corejs: 3
            }
        ],
    ]
}
```
使用 useBuiltIns 会导致原型链的污染，如果不希望改原型链但是希望 map 被转换，那么可以用插件，插件会开一个沙盒环境引入 poyfill 不污染全局原型链
```js
module.exports = {
    presets: [
        ["@babel/preset-env",],
    ],
    plugins:[
        [
            "@babel/plugin-transform-runtime",
            {
                corejs:3
            }
        ]
    ]
}
```