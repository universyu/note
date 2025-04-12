
使用 proxy 用来创建代理对象，对象中的任何一个属性都会被监听

```ts
import { track, trigger } from "./effect";

import { isObject } from "./utils";


const IS_REACTIVE = Symbol('is_reactive');

export const ReactiveFlags = {

  IS_REACTIVE,

};
  

export interface Target {

  [IS_REACTIVE]?: boolean;

}
  

export const targetMap = new WeakMap<Target, any>();

export function reactive<T extends object>(target: T): T;

export function reactive(target: object) {

  if (!isObject(target)) {
    return target;
  }

  if (targetMap.has(target)) {
    return targetMap.get(target);
  }

  if ((target as Target)[IS_REACTIVE]) {
    return target;
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      // 未代理的对象获取为 undefined ，已经代理的获取为 true ，已经是代理对象就直接返回
      if (key === IS_REACTIVE) {
        return true;
      }
      track(target, key);
      if (isObject(result)) {
      // 嵌套的对象也要返回一个代理对象
	    return reactive(result);
	  }
      const result = Reflect.get(target, key, receiver);
      return result;
    },
    set(target, key, value, receiver) {
      trigger(target, key);
      const result = Reflect.set(target, key, value, receiver);
      return result;
    },
  });


  // 同一个 obj 再次调用 reactive 创建代理对象时直接从 map 里面取
  targetMap.set(target, proxy);
 
  return proxy;

}
```


## 数组适配

### 手动记录无法监听的隐式长度变化

如果用数组，任何一个下标的元素被改了值都可以自动派发更新，但是如果更新属性值导致了数组长度的变化，这里 js 是做隐式变化无法监听，需要手动在监听属性值的更改时判断是否影响到 length，如果 length 隐式变小了，那么还需要循环执行 delete

### 依赖收集开关机制

如果 push 手动记录了隐式 length 的依赖，那么 push 导致的 length 变化会重新触发 push 进入死循环，所以需要有一个开关变量决定是否启用依赖收集