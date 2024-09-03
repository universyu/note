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

如果变量是对象或者数组，常常需要深拷贝做set才能触发UI的重新渲染，为了避免这个问题，可以使用`immer`库

```ts
export const usePromptStore = create(immer<storeState>( (set) => ({
  ...initStates,
  setPromptType: (promptType) => {
    set((state) => ({ state.promptType = state.promptType }))
  },
})))
```



#### 调用方法

结合`@mui/material`的`ToggleButtonGroup`和`ToggleButton`完成按钮的选择

```tsx
import React, { CSSProperties } from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { PromptType, usePromptStore } from '@src/stores/promptStore'
import { t } from 'i18next'

const PromptTypeSelector: React.FC = ({ style }: { style?: CSSProperties }) => {
  const { promptType, setPromptType } = usePromptStore()
  const handlePromptChange = (event: React.MouseEvent<HTMLElement>, prompt: PromptType) => {
   	  if(prompt !== null){
      	setPromptType(prompt)
      }
  }

  return (
    <ToggleButtonGroup
      value={promptType}
      exclusive
      onChange={handlePromptChange}
      style={{
        ...style,
        width: '100%',
        height: '44px',
        display: 'flex',
      }}
    >
      <ToggleButton
        value={PromptType.TEXT}
        style={{
          flex: 1,
          textTransform: 'none',
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '600',
        }}
      >
        {t('prompt:prompt_type_text')}
      </ToggleButton>
      <ToggleButton
        value={PromptType.IMAGE}
        style={{
          flex: 1,
          textTransform: 'none',
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '600',
        }}
      >
        {t('prompt:prompt_type_image')}
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default PromptTypeSelector

```



### 全局函数

#### 定义

如果一个函数是`async`开头的，那么返回值就是`Promise<>`，如果函数没有返回值，那么在尖括号中写`void`

```ts
//   apps/printMon/src/stores/sdStore.ts

import { create } from 'zustand'
import { querySDReq, GenerateSDParams, PostPrintMonSDResp, Resource } from '@src/Types'

interface storeState {
  querySD: (req: querySDReq) => void
  generateSD: (req: GenerateSDParams) => PostPrintMonSDResp
  uploadOriginImage: (file: File) => Promise<Resource>
  setQuerySD: (querySD: (req: querySDReq) => void) => void
  setGenerateSD: (generateSD: (req: GenerateSDParams) => PostPrintMonSDResp) => void
  setUploadOriginImage: (uploadOriginImage: (file: File) => Promise<Resource>) => void
}

const initStates = {
  querySD: (req: querySDReq) => {},
  generateSD: (req: GenerateSDParams) => {
    return {} as PostPrintMonSDResp
  },
  uploadOriginImage: async (file: File) => {
    return {} as Resource
  },
}

export const useSDStore = create<storeState>((set) => ({
  ...initStates,

  setQuerySD: (querySD: (req: querySDReq) => void) => {
    set(() => ({ querySD }))
  },
  setGenerateSD: (generateSD: (req: GenerateSDParams) => PostPrintMonSDResp) => {
    set(() => ({ generateSD }))
  },
  setUploadOriginImage: (uploadOriginImage: (file: File) => Promise<Resource>) => {
    set(() => ({ uploadOriginImage }))
  },
}))

```



#### 调用方法

```tsx
import { useSDStore } from '@src/stores/sdStore'
const { generateSD } = useSDStore()
```





### Hook、普通使用法

##### Hook法

形如`const { makeId } = useGlobalStore()`的用法只能存在于`React`的组件函数中，且在变量更新的时候自动触发渲染



##### 普通法

形如`const { makeId } = useGlobalStore.getState()`的用法可以在任意地方使用，只是单纯的获取一次值，而不会跟随着全局变量做更新



