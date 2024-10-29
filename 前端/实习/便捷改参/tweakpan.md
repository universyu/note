# tweakpan

## 简介

指定容器，使用`Pane`快捷修改参数

## 使用示例

```tsx
const pane = new Pane({ container: paneContainer.current })
pane.addBinding(obj, property, params) //所有参数，需要修改的参数名，最值和步长
```

这里的`addBinding`会返回一个对象，其包含`on`方法