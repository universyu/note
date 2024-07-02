# react-transition-group

### SwitchTransition

用于管理元素之间的切换逻辑，不直接定义动画效果
`SwitchTransition`管理`enter`和`exit`来控制子元素（比如`CSSTransition`组件）的过渡，当`CSSTransition`组件发生变化时，`SwitchTransition`会先在当前元素应用退出状态，等待它完成过渡动画后，将进入动画应用到新的元素上。

### CSSTransition

用来定义CSS类的动画效果
`CSSTransition`给React组件添加基于CSS的动画效果

### 应用

`const location = useLocation();`

```js
		<SwitchTransition component={null}>
              <CSSTransition key={location.pathname} classNames={"fade"} timeout={1000} unmountOnExit>
                  <Routes location={location}>
                      <Route path={"/"}></Route>
                      <Route path={"/books"} element={<About></About>}></Route>
                  </Routes>
              </CSSTransition>
         </SwitchTransition>
```

`SwitchTransition`的`component`可以用来指定外层容器，也就是不随着路由变化的稳定内容。
`CSSTransition`中的`key`可以和`react-router-dom`中的`useLocation`搭配使用，这个`key`是来自于`React`的，用于标识元素。`React`比较新旧虚拟DOM中的元素，`key`改变时，会卸载旧元素，挂载新元素。
`import { Suspense } from 'react'` 在`CSSTransition`里面用`Suspense`可以定义加载动画