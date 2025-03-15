## 初始化 CLI

### 安装指令

`npm install -D tailwindcss@3`

### 初始配置

`npx tailwindcss init`

修改 tailwind.config.js 中的 content 为使用了 tailwind 类的文件目录

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 导入样式

创建 src/input.css，base是对浏览器样式的重置，components是用户自定义的类，utilties是tailwind自带的原子类

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 编译指令

`npx tailwindcss -i ./src/input.css -o ./src/output.css --watch`

在开发的 html 中引入 output.css 即可

## 自定义样式

### 普通样式定义

tailwind.config.js 中的 theme 中的 extend 写自定义样式
backgroundColor 对应使用时的 bg
```js
backgroundColor:{
	"custom-gray":"#333"
}
```
使用时 class="bg-custom-gray"

### 伪类样式定义

theme 中创建 variants 对象并在其中加入 extend 对象，为需要触发伪类的样式加上对应的伪类，给父组件加上 group 类，子组件写 `textColor: ["group-hover"]`  表示父组件 hover 的时候可改变textColor
使用：`class="group-hover:text-orange-500"`

## 插件

tailwind.config.js 中的 plugins 中写 js 函数添加任何自定义的类或者组件，不再需要像 extend 里面的内容一样调用时受到 tailwindcss 规范的影响。 plugins 是一个数组，里面存放函数，函数接收一个对象，结构出一个函数：{ addUtilities } ， addUtilities 是 tailwind 提供的内置函数，接收一个对象，把对象中的类添加到 tailwind 的  utilities ，下面的 rotate-screen 使用时可以直接用这个类名，不需要加上 tailwind 的规范

```js
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.rotate-screen': {
          transform: 'rotate(90deg)',
        }
      }
      addUtilities(newUtilities)
    }

  ]
```


