# tailwindcss

### 安装

`npm install -D tailwindcss postcss autoprefixer`
`npx tailwindcss init`

根目录下创建`postcss.config.js` 其内容如下

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

`tailwind.config.js`内容如下

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```



将`index.html`和`input.css`放在src文件夹中，`input.css`内容如下

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

转换出可用的css `npx tailwindcss -i ./src/input.css -o ./src/styles.css`

`index.html`内容如下

```html
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/src/styles.css" rel="stylesheet">
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```

