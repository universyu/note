# Context与hooks结合

## 构造上下文

这里把 `show` 当做全局传递变量，用`useMemo`防止重复渲染

```tsx
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Close } from '@src/assets/icons/Close'
import { CancelButton, WarningButton } from '@src/components/common'
import { t } from 'i18next'
import React, { ReactNode, useMemo, useState } from 'react'
type showFnParamsType = {
  title: ReactNode
  content?: ReactNode
}

type ConfirmDialogContextType = {
  show: ({ title, content }: showFnParamsType) => Promise<unknown>
}

export const ConfirmDialogContext = React.createContext<ConfirmDialogContextType>(null as any)

type ConfirmDialogProviderProps = {
  children: React.ReactNode
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
  const [dialogTitle, setDialogTitle] = useState<ReactNode | null>(null)
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null)
  const [dialogPromise, setDialogPromise] = useState<{ resolve: (value: unknown) => void } | null>(
    null
  )
  const show = ({ title, content }: showFnParamsType) => {
      // 存下这个 promise 的 resolve 函数
    const promise = new Promise((resolve) => {
      setDialogPromise({ resolve })
    })
    setDialogTitle(title)
    setDialogContent(content)
    return promise
  }
  const contextValue = useMemo(() => ({ show }), [show])

  const handleClose = () => {
    setDialogPromise(null)
  }

  const onConfirm = () => {
    dialogPromise?.resolve(true)
    handleClose()
  }

  const onCancel = () => {
    dialogPromise?.resolve(false)
    handleClose()
  }

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}
      <Dialog open={!!dialogPromise} PaperProps={{ sx: { padding: '24px 24px 8px' } }}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 16,
            fontWeight: 600,
            lineHeight: '24px',
            paddingLeft: 0,
          }}
        >
          {dialogTitle}
          <div
            onClick={onCancel}
            style={{ cursor: 'pointer', position: 'absolute', right: 12, top: 12 }}
          >
            <Close />
          </div>
        </DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <CancelButton onClick={onCancel}>{t('common:no')}</CancelButton>
          <WarningButton onClick={onConfirm}>{t('common:yes')}</WarningButton>
        </DialogActions>
      </Dialog>
    </ConfirmDialogContext.Provider>
  )
}

```



## 构造hooks

```tsx
import { ConfirmDialogContext } from '@src/components/confirm/confirmDialogContext'
import { useContext } from 'react'

export const useConfirmDialog = () => useContext(ConfirmDialogContext)
```



## 使用hooks

### 使用 Provider

```tsx
      <ConfirmDialogProvider>
        <ImageEdit />
      </ConfirmDialogProvider>
```



### 使用全局函数 show

```tsx
import { useConfirmDialog } from '@src/hooks/useConfirmDialog'
import React from 'react'
interface ImageEditProps {}

const ImageEdit: React.FC<ImageEditProps> = () => {
  const confirmDialog = useConfirmDialog()
  return <div>init</div>
}

export default ImageEdit

```



