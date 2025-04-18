
## webpack.base.js

### html 模板插件

HtmlWebpackPlugin 准许以某个模板来形成 html，而且会把 js 代码自动插入其中

### 开启代码补全

```js
/**
 * @type {import('webpack').Configuration}
 */
```

### babel 配置

可以单独写 babelrc 做配置，也可以在 webpack config 中写只针对与 webpack 的 babel 配置

### source-map 配置

eval 会把代码块包裹在 eval 中，并在最后加上注释可以看到源码对应文件
cheap 可以看到源码对应行，但是看不到列也看不到 loader 对应的源码
module 可以看到 loader 对应的源码
```js
dev-tool: "eval-cheap-module-source-map"
```

### cli 执行

```bash
 npx webpack -c build/webpack.dev.js  --node-env development
```

### css 配置

#### 添加 css loader 

```js
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
```

如果需要把 css 单独整合到一个文件，就要使用插件，用插件就需要加在 plugins 字段中

```js
new MiniCssExtractPlugin({filename:'css/[name].[contenthash:6].css'})
```

```js
            {
                test:/\.css$/,
                use:[MiniCssExtractPlugin.loader,'css-loader']
            }
```

### 静态资源

要求源文件引入资源时使用的是相对路径，如果是绝对路径就不会被处理

```js
            {
                test:/\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
                type:'asset',
                generator:{
                // ext 表示保留原本的后缀名
                    filename:'img/[name].[contenthash:6][ext]'
                }
            }
```

### 示例

```js
const path = require('path')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    mode:"development",
    // 入口文件,这里表示配置文件所在文件夹上层文件夹的 src 下的 main.ts
    entry: path.resolve(__dirname,'../src/main.ts'),
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'js/[name].[contenthash:6].js',
        clean:true,
        // 从根目录下的 dist 目录中找 js 代码，这里 live server 的配置是："liveServer.settings.root": "/"
        publicPath:'/dist'
    },
    resolve:{
        alias:{
            "@":path.resolve(__dirname,'../src'),
        },
        // import 的时候没有后缀名就会尝试用这些来解析
        extensions:['.js','.ts','.vue','.json']
    },
    plugins:[new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'../public/index.html'),
    }),new VueLoaderPlugin()],
    module:{
        rules:[
            {
                // 严格匹配 .vue 后缀并使用 vue-loader
                test: /\.vue$/,
                use:'vue-loader'
            },
            {
                // 匹配 .ts 或 .tsx
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use:[
                // 从右到左应用，最先用的放在最后
                    {
                        loader:'ts-loader',
                        options:{
                        // 只做 ts -> js 的转义
                         transpileOnly:true,
                         // 让 .vue 文件也可以使用 ts ， 这里 js 会用第一个 \ 把第二个 \ 转义成真正的 \ ,这样它才可以用在正则中转义后面的 .
                         appendTsSuffixTo:['\\.vue$']
                        }
                    },
                    {
                        loader:'babel-loader',
                        options:{
                            presets:[
                                ["@babel/preset-typescript",{
                                    allExtensions:true
                                }]
                            ]
                        }
                    }
                ]
            },
        ]
    }
}
```