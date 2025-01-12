import { track, trigger, pauseTracking, resumeTracking } from "./effect.js";
import { reactive } from "./reactive.js";
import { isObject } from "./utils.js";
import { TrackOpTypes, TriggerOpTypes } from "./operations.js";

const arrayInstrumentations = {};
const RAW = Symbol("raw");
["includes", "indexOf", "lastIndexOf"].forEach((key) => {
  arrayInstrumentations[key] = function (...args) {
    let res = Array.prototype[key].apply(this, args);
    if (res === -1 || res === false) {
      res = Array.prototype[key].apply(this[RAW], args);
    }
    return res;
  };
});

["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
  arrayInstrumentations[key] = function (...args) {
    // 调用的过程中会调用到数组的 length 但是对于开发者来说不希望这些函数收集 length 作为依赖
    pauseTracking();
    const result = Array.prototype[key].apply(this, args);
    resumeTracking();
    return result;
  };
});

function get(target, key, receiver) {
  if (key === RAW) {
    return target;
  }
  track(target, TrackOpTypes.GET, key);
  if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
    // 嵌套在内部的对象被转成了代理，如果查找数组的代理中是否存在某个对象，需要在找不到的情况下回原数组查找
    return arrayInstrumentations[key];
  }
  const result = Reflect.get(target, key, receiver); // 绑定 this 为代理对象，防止计算属性内部的属性无法进行依赖收集
  if (isObject(result)) {
    // 对象中的对象也应该被代理
    return reactive(result);
  }
  return result;
}

function set(target, key, value, receiver) {
  const type = target.hasOwnProperty(key) // in 会在原型链上查找，故只可用 hasOwnProperty
    ? TriggerOpTypes.SET
    : TriggerOpTypes.ADD;
  const oldValue = target[key];
  const oldLen = Array.isArray(target) ? target.length : undefined;
  const result = Reflect.set(target, key, value, receiver); // 设置时也应该是操作代理对象
  if (!result) {
    return false;
  }
  const newLen = Array.isArray(target) ? target.length : undefined;
  if (type === TriggerOpTypes.ADD || !Object.is(oldValue, value)) {
    // 新增或者成功修改才派发更新
    trigger(target, type, key);

    if (Array.isArray(target) && newLen !== oldLen) {
      if (key === "length") {
        // 调小数组长度需要手动派发数据的删除
        for (let i = newLen; i < oldLen; i++) {
          trigger(target, TriggerOpTypes.DELETE, i.toString());
        }
      } else {
        // 隐式触发数组长度变化的方法会用 defineProperty 进行，无法被自动监听，需要手动派发更新
        trigger(target, TriggerOpTypes.SET, "length");
      }
    }
  }
  return result;
}

function has(target, key, value) {
  // 对象的 in 在底层是 hasProperty 对应代理的函数是 has
  track(target, TrackOpTypes.HAS, key);
  return Reflect.has(target, key, value);
}

function ownKeys(target) {
  // for in 和 Object.keys 底层调用 ownKeys 此操作对应的属性 key 用无以重复的 symbol 设定
  track(target, TrackOpTypes.ITERATE);
  return Reflect.ownKeys(target);
}

function deleteProperty(target, key) {
  const result = Reflect.deleteProperty(target, key);
  const hasKey = target.hasOwnProperty(key);
  if (result && hasKey) {
    // 本存在而现在成功删除才触发派发更新
    trigger(target, TriggerOpTypes.DELETE, key);
  }
  return result;
}

export const handlers = {
  get,
  set,
  has,
  ownKeys,
  deleteProperty,
};
