# React生命周期

### useState

对`state`的设置是异步的，不能及时获取

如果需要确保随机的两次是完全不同的，需要开一个临时变量存新随机值

```tsx
  const [preInd, setPreInd] = useState(-1)

  const handleRandom = () => {
    const n = 11
    const randomTexts = Array.from({ length: n }, (_, index) =>
      t(`prompt:prompt_text_random${index + 1}`)
    )

    let newRandomIndex = Math.floor(Math.random() * (n - 1))

    while (newRandomIndex == preInd) {
      newRandomIndex = Math.floor(Math.random() * (n - 1))
    }

    setText(randomTexts[newRandomIndex])
    setPreInd(newRandomIndex)

    setVaildText(true)
    setWarning(false)
  }
```

