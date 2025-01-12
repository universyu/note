// 只有调用 getter 的时候才会运行，而且值有缓存，若前后无变化就不重新触发计算

import { effect } from "./effect.js";

function normalizeParameter(getterOrOptions) {
  let getter, setter;
  if (typeof getterOrOptions === "function") {
    getter = getterOrOptions;
    setter = () => {
      console.warn("no setter");
    };
  } else {
    getter = getterOrOptions.getter;
    setter = getterOrOptions.setter;
  }
  return { getter, setter };
}

export function computed(getterOrOptions) {
  const { getter, setter } = normalizeParameter(getterOrOptions);
  let value;
  let dirty = true;
  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      dirty = true;
    },
  });
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      return value;
    },
    set value(newValue) {
      setter(newValue);
    },
  };
  return obj;
}
