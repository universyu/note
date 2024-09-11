# Proxy

### 概述

用代理的形式访问对象



### 应用场景

对于一个`controller`，调用它执行函数时将`Tag`切换到对应的页面



### 使用方法

```ts
export const Controller = new Proxy(ControllerBase, handler)
```

其中`ControllerBase`是被代理的对象，而`handler`是代理的具体实现

```ts
const COLOR_UPDATE_FUNCTION_NAME = ['updatePaletteInfos', 'updateQuantization']

const EYE_UPDATE_FUNCTION_NAME = ['updateEyeModel', 'updateEyeComponentColor', 'updateEyeSeperated']

const BASE_UPDATE_FUNCTION_NAME = ['updateBaseModel', 'updateBaseColor']

const TRANSFORMCONTROLLER_UPDATE_FUNCTION_NAME = [
  'updateModelPosition',
  'updateModelRotation',
  'updateModelScale',
  'resetModel',
  'resetUndo',
  'lockedScale',
  'lockedcaleModel',
  'updateBaseSeperated',
]

const EMIT_SERIALIZE_FUNCTION_NAME = [
  ...EYE_UPDATE_FUNCTION_NAME,
  ...COLOR_UPDATE_FUNCTION_NAME,
  ...BASE_UPDATE_FUNCTION_NAME,
]

// 代理模式，用于监听函数触发，统一进行调用。
const handler = {
    //target是需要被代理的对象，receiver是代理本身
  construct(target: any, args: any) {
    const instance = new target(...args)
    return new Proxy(instance, {
      get(target: any, prop: string, receiver: any) {
         //将this绑定到receiver而不是target
        const originalMethod = Reflect.get(target, prop, receiver)

        if (EMIT_SERIALIZE_FUNCTION_NAME.includes(prop)) {
          return (...args: any[]) => {
            const result = originalMethod.apply(receiver, args)

            // 对于不同的操作，会需要触发到不同的 tab.
            let targetStep = EditorStep.COLOR
            if (EYE_UPDATE_FUNCTION_NAME.includes(prop)) {
              targetStep = EditorStep.EYES
            }
            if (BASE_UPDATE_FUNCTION_NAME.includes(prop)) {
              targetStep = EditorStep.BASE
            }
            if (TRANSFORMCONTROLLER_UPDATE_FUNCTION_NAME.includes(prop)) {
              targetStep = EditorStep.TRANSFORMCONTROLLER
            }
            if (receiver?.store?.step !== targetStep) {
              receiver?.store?.setStep(targetStep)
            }
            return result
          }
        }
        return originalMethod
      },
    })
  },
}
```

