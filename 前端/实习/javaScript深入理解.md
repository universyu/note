# javaScript深入理解



## 原始值和引用值

对象存的是一些值的引用，函数传参是值传递，传对象的时候，对象里面的值（一些值的引用）被传入，所以可以在函数里面更改对象的属性



## async与Promise

`async`函数都返回一个`promise`，其返回值相当于`promise`的`resolve`或`reject`

在`useEffect`里面用异步函数
```ts
  useEffect(() => {
    const initFunc = async () => {
        ...
      threeDeeRenderer.addSubtractHandler(subtractHandler)
      return () => {
          // 这是卸载时需要清理的
        threeDeeRenderer.removeSubtractHandler(subtractHandler)
      }
    }
    const cleanUp = initFunc()
    return () => {
      cleanUp.then( cleanUpFunc => cleanUpFunc?.() )
    }
  }, [...])
```

