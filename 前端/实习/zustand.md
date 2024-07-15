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
    setPromptType(prompt)
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

