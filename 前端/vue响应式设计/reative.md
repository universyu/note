
使用 proxy 用来创建代理对象

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
