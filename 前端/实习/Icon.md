# Icon

将`svg`做成可复用的icon，只需在svg标签内加入一个`{...props}`

利用React的高阶组件`memo`包裹的组件只在`props`改变的时候才会重新渲染

```tsx
import * as React from 'react'

function Demo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} ...>
	...
    </svg>
  )
}

export const FileName = React.memo(Demo)

```

