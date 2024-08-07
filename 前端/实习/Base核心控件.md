# Base核心控件



![7](D:\note\前端\实习\src\7.png)



### 输入框

`type="number"`的`input`标签（`value`是string类型）

设置其`value`为一个变量：` const [valueInput, setValueInput] = useState<string>(init)`

设置其`onChange`为自由修改：`     onChange={ (e) => { setValueInput(e.target.value) } }`

设置其失焦（`onBlur`）和按下回车键`onKeyDown中的if(e.key==='Enter')`触发的函数：

- 正则表达式校验值为数字，否则让值变成0
- 限制范围在最大值和最小值之间

```tsx
 const parseAndValidateValue = (): number => {
    let valNum = parseFloat(parseFloat(value).toFixed(1))
    if (valNum > maxV) valNum = maxV
    else if (valNum < minV) valNum = minV
    return valNum
  }

  const backupVal = useRef<number>(parseFloat(init))
  const backupValues = useRef<number[]>([1, 1, 1])
  const handleInput = () => {
    const newDependencies = [...dependencies]
    if (careLock) {
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        const valNum = parseAndValidateValue()
        const proportion = valNum / dependencies[index]
        const newDependencies = dependencies.map((item) => item * proportion)
        setDependencies(newDependencies)
      } else {
        setDependencies([0.5, 0.5, 0.5])
      }
    } else {
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        const valNum = parseAndValidateValue()
        newDependencies[index] = valNum
        setDependencies(newDependencies)
      } else {
        newDependencies[index] = 0.5
        setDependencies(newDependencies)
      }
    }
    if (careLock) {
      const commandFn = command as (values: number[]) => void
      commandFn(backupValues.current)
    } else {
      const commandFn = command as (value: number) => void
      commandFn(backupVal.current)
    }

    backupVal.current = dependencies[index]
    backupValues.current = [...dependencies]
  }
  const handleKeyDOWN = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInput()
    }
  }
```

外界修改（这里特指`reset`按钮）全局变量时，同步做更新，这部分代码写在调用组件的位置

```tsx
  useEffect(() => {
    setValueInput(dependencies[index].toString())
  }, [dependencies])
```



### 滑动框

`type='range'`的`input`标签（`value`是string类型）

直接使用全局变量作为`value`

拖动的时候直接触发`controller`的函数

```tsx
const backupValues = useRef<number[]>([1, 1, 1])
  const backupVal = useRef<string>(init)
  const lastCall = useRef<number>(0)
  const handleDrag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const curCall = Date.now()
    if (curCall - lastCall.current < 50) {
      return
    }
    const newVal = e.target.value
    if (careLock) {
      const proportion = parseFloat(e.target.value) / backupValues.current[index]
      const newDependencies = backupValues.current.map((item) => {
        const multipliedValue = item * proportion
        return parseFloat(multipliedValue.toFixed(1))
      })
      const dragingFn = draging as (values: number[]) => void
      dragingFn(newDependencies)
    } else {
      const dragingFn = draging as (value: number, index: number) => void
      dragingFn(parseFloat(newVal), index)
    }
    lastCall.current = curCall
  }

```

`onMouseUp`直接发`Command`，`Command`会改变全局变量，然后会被上面的`useEffect`检测并修改输入框的值

```tsx
      onMouseUp={() => {
        if (careLock) {
          const commandFn = command as (values: number[]) => void
          commandFn(backupValues.current)
        } else {
          const commandFn = command as (value: number) => void
          commandFn(parseFloat(backupVal.current))
        }
      }}
```

`onMouseDown`更新回退值

```tsx
      onMouseDown={() => {
        backupVal.current = dependencies[index].toString()
        backupValues.current = [...dependencies]
      }}
```



**command示例**

```tsx
import { ICommand, getController, getEditStore } from './Command'

export class Move implements ICommand {
  prePosition: { x?: number; y?: number; z?: number }
  curPosition: { x?: number; y?: number; z?: number }
  public constructor(params: { x?: number; y?: number; z?: number }) {
    this.prePosition = params

    const modelPosition = getEditStore().modelPosition
    this.curPosition = {}

    if (params.x !== undefined) {
      this.curPosition.x = modelPosition[0]
    }
    if (params.y !== undefined) {
      this.curPosition.y = modelPosition[1]
    }
    if (params.z !== undefined) {
      this.curPosition.z = modelPosition[2]
    }
  }

  execute(): void | Promise<void> {
    const controller = getController()
    if (controller) {
      controller.updateModelPosition(this.curPosition)
    }
  }

  undo(): void | Promise<void> {
    const controller = getController()
    if (controller) {
      controller.updateModelPosition(this.prePosition)
    }
  }
}

```

