# countingstars设计

### 背景图不动，内容可滑动

```js
//React
    return (
        <div className={"container"}>
            <div className={"content"}></div>
        </div>
    )
```

```css
body, html {
    height: 100%;
    margin: 0;
    padding: 0;
}
html{
    overflow: hidden;
}
.container {
    background-attachment: fixed;
    height: 1199px;
    background-image: url('../public/YuukaNoa.png'), url('../public/Yor2.jpg'); /* 左右图片的 URL */
    background-size: auto 100%, auto 100%; /* 设置两张背景图片的尺寸，宽度为原始宽度，高度为100% */
    background-position: left top, right top; /* 设置两张背景图片的位置 */
    background-repeat: no-repeat; /* 禁止背景图片重复 */
}
.content{
    height: 100%;
    width: 900px;
    position: absolute;
    left: 50%;
    margin-left: -400px;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #cccccc;
    color: #000000;
}
```

### 鼠标点击切换图标样式

```js
//React
    document.body.style.cursor = "url(./cursor/1.png),auto";

    var cursorUrls = [
        "./cursor/1.png",
        "./cursor/2.png",
        "./cursor/3.png",
        "./cursor/4.png",
        "./cursor/5.png",
        "./cursor/6.png",
        "./cursor/7.png",
        "./cursor/8.png",
        "./cursor/9.png"
    ];
    var currentIndex = 0;

    function changeCursor() {

        var nextCursorUrl = cursorUrls[currentIndex];

        document.body.style.cursor = 'url(' + nextCursorUrl + '), auto';

        currentIndex = (currentIndex + 1) % cursorUrls.length;
    }

    document.body.addEventListener('click', changeCursor);
```

### 原样导入代码块

```js
//React
    const codeString = `
...
    `;
```

```css
pre {
    background-color: #f5f5f5;
    border-radius: 4px;
}

code{
    font-family: "Courier New", Courier, monospace;
    color: #d63384; /* 代码颜色 */
}
```

