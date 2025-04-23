## 激活函数并清理消除的函数

用全局变量 `activeEffect` 控制当下激活的函数，依赖收集时把用到了当下激活函数的 set 都 push 到激活函数的 deps 中，每次派发更新执行函数前，先把这个函数从所有 set 中删除，然后把这个函数设置为激活函数，然后再执行这个函数

```js
function cleanup(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}

function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn;
    fn();
  }
  effectFn.deps = [];
  effectFn();
}
```


## 嵌套调用

现在 track 只收集了一个 activeEffect ，如果需要在 effect 中调用另一个 effect 那么只会执行最内层的函数，需要使用栈保留多个 effect 调用

```js
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn.deps = [];
  effectFn();
}
```


## 控制非立即触发

为 effect 多加一个 options ，里面放一个 lazy 控制函数是否要在传进 effect 的时候立即执行一次

## 调度器实现延时触发

为 effect 多加一个 options ，里面放一个 scheduler 做调度器，执行 effect 时如果有 options.scheduler 就改为执行它

对于同一 state 的反复更新，形如：
```js
proxy.age++;
proxy.age++;
proxy.age++;
proxy.age++;
```
可以用 set 存储待执行函数，这样每个不同的 state 只有一个函数被存储，由于 state 的更改是同步任务，一次事件循环只会执行一次，让开关在一次任务循环只开一次即可以在所有同步任务都执行完后只执行一次 effect 里面的函数，这里除了第一次执行 flushJob ，其它都被直接返回了
```js
const jobQueue = new Set();
const p = Promise.resolve();
function flushJob() {
  if (isFlushing) {
    return;
  }
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach((job) => job());
  })
    .finally(() => {
      isFlushing = false;
    })
}
```

这里传给 options 的 scheduler 为：
```js
effect(() => {
  layer2.innerHTML = proxy.age;
}, {
  scheduler: (effect) => {
    jobQueue.add(effect);
    flushJob()
  }
});
```