
## rollup.config.js

### 准许 import、export

要么改 js 后缀为 mjs ，要么在 package.json 中设置 type 为 module

### jsdoc 开启代码提示

```javascript
/**
 * @type {import('rollup').RollupOptions}
 */
```

### 引入自带的函数开启代码提示

```javascript
import { defineConfig } from 'rollup'

export default defineConfig({
    input:"src/index.js"
})
```