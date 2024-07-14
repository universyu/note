# PrintMon

### 

### 整体框架

**整个页面**

```
<div id="root"> 来自index.html
   div(高宽100% absolute hidden)来自Main.tsx 用于存放多个page
      Prompt 来自Prompt.tsx  表示一个page
```

**Prompt详解**

```
div(flex 两个方向都center  100vh)
	Paper(flex:column padding 32px 24)
	Dialog确定删除图片的弹框
	Dialog点击Preview后的加载画面
	div(flex/none 两个方向都center absolute) 点击Preview出现
	Dialog确定生成模型的弹框
	Dialog生成模型的加载画面
```

absolute的元素不会被前面的元素挤掉，父级会把它当作第一个元素来渲染，所以把第二个div写成absolute可以让和第一个paper在同一个位置

**Paper详解**

```
Paper(flex: column padding)
	ToggleButtonGroup 
	div(flex:1 column)
		Paper(flex:1 relative marginTop:32px hidden)
			(Text版的标签
			<>
				div(absolute top、left:0 flex两个都是center)
					svg
					span
				TextField
				div(absolute bottom、right: 4%) 显示已有字数
					span
			)
			
			(Imag版的标签
			
			(如果没有上传图片
			div(flex:column 两个方向都center)
				input(display: none)
				svg
				p
				p
			)
			
			(如果已经上传图片
			div(relative )
				img(absolute)
				div(absolute) 删除按键
					svg
			)
			
			)
			
		
		button (Preview)
	
```



**点击Preview之后出现的div详解**

 ```
 div(flex/none 两个方向都center absolute)
 	Paper(flex:column 两个方向都center relative)
 		Typography 标题
 		div(id="grid")
 			ImageComponent组件
 		div 按钮
 ```









```
src
├── assets
│   ├── images
│   └── locales
├── components
│   ├── prompt
│   └── myGrid.tsx
├── pages
│   ├── Main.tsx
│   └── Prompt.tsx
├── stores
│   └── promptStore.ts
├── Generator.tsx
├── global.css
├── main.tsx
├── global.d.ts
├── index.html
```





#### index.html

直接导入`main.tsx`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Template</title>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```



#### src/main.tsx

对`src/Generator`做封装，这里导入了`./global.css`做样式设计，也导入了文本翻译的库：
```tsx
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import enJson from '@src/assets/locales/en.json';
import zhJson from '@src/assets/locales/zh.json';
```

利用文本翻译库的标签包裹页面内容

```tsx
function MainWrapper() {
  i18n.use(initReactI18next).init({
    resources: {
      en: { ...enJson },
      zh: { ...zhJson },
    },
    lng: 'en',
  });

  return (
    <>
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <Generator />
        </I18nextProvider>
      </React.StrictMode>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<MainWrapper />);
```

其中用到的翻译内容如下：

```json
//en.json
{
  "prompt": {
    "prompt_type_text": "Generate from Text",
    "prompt_type_image": "Generate from Image",
    "preview": "Preview"
  }
}

//zh.json
{
  "prompt": {
    "prompt_type_text": "从文字生成",
    "prompt_type_image": "从图片生成",
    "preview": "预览"
  }
}
```



#### src/Generator.tsx

这里直接返回写好的组件

```tsx
import React from 'react'
import { Main } from './pages/Main'

export default function Generator() {

  return (
    <Main></Main>
  )
}
```



#### src/pages/Main.tsx

设置整个页面，`pages`里面的组件都在这里决定要不要展现

```tsx
import Prompt from './Prompt'

export function Main() {

  return (
    <div
      style={{
        backgroundColor: '#EBEBEB',
        height: '100%',
        width: '100%',
        position: 'absolute',
        overflow: 'hidden',
      }}
    >
      <Prompt />
    </div>
  )
}
```





### 仅父级触发事件

为了实现：当鼠标进入父级标签的时候背景变色，父级和子级之间变化时不变色，从父级出去时变色
可以用事件监听的`currentTarget`

```tsx
onMouseOver={(e) => {
     e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';  
}}
onMouseOut={(e) => {
     e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
}}
```



### 局部拖拽文件

需要清除整个页面的拖拽逻辑，只在需要的地方加自定义拖拽



```tsx
const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
    }
  };

