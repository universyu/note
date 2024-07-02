# Redux

### 基本概念

- store管理状态
- action描述行为
- reducer接受状态和行为，返回新状态
- 状态变化不会直接修改原状态，而是开了一个副本，修改完后进行整体覆盖

### 在React项目中安装

`npm install @reduxjs/toolkit react-redux`

### React中的计数器

##### counterSlice.js

`createSlice`创建slice包含初始值和name和reducers，其中name作为action的type前缀名

```js
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {  //type为 counter/increment
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})
```

`createSlice`自动生成action creator
**`export const { increment, decrement, incrementByAmount } = counterSlice.actions`**



在App.jsx里的调用：`   <button onClick={ () => dispatch( incrementAsync(5) ) }>Increment by 5 after 1 second</button>`
函数的定义：利用`createSlice`创建的reducers会自动接受两个参数，第二个参数action会自动利用传入的参数amount当作payload来构建
调用时，`Redux Thunk middleware`会自动调用返回函数，并传入`dispatch`和`getState`

```js
export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}
```



导出选择器函数和reducer

```js
export const selectCount = (state) => state.counter.value

export default counterSlice.reducer
```



##### store.js

利用reducer构建store

```js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice.js'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

```



##### main.jsx

利用`Provider`传递全局`store`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {store} from './store/store.js'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

```



##### App.jsx

使用选择器获取值，使用actions改变值

```jsx
import { useState } from 'react'
import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementAsync, selectCount } from './store/counterSlice'

function App() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={ () => dispatch( increment() ) }>Increment</button>
      <button onClick={ () => dispatch( decrement() ) }>Decrement</button>
      <button onClick={ () => dispatch( incrementAsync(5) ) }>Increment by 5 after 1 second</button>
    </>
  )
}

export default App

```



### React中的可添加列表

##### postSlice.js

创建slice

```js
import { createSlice } from "@reduxjs/toolkit"

const initialState =  [ 
    { id: 1, title: 'First Post!', content: 'Hello!' },
    { id: 2, title: 'Second Post', content: 'More text' }
]

const postSlice = createSlice(
    {
        name: 'posts',
        initialState,
        reducers: {
            postAdd: ( state, action ) => {
                state.push( action.payload )
            }
        }
    }   
)

export const { postAdd } = postSlice.actions
export default postSlice.reducer
```



##### store.js

创建store

```js
import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './postSlice.js'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
})

```



##### main.jsx

传递store

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './store/store.js'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```



##### PostList.jsx

展示列表

```jsx
import React from 'react'
import { useSelector } from 'react-redux'
import './PostList.css'

export default function PostList() {
  const posts = useSelector( state => state.posts );

  return (
    <>
      {
        posts.map( post => (
            <div className='post' key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
            </div>
         ) )
      }  
    </>
  )
}
```



##### App.jsx

展示列表以及处理添加逻辑

```jsx
import React,{useState} from 'react'
import {useDispatch} from 'react-redux' 
import PostList from './components/PostList.jsx'
import { postAdd } from './store/postSlice.js'


export default function App() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')  
  const dispatch = useDispatch()

  const handleAddPost = () => {
    const newPost = {
      id: Date.now(),
      title,
      content,
    };
    dispatch(postAdd(newPost));
    setTitle('');
    setContent(''); 
  }

  return (
    <>
      <h1>Post</h1>
      <PostList />
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>
    </>
  )
}
```

