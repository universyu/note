# ref回调

如果希望canvas被加载出来之后自动设置state，那么就在ref中传入回调函数

```tsx
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
   <canvas
        ref={setCanvas}
    />
```

