# React key

## key 与挂载

当 `key` 更改的时候， `React` 把组件识别成新组件，重新挂载



key用来标识元素，当数组涉及到顺序调整，比如反转的时候，用index作为key就有可能导致资源丢失或者混乱，用uuid实现唯一标识

```tsx
            import { v4 as uuidv4 } from 'uuid'

            const newImage = {
              url: renderer.createDataUrl({ imgHeight: 150, imgWidth: 150 }),
              id: uuidv4(),
            }
```

这里需要渲染的数组是store变量，反转利用useMemo

```tsx
  const reverseRodinImages = useMemo(() => {
    return [...rodinImages].reverse()
  }, [rodinImages])
```

