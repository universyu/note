# Koa

### 基本框架

```js
const Koa = require('koa'); //加载模块
const app = new Koa();  //创建Koa应用程序实例
app.use(...); //注册中间件，括号之内写入一个异步函数，可以接收ctx（上下文对象）和next（调用下一个中间件函数）
app.listen(3000, () => {
	console.log("server running at port 3000");
}); //监听本地3000端口，开始监听后就在控制台显示提示信息
```

### 处理请求

后端程序

```js
//koaApp.js
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const port = 3000;

router.post('/generate', async (ctx) => {
    const { prompt } = ctx.request.body;
    const result = await chatSession.sendMessage(prompt);  // 这是gemini官方的函数
	ctx.response.type = 'text/plain';
    ctx.response.body = result.response.text();
});

router.get('/api/greeting', async (ctx) => {
  ctx.body = { message: 'Hello from Koa!' };
});

app.use(cors()); // 启用CORS以允许跨域请求

app.use(bodyParser()); // 使用bodyParser中间件解析请求体（POST需要）

app.use(router.routes()); //  处理正确请求方式

app.use(router.allowedMethods());  //对错误的请求方式返回适当的错误


```

前端程序

```js
//gemini.js
async function run(prompt) {
    const response = await fetch('http://127.0.0.1:3000/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });

    const data = await response.text();
    return data;
}

export default run;
```

### Vercel配置KOA

##### 安装依赖

`npm init -y`
`npm install koa`
`npm install @koa/router`
`npm install @koa/router`

##### 修改package.json

`start`用来启动服务，名字和代码名字一致

```json
{
  "name": "vercel",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",   
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@koa/router": "^12.0.1",
    "koa": "^2.15.3",
    "@koa/cors": "^3.0.0"
  }
}
```

##### 添加vercel.json

`src`和`dest`里需要和代码文件名字一致，这里是`app.js`

```json
{
    "version": 2,
    "builds": [
      { "src": "app.js", "use": "@vercel/node" }
    ],
    "routes": [
      { "src": "/(.*)", "dest": "app.js" }
    ]
}
```





