# useCallback优化方案

### 基础用法

如果函数比较大，或者作为参数传给了身为纯组件的子组件，那么需要用`useCallback`防止不必要的函数重建或不必要的重新渲染。

但是如果函数需要用到`state`，比如直接打印一个`state`，那么需要传入对应的依赖项，而依赖项改变时还是会触发函数的重建

### 缓存函数且获取最新变量

下面的代码既可以缓存函数防止不必要的重建又可以实时用到最新的`state`。

#### 完整代码

```ts
function usePersistCallback<T extends(...args: any[]) => any>(fn?: T) {
  const ref = useRef<T>();

  ref.current = fn;

  return useCallback<T>(
    // @ts-ignore
    (...args) => {
      const fn = ref.current;
      return fn && fn(...args);
    },
    [ref],
  );
}
```

如果`fn`中应用了`state`，那么当这个`state`更新的时候，`ref.current = fn`就会更新，而由于闭包，`useCallback`返回的函数有`ref`的引用，故其可以获取最新的`ref.current`，从而确保使用最新的函数

### 应用对比

```tsx
  const handleClickCallback = useCallback(() => {
    console.log(`Clicked! Count is ${count}`);
  }, [count]);

  const handleClickPersist = usePersistCallback(() => {
    console.log(`Clicked! Count is ${count}`);
  });
```

