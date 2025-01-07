# Misc

## 逻辑值必须布尔

如果用数字型变量做逻辑运算挂载组件，会把数字也挂上去



## 隔离阻塞任务

为了防止加载组件无法被挂载，可以用一个延时任务隔开

```tsx
await new Promise((resolve) => setTimeout(resolve, 20))
```



## 对象 reset

在 `store` 里面的对象要做 `reset` ，必须在 `reset` 函数中重新 `construct` ，不可以直接 `set initialState`

```tsx
  const initialState = {
  modelEditContext: new ModelEditContext(),
  generateLoading: false,
  userPickImgName: '',
  exportLoading: false,
  exportSuccess: false,
  stlUrl: '',
  threeMFUrl: '',
}
  
  reset: () =>
    set({
      modelEditContext: new ModelEditContext(),
      generateLoading: false,
      userPickImgName: '',
      exportLoading: false,
      exportSuccess: false,
      stlUrl: '',
      threeMFUrl: '',
    })
```

