import { TrackOpTypes, TriggerOpTypes } from "./operations.js";

const targetMap = new WeakMap();
const ITERATE_KEY = Symbol("iterate");

let shouldTrack = true;

export function pauseTracking() {
  shouldTrack = false;
}

export function resumeTracking() {
  shouldTrack = true;
}

let activeFn = undefined;

function cleanup(effectFn) {
  const { deps } = effectFn;
  if (!deps.length) {
    return;
  }
  for (const dep of deps) {
    dep.delete(effectFn);
  }
  deps.length = 0;
}

const effectStack = [];

export function effect(fn, options = {}) {
  const { lazy = false, scheduler = undefined } = options;
  // 动态建立依赖关系，每次重新派发更新调用的函数需要带上对 activeFn 的设置
  const activeEffect = () => {
    try {
      activeFn = activeEffect;
      effectStack.push(activeEffect);
      // 重新执行的时候需要重新建立依赖，所以需要先清空上一次的依赖
      cleanup(activeEffect);
      return fn();
    } finally {
      effectStack.pop();
      activeFn = effectStack.at(-1);
    }
  };
  activeEffect.deps = [];
  activeEffect.scheduler = scheduler;
  if (lazy) {
    return activeEffect;
  } else {
    activeEffect();
  }
}

export function track(target, type, key) {
  if (!shouldTrack || !activeFn) {
    return;
  }
  let propMap = targetMap.get(target);
  if (!propMap) {
    propMap = new Map();
    targetMap.set(target, propMap);
  }
  if (type === TrackOpTypes.ITERATE) {
    // 归一化，此后 key 必然存在
    key = ITERATE_KEY;
  }
  let typeMap = propMap.get(key);
  if (!typeMap) {
    typeMap = new Map();
    propMap.set(key, typeMap);
  }
  let depSet = typeMap.get(type);
  if (!depSet) {
    depSet = new Set();
    typeMap.set(type, depSet);
  }
  if (!depSet.has(activeFn)) {
    depSet.add(activeFn);
    activeFn.deps.push(depSet);
  }
}

const triggerTypeMap = {
  [TriggerOpTypes.SET]: [TrackOpTypes.GET],
  [TriggerOpTypes.ADD]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
  [TriggerOpTypes.DELETE]: [
    TrackOpTypes.GET,
    TrackOpTypes.ITERATE,
    TrackOpTypes.HAS,
  ],
};

function getEffectFns(target, type, key) {
  const propMap = targetMap.get(target);
  if (!propMap) {
    return;
  }

  const effectFns = new Set();

  const keys = [key];
  if (type === TriggerOpTypes.ADD || TriggerOpTypes.DELETE) {
    // 增删都会影响有做迭代的函数
    keys.push(ITERATE_KEY);
  }
  const trackTypes = triggerTypeMap[type];
  for (const key of keys) {
    const typeMap = propMap.get(key);
    if (!typeMap) {
      continue;
    }
    for (const trackType of trackTypes) {
      const dep = typeMap.get(trackType);
      if (!dep) {
        continue;
      }
      for (const effectFn of dep) {
        effectFns.add(effectFn);
      }
    }
  }
  return effectFns;
}

export function trigger(target, type, key) {
  const effectFns = getEffectFns(target, type, key);
  if (!effectFns) {
    return;
  }
  for (const effectFn of effectFns) {
    if (effectFn === activeFn) {
      // 避免死循环
      continue;
    }
    if (effectFn.scheduler) {
      effectFn.scheduler();
    } else {
      effectFn();
    }
  }
}
