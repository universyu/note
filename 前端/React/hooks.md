# hooks

### state

在循环（比如while）中直接使用hooks不会自动更新值，应该自己每次循环都取最新的值，用`getState()`来实现

### ref

如果想要记住某个变量，但是不想每次改变值就触发重新渲染，那么就用`ref`代替`state`

```js
//App.js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('你点击了 ' + ref.current + ' 次！');  //每点击一次显示的点击次数都加一
  }

  return (
    <button onClick={handleClick}>
      点击我！  
    </button>
  );
}

```

### ref控制DOM

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
    return <input {...props} ref={ref} />;
});

export default function Form() {
    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus();
    }

    return (
        <>
            <MyInput ref={inputRef} />
            <button onClick={handleClick}>
                聚焦输入框
            </button>
        </>
    );
}
```

点击“聚焦输入框”按钮可以使输入框聚焦

![屏幕截图 2024-05-21 194803](image/屏幕截图 2024-05-21 194803.png)

### Effect

- effect会在每一次渲染后立刻被调用，可以用effect包装一些不允许在渲染期间做的操作
- 可以为effect加入依赖数组，这样effect只会在依赖数组之内的值有更改的时候才调用，避免不必要的运行
- 当依赖数组改变值，但是前后两次的值相等，也不会触发useEffect里面的函数

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            ref.current.play();
        } else {
            ref.current.pause();
        }
    }, [isPlaying]);

    return <video ref={ref} src={src} loop  />;
}

export default function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [text, setText] = useState('');
    return (
        <>
            <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <br/>
            <VideoPlayer
                isPlaying={isPlaying}
                src="./flower.mp4"
            />
        </>
    );
}
```

![屏幕截图 2024-05-22 130329](image/屏幕截图 2024-05-22 130329.png)

