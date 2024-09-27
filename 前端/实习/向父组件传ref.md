# 向父组件传ref

```tsx
import { forwardRef, useImperativeHandle } from 'react'
interface props{ props1:string }
export interface commonRef{
    commonvalue: Type | null
}
const Component = forwardRef<commonRef,props>(
 ({props1},ref)
=>{
    useImperativeHandle(ref, () => ({
      get commonvalue() {
        return 某个ref的current
      },
    }))
    return ...
}
)
export default Component
```

调用时

```tsx
import { commonRef } from ...
const componentRef = useRef<commonRef>(null)
用componentRef.current.commonvalue获取到从子组件暴露的ref
<Component ref={componentRef}/ >
```

