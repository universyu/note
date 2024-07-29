# Base核心控件



![7](D:\note\前端\实习\src\7.png)



### 输入框

`type="number"`的`input`标签（`value`是string类型）

设置其`value`为一个变量：` const [valueInput, setValueInput] = useState<string>(init)`

设置其`onChange`为自由修改：`     onChange={ (e) => { setValueInput(e.target.value) } }`

设置其失焦（`onBlur`）和按下回车键`onKeyDown中的if(e.key==='Enter')`触发的函数：

- 正则表达式校验值为数字，否则让值变成0
- 限制范围在最大值和最小值之间
- 修改输入框的值，修改全局变量的值，触发`Command`（`Command`里面已经修改了全局变量，不需要在这里修改）

```tsx
  const handleInput = () => {
    const newDependencies = [...dependencies]
    if (/^-?\d+(\.\d+)?$/.test(valueInput)) {
      if (parseFloat(valueInput) > maxV) {
        setValueInput(maxV.toString())
        newDependencies[index] = maxV
        setDependencies(newDependencies)
        command(maxV)
      } else if (parseFloat(valueInput) < minV) {
        setValueInput(minV.toString())
        newDependencies[index] = minV
        setDependencies(newDependencies)
        command(minV)
      } else {
        newDependencies[index] = parseFloat(valueInput)
        setDependencies(newDependencies)
        command(parseFloat(valueInput))
      }
    } else {
      setValueInput('0')
      newDependencies[index] = 0
      setDependencies(newDependencies)
      command(0)
    }
  }
```

外界修改（这里特指`reset`按钮）全局变量时，同步做更新

```tsx
  useEffect(() => {
    setValueInput(dependencies[index].toString())
  }, [dependencies])
```



### 滑动框

`type='range'`的`input`标签（`value`是string类型）

直接使用全局变量作为`value`

`onChange`需要修改全局变量，然后直接调用`controller`去控制`renderer`做出修改，还需要修改输入框的变量，需要节流：

```tsx
  let lastCall = 0
  const handleDrag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const curCall = Date.now()
    if (curCall - lastCall < 50) {
      return
    }
    const newDependencies = [...dependencies]
    newDependencies[index] = parseFloat(e.target.value)
    setDependencies(newDependencies)
    draging(parseFloat(e.target.value), index)  //controller.updateModelScale(e.target.value), index)
    setValueInput(e.target.value)
    lastCall = curCall
  }
```

`onMouseUp`直接发`Command`，`Command`会改变全局变量，然后会被上面的`useEffect`检测并修改输入框的值