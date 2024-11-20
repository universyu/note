# Context与hooks结合

## 顶层Provider

构造一个确认弹窗，将其`Provider`放置顶层，下面的子组件各处都可以调用

```tsx
      <ConfirmDialogProvider>
    		....		
      </ConfirmDialogProvider>
```

```tsx
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useMemoizedFn } from 'ahooks'
import React, { useEffect, useMemo, useState } from 'react'

type ShowFnParamsType = {
  title: string
  confirmFn: Function
  confirmSuccessCb?: Function
  confirmErrorCb?: Function
  Content?: React.ReactNode
  cancelFn?: Function
  afterClose?: Function
}
type ConfirmDialogContextType = {
  show: ({
    title,
    confirmFn,
    Content,
    cancelFn,
    confirmSuccessCb,
    confirmErrorCb,
  }: ShowFnParamsType) => void
}
export const ConfirmDialogContext = React.createContext<ConfirmDialogContextType>(null as any)
type ConfirmDialogProviderProps = {
  children: React.ReactNode
}
export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
  const [open, setOpen] = useState(false)
  const [Content, setContent] = useState<React.ReactNode>()
  const [title, setTitle] = useState('')
  const [myConfirmFn, setMyConfirmFn] = useState<Function>()
  const [myCancelFn, setMyCancelFn] = useState<Function>()
  const [submitting, setSubmitting] = useState(false)
  const [confirmSuccessCb, setConfirmSuccessCb] = useState<Function>()
  const [confirmErrorCb, setConfirmErrorCb] = useState<Function>()
  const [afterClose, setAfterClose] = useState<Function>()
  const show = useMemoizedFn(
    ({
      title,
      confirmFn,
      cancelFn,
      Content,
      confirmSuccessCb,
      confirmErrorCb,
      afterClose,
    }: ShowFnParamsType) => {
      setOpen(true)
      setTitle(title)
      setConfirmSuccessCb(confirmSuccessCb)
      setConfirmErrorCb(confirmErrorCb)
      setAfterClose(afterClose)
      // console.log(confirmFn())
      setMyConfirmFn(() => confirmFn())
      if (Content) {
        setContent(Content)
      }
      const defaultCancelFn = () => {
        return () => {
          setOpen(false)
        }
      }
      const hasCancelFn = () => cancelFn?.()
      setMyCancelFn(cancelFn ? hasCancelFn : defaultCancelFn)
    }
  )

  const value = useMemo(() => ({ show }), [show])

  const handleConfirm = async () => {
    setSubmitting(true)
    if (!myConfirmFn) {
      setOpen(false)
      setSubmitting(false)
    }
    try {
      await myConfirmFn?.()
      setOpen(false)
      setSubmitting(false)
      confirmSuccessCb && confirmSuccessCb()
    } catch (error) {
      setSubmitting(false)
      confirmErrorCb && confirmErrorCb()
    }
  }

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <Dialog
        sx={{
          '& .MuiDialog-paper': { width: '80%', maxHeight: 435 },
          zIndex: (theme) => theme.zIndex.drawer + 1000,
        }}
        maxWidth="xs"
        open={open}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>{Content}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              myCancelFn?.()
            }}
            disabled={submitting}
          >
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={submitting}>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmDialogContext.Provider>
  )
}

```



## 封装hook

```tsx
import { useContext } from 'react'
import { ConfirmDialogContext } from '@src/components/comfirm/confirmDialogContext'

export const useConfirmDialog = () => useContext(ConfirmDialogContext)
```



## 应用

```tsx
  const confirmDialog = useConfirmDialog()
      confirmDialog.show({
      title: 'Delete',
      Content: 'Are you sure?',
      confirmFn: () => {
        return async () => {
          onDelete(index)
          setIsDelete(true)
        }
      },
    })
```

