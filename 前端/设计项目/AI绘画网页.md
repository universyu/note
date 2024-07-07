# AI绘画网页

#### 调整子级img标签

```css
	占满整个父级标签
	width: 100%;
    height: 100%;
	
    object-fit: cover;  铺满的方式是保持原比例的缩放，以此来铺满父级标签
    object-position: 0 30%; 可以移动图片视角的位置
```

#### grid展示图片

设定整体父标签的宽高以此防止坍缩

```jsx
export default function xing() {
  return (
    <div className='xing'>
        <div className='container-grid'>

            <div className='grid-item'>
                <img src={xing1} alt="" />
            </div>

            <div className='grid-item'>
                <img src={xing2} alt="" />
            </div>

            <div className='grid-item'>
                <img src={xing3} alt="" />
            </div>

        </div>
    </div>
  )
}
```



```css
.xing{
    width: 100vw;
    height: 100vh;
}
.container-grid{
    width: 80%;
    height: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px 20px;
    top: 10%;
    left: 10%;
    position: absolute;
}

.grid-item{
    width: 100%;
    height: 100%;
}

.grid-item img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}   
```



#### 可复用式按钮

```jsx
import React from 'react'
import "./Button.css"

export default function Button( {text} ) {
  return (
    <div className='button'>{text}</div>
  )
}
```

 不设置宽高让它自适应

```css
.button {
    padding: 10px 20px; 
    background: -webkit-linear-gradient(16deg, #a1f8f0, #9261e5);
    border: none;
    border-radius: 20px; 
    color: white;
    text-align: center;
    font-size: 16px;  
}
```



#### Top按钮

```js
const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
```



