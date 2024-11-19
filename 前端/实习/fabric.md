# fabric

## 导出大小问题

防止裁剪边框导致导出大小不对

```ts
          cloneObj.clipPath = new fabric.Ellipse({
            rx: cropWidth / 2 - PADDING,
            ry: cropHeight / 2 - PADDING,
            left: cropLeft + PADDING,
            top: cropTop + PADDING,
            absolutePositioned: true,
            strokeWidth: 0,
          })
```

