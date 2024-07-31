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
    const valNum = parseFloat(parseFloat(value).toFixed(1))
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      if (valNum > maxV) {
        setValue(maxV.toString())
        newDependencies[index] = maxV
        setDependencies(newDependencies)
        command(maxV)
      } else if (valNum < minV) {
        setValue(minV.toString())
        newDependencies[index] = minV
        setDependencies(newDependencies)
        command(minV)
      } else {
        newDependencies[index] = valNum
        setDependencies(newDependencies)
        command(valNum)
      }
    } else {
      setValue('0')
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

`onChange`需要修改全局变量，然后直接调用`controller`去控制`renderer`做出修改。需要存储上一次的值，还需要修改输入框的变量，需要节流：

```tsx
  let preVal = init
  let lastCall = 0
  const handleDrag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const curCall = Date.now()
    if (curCall - lastCall < 50) {
      return
    }
    const newDependencies = [...dependencies]
    newDependencies[index] = parseFloat(e.target.value)
    setDependencies(newDependencies)
    preVal = e.target.value
    draging(parseFloat(preVal), index)
    setValueInput(preVal)
    lastCall = curCall
  }
```

`onMouseUp`直接发`Command`，`Command`会改变全局变量，然后会被上面的`useEffect`检测并修改输入框的值

```tsx
        onMouseUp={() => {
          command(parseFloat(preVal))
        }}
```



**command示例**

```tsx
import { ICommand, getController } from './Command'
import { useEditorStore } from '@src/stores/editorStore'

export class Move implements ICommand {
  prePosition: number[]
  value: number
  index: number
  public constructor(value: number, index: number) {
    const { modelPosition } = useEditorStore.getState()
    this.prePosition = [...modelPosition]
    this.prePosition[index] = value
    this.value = modelPosition[index]
    this.index = index
  }

  execute(): void | Promise<void> {
    const controller = getController()
    const { setModelPosition } = useEditorStore.getState()
    if (controller) {
      controller.updateModelPosition(this.value, this.index)
      const curPosition = [...this.prePosition]
      curPosition[this.index] = this.value
      setModelPosition(curPosition)
    }
  }

  undo(): void | Promise<void> {
    const controller = getController()
    const { setModelPosition } = useEditorStore.getState()
    if (controller) {
      controller.updateModelPosition(this.prePosition[this.index], this.index)
      setModelPosition(this.prePosition)
    }
  }
}
```

