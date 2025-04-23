
当下 effect 结构：

```js
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  effectFn.deps = [];
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

function cleanup(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
```


把 effect 里面的 lazy 设置为 true 就得到 computed ，注意 computed 返回的是一个带有 get 的对象，如果要收集依赖和派发更新需要手动触发

```js
const NOOP = () => { }

function computed(getterOrOptions) {
  let getter;
  let setter;

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
    setter = NOOP
  }
  else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl {
  _value;
  _dirty = true;
  effect;
  _setter;
  
  constructor(getter, _setter) {
    this._setter = _setter;
    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true;
          trigger(this, "value");
        }
      }
    })
  }

  get value() {
    if (this._dirty) {
      this._value = this.effect();
      this._dirty = false;
    }
    track(this, "value");
    return this._value;
  }

  set value(newValue) {
    this._setter(newValue);
  }
}
```