# CSS Modules

为了防止类名冲突，可以使用`.module.css`文件


**使用示例**


```module.css
.shape {
  height: 0;
  width: 0;
}
```

```tsx
import styles from './reset.module.css';

export default function Page() {
    return (
        <div className={ styles.shape }>
        	...
        </div>
    )
}
```