const handleDragOver = (event) => {
    event.preventDefault();
  };


  useEffect(() => {
    const handleWindowDrop = (event) => {
      event.preventDefault();
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);
```



```tsx
<div 
	onDragOver={handleDragOver}
    onDrop={handleDrop}
>
    ...
</divd>
```





### 后者覆盖前者的逻辑

父级div设置`position: 'relative'`
两个子标签，第一个设置css如下：

```css
position: 'absolute';
width: 100%;
height: 100%;

```



第二子标签设置css如下：

```css
position: 'absolute';
width: 100%;
height: 100%;
left: 0;
```



**基于这个原理，可以实现css虚假加载动画**

在一个父标签下放三个标签，一个是框图，一个是最终图片，一个是白布（设置了背景色为白色）。其中，唯有框图设置`z-index: 1`。由于默认写在后面的元素会盖在前面的元素之上，所以这样可以实现伪加载的动画



**示例代码**



```tsx
          <div
            style={{
              height: '208px',
              width: '384px',
              position: 'relative',
            }}
          >
            <img
              style={{
                width: '160px',
                height: '160px',
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              src={downImg}
              alt=""
            />
            <img
              style={{
                width: '160px',
                height: '160px',
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
              }}
              src={preImg}
              alt=""
            />
            <div
              style={{
                width: '160px',
                height: '160px',
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                animation: 'moveUp 3s forwards',
              }}
            ></div>
          </div>
```



![1](src/1.png)





### 路径简写

在根目录下的`tsconfig.json`中添加字段`paths`

```json
{
  "compilerOptions": {
    "paths": {
      "@src/*": ["src/*"],
      "@assets/*": ["src/assets/*"],
    },
}
```





### Dialog

`Dialog`标签会出现在和`id=root`的`div`同一级

![3](src/3.png)

**示例代码**

```tsx
      <Dialog
        open={confirmOpen}
        id="preview-dialog"
        sx={{
          backgroundColor: "rgb(94, 94, 94, 0.3)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "480px",
            height: "296px",
            boxSizing: "border-box",
            borderRadius: "16px",
          }}
        >
          <IconButton
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 5,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => {
              setConfirmOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent>
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "28px",
                textAlign: "center",
                marginBottom: 35,
              }}
            >
              Confirm Generate?
            </Typography>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "22px",
              }}
            >
              You still have <strong>5</strong> generate credits remaining, and
              this generate will consume one of your credits. You can redeem
              credits using your points.
            </p>
            <a
              href="#"
              style={{
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "22px",
                color: "#00AE42",
              }}
            >
              Go to Redemption
            </a>
          </DialogContent>

          <Button
            color="inherit"
            variant="contained"
            onClick={() => {
              setConfirmOpen(false);
            }}
            sx={{ textTransform: "none" }}
            style={{
              width: 144,
              height: 48,
              borderRadius: "8px",
              padding: "12px 16px 12px 16px",
              margin: "0 24px",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "24px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerate}
            sx={{ textTransform: "none" }}
            style={{
              width: 240,
              height: 48,
              borderRadius: "8px",
              padding: "12px 16px 12px 16px",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "24px",
              backgroundColor: "#00AE42",
            }}
          >
            Continue Generating
          </Button>
        </div>
      </Dialog>
```





### css加载动画



![4](src/4.png)



用一个`div`包裹文字和旋转对象

```tsx
        <div id="loadingWraper">
          <div id="loading"></div>
    
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "45%",
              padding: "0",
              margin: "0",
              transform: "translate(-50%,-50%)",
              fontSize: "32px",
              fontWeight: "700",
              lineHeight: "32px",
            }}
          >
            16
          </p>
          <span
            style={{
              position: "absolute",
              top: "45%",
              left: "70%",
              padding: "0",
              margin: "0",
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "24px",
            }}
          >
            %
          </span>
        </div>
```

首先确保`#loadingWraper`和`#loading` 的宽高一致，然后：

```css
#loadingWraper{
  display: flex;
  border-radius: 50%; 
  box-shadow: 0 4px 24px #c0bdbd99; 
}

#loading{
  position: absolute;
  width: 100px;
  height: 100px;
  text-align: center;
  display: inline-block; 
  box-sizing: border-box;
  border-top: 3px solid rgb(160, 217, 158); 
  border-radius: 50%; 
  animation: loading-360 0.8s infinite linear;
}
@keyframes loading-360 {
  0% {
      transform: rotate(0deg); 
  }
  100% {
      transform: rotate(360deg); 
  }
}

```



### tsx子组件

**子组件示例代码**

```tsx

type TextInputProps = {
  text: string
  setText: React.Dispatch<React.SetStateAction<string>>
  vaild?: boolean
  setVaild?: React.Dispatch<React.SetStateAction<boolean>>
}

type TextInputComponentProps = {
  style?: React.CSSProperties
  props: TextInputProps
}

const TextInput: React.FC<TextInputComponentProps> = ({ style, props }) => {
  const handleRandom = () => {
    props.setText('A cute cartoon tiger character with bright orange fur and black stripes.')
    if (!props.vaild ?? false) { //可选链
      props.setVaild?.(true) //可选参数
    }
    //@ts-ignore
  }
  ...
}
```



### tsx资源：Icon

**Icon示例**

```tsx
import * as React from 'react'

function RandomIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.4366 3.58058C12.8784 4.02236 13.247 4.52089 13.5354 5.06221C13.7449 5.45539 13.4874 5.92552 13.0608 5.97654L12.9838 5.98109H10.6614C10.3163 5.98109 10.0364 5.70127 10.0364 5.35609C10.0364 5.20889 10.0873 5.07358 10.1725 4.96678L10.2271 4.90659L11.0834 4.0499C9.12192 2.52332 6.2846 2.66151 4.48164 4.46447C3.70925 5.23686 3.24239 6.19908 3.08106 7.20096L3.07211 7.26123L3.0557 7.40068C3.02116 7.7412 2.73445 8.00031 2.39217 8.00031C2.06502 8.00031 1.7998 7.7351 1.7998 7.40795L1.80209 7.35617L1.81447 7.23249C1.81664 7.21354 1.81887 7.19542 1.82115 7.17814C1.99472 5.86247 2.58687 4.59146 3.59775 3.58058C6.03853 1.13981 9.99581 1.13981 12.4366 3.58058Z"
        fill="#00AE42"
      />
      <path
        d="M3.56514 12.4197C3.12336 11.978 2.75476 11.4794 2.46636 10.9381C2.25688 10.5449 2.51434 10.0748 2.94097 10.0238L3.01795 10.0192H5.34028C5.68546 10.0192 5.96528 10.299 5.96528 10.6442C5.96528 10.7914 5.91439 10.9267 5.82925 11.0335L5.77466 11.0937L4.91829 11.9504C6.87981 13.477 9.71713 13.3388 11.5201 11.5358C12.2958 10.7601 12.7634 9.79294 12.9227 8.78641L12.9413 8.64689C12.9441 8.62111 12.9469 8.59407 12.9496 8.56577C12.9802 8.24499 13.2496 8 13.5718 8H13.6096C13.9366 8 14.2017 8.26513 14.2017 8.59218L14.1995 8.64375L14.1792 8.83274C14.0038 10.1446 13.4121 11.4116 12.404 12.4197C9.9632 14.8605 6.00592 14.8605 3.56514 12.4197Z"
        fill="#00AE42"
      />
    </svg>
  )
}

export const Random = React.memo(RandomIcon)

```

