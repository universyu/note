# React生命周期

### useState

对`state`的设置是异步的，不能及时获取

如果需要确保随机的两次是完全不同的，需要用ref

```tsx
  const preInd = useRef<number>(-1)
  const curInd = useRef<number>(0)
  const handleRandom = () => {
    const n = 11
    const randomTexts = Array.from({ length: n }, (_, index) =>
      t(`prompt:prompt_text_random${index + 1}`)
    )

    curInd.current = Math.floor(Math.random() * n)
    while (curInd.current === preInd.current) {
      curInd.current = Math.floor(Math.random() * n)
    }

    textRef.current = randomTexts[curInd.current]
    setTextState(randomTexts[curInd.current])

  }
```



### useRef

**ref可以确保变量是最新值，不会重新渲染页面，如果需要获取最新值而且需要实时渲染，那么就要结合`useState`使用**



### 综合应用

#### useState注解

定义：`const [textState, setTextState] = useState<string>('')`
传入子组件的注解：

```tsx
  textState: string
  setTextState: React.Dispatch<React.SetStateAction<string>>
```



#### useRef注解

定义：` const textRef = useRef<string>('')`
传入子组件的注解：(MutableRefObj表示这个ref是一个可以修改current的ref)

```tsx
  textRef: MutableRefObject<string>
```



#### 实例

**需求：用户输入的文本框实时更新，输入的内容要被用作输入词调用SD**
**解决方案：用state渲染输入的内容，用ref传给SD**



### useEffect

用空数组监听的时候常常监听不到，这是因为挂载和卸载的触发比较严苛，用逻辑表达式决定组件出现与否的时候会触发组件的挂载和卸载

组件挂载和卸载只发生在DOM结构中添加和删除组件的时候，Dialog的open与否不会导致挂载和卸载。

state变量改变，以及zustand变量改变的时候则会触发整个组件的所有代码重新执行，但是也不会导致挂载和卸载

