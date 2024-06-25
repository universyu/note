# react-router-dom

### 入门

在`main.jsx`里面为`<App/>`套上`<BrowserRouter> </BrowserRouter> `
在`App.jsx`中用`Routes`包裹`Route`
直接用`a`标签会导致重新加载整个应用程序，但是使用路由链接组件`Link`时，只是更改了显示在屏幕上的组件，而不改变其他组件的状态

### 层级关系

同级的路由之间不会有元素继承，即便在路由上看具有父子关系

嵌套级的路由之间可以有元素继承，只需要在父级路由中的`element`对应的组件中加入`<Outlet />`

想要实现所有路由都出现的内容，那么就写在`Routes`同级的位置

### 未定义页面

在`Routes`中第一层加入`path="*"`的`Route`即可

### useParams

`useParams()`会返回一个对象，键是路由变量的名，值是路由变量的值，可以用解构语法获取路由的内容

### useNavigate

`const navigate = useNavigate();`得到的`navigate`是一个函数，参数是目标url，可以用这个函数来替代`Link`

### Navigate

如果想要保护路由，只有登录用户才能访问，在登录前点击会跳转到登录界面，可以用`Navigate`实现

`<Route element={isLogged ? <Something /> : <Navigate replace to={"/login"} /> }></Route>` 

### Lazy Load

`import React, {Suspense} from 'react'`
`const myComponent = React.lazy( ()  => import('....') )`
使用时，利用`Suspense`标签包裹`myComponent`标签，在`Suspense`标签中写入`fallback`表示加载过程中显示的内容

### HashRouter

使用`BrowserRouter`时，github部署的页面会没有多路由，所以需要`HashRouter`，这样的路由前要加上`/#/`
