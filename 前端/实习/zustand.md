# zustand

### 全局状态

#### 定义全局hook

例程定义了一个存在两种状态的hook

```ts
import { create } from 'zustand'

export enum PromptType {
  TEXT,
  IMAGE,
}

interface storeState {
  promptType: PromptType
  setPromptType: (promptType: PromptType) => void
}

const initStates = {
  promptType: PromptType.TEXT,
}

export const usePromptStore = create<storeState>((set) => ({
  ...initStates,
  setPromptType: (promptType) => {
    set(() => ({ promptType }))
  },
}))

```
#### 避免深拷贝

如果变量是对象或者数组，常常需要深拷贝做set才能触发UI的重新渲染，为了避免这个问题，可以使用`immer`库，使用 immer 之后，对象的任何属性都可以单独被当做依赖项，而且 set 的时候是直接给 state 的属性赋值。

```ts
import { immer } from 'zustand/middleware/immer'

export const usePromptStore = create(immer<storeState>( (set) => ({
  ...initStates,
  setPromptType: (promptType) => {
    set((state) => ({ state.promptType = state.promptType }))
  },
})))
```

### Hook、普通使用法

##### Hook法

形如`const { makeId } = useGlobalStore()`的用法只能存在于`React`的组件函数中，且在变量更新的时候自动触发渲染



##### 普通法

形如`const { makeId } = useGlobalStore.getState()`的用法可以在任意地方使用，只是单纯的获取一次值，而不会跟随着全局变量做更新



### 优化性能

当同一个state里面的变量改变的时候，会导致其他变量所影响的UI也被重新计算，经过React虚拟DOM的比较，发现没有变化的不会重新渲染。

为了直接避免重新计算UI，可以将需要state变量单独返回，避免订阅整个 `store`

```tsx
const { theme } = useGlobalStore( state => state.theme )
const { setTheme } = useGlobalStore( state => state.setTheme )
```

但如果变量很多，写很多行就会很麻烦，可以用zustand提供的接口解决这个问题

```tsx
const { theme, setTheme } = useGlobalStore(
	useShallow(state => ({
        theme: state.theme,
        setTheme: state.setTheme,
    })
    )
)
```

