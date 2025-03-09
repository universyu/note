## 项目搭建

确保 ts-config 里面用的 module 是 CommonJS ，这样可以使用全局变量  \_dirname

### webpack.config.ts

```typescript
import path from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import {CleanWebpackPlugin} from 'clean-webpack-plugin'

  

const config = {

    mode:"development",

    // 入口文件

    entry:'./src/ts/index.ts',

    output:{

        path:path.resolve(__dirname,"dist"),

        filename:'bundle.js'

    },

    module:{

        rules:[

            {

                // x 是可选的，匹配 ts 和 tsx 后缀

                test:/\.tsx?$/,

                use:"ts-loader",

                exclude:/node_modules/,

            },

            {

                test:/\.css$/i,

                // 前者把 css 提取到单独的文件而不是内联

                use:[MiniCssExtractPlugin.loader,"css-loader"]

            }

        ]

    },

    // 如果 import 的文件没有写后缀，默认用下面的的后缀尝试解析

    resolve:{

        extensions:[".tsx",".ts",".js"]

    },

    plugins:[

        new HtmlWebpackPlugin({

            template:"./src/html/index.html",

            filename:"./index.html"

        }),

        new MiniCssExtractPlugin({

            filename:"css/index.css"

        }),

        // 每次打包前先清理上一次的

        new CleanWebpackPlugin()

    ],

    devServer:{

        // 服务器的响应压缩后传递

        compress:true,

        port:3000,

        open:true

    }

}

  

export default config
```

