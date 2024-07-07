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



### label绑定input

在一个form中，可以让label绑定到指定id的input，这样点击label时就会选中input

##### 纯html版

```html
<form>
    <label for="postTitle">Post Title:</label>
	<input type="text" id="postTitle" name="postTitle">
</form>
```

##### React版

```jsx
<form>
    <label htmlFor="postTitle">Post Title:</label>
	<input type="text" id="postTitle" name="postTitle">
</form>
```



### 可选的下拉框

##### React版

```jsx
const usersOptions = users.map( (user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
) ) //value是实际的量，标签包含的是显示给用户看的量

<select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
</select>
```



### 根据情况禁用按钮

根据变量状态来决定canSave的值，然后写入disabled里

```jsx
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
```



### 简约版类博客

#####   创建vite项目

``` sh
npm create vite@latest
cd ...
npm install 
```



##### 下载依赖

```sh
npm install  react-redux @reduxjs/toolkit
npm install react-router-dom
npm install date-fns
```



##### 整体框架

根路由显示添加帖子的组件（AddPostForm）和已有的帖子（PostList），/posts/:postId是单独显示一份帖子的路由（PostPage），/editPost/:postId是编辑修改帖子的路由（EditPost）。

src
├── components
│   ├── Navbar.jsx
│   ├── store.js
├── features
│   ├── posts
│   │   ├── AddPostForm.jsx
│   │   ├── PostInfo.jsx
│   │   ├── PostList.jsx
│   │   ├── postsSlice.js
│   │   ├── ReactionButtons.jsx
│   ├── users
│       ├── usersSlice.js
├── pages
│   ├── EditPost.jsx
│   ├── PostPage.jsx
├── App.jsx
├── main.jsx



##### Navbar.jsx

```jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
        <h1>Redux Example</h1>
        <div>
            <Link to={'/'}>Posts</Link>
        </div>
    </nav>
  )
}

```





##### usersSlice.js

无需被改动的数组，reducers为空

```js
import { createSlice } from '@reduxjs/tookit'

const initialState = [
    { id: '0', name: 'Alice' },
    { id: '1', name: 'Bob' },
    { id: '2', name: 'Charlie' },
]

const usersSlice = createSlice( {
	name: 'users',
    initialState,
    reducers: {}
} )

export default uersSlice.reducer
```



##### postsSlice.js

reducers里面写对象，则其有reducer和prepare，其中prepare来做预处理，调用时传入的参数就传到prepare

```js
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from 'date-fns';

const initialState = [
    {
        id: '0',
        user: '0',
        title: 'First Post',
        content: 'Hello',
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            heart: 0,
            eyes: 0
        } 
    },

    {
        id: '1',
        user: '1',
        title: 'Second Post',
        content: 'helloWorld',
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            heart: 0,
            eyes: 0
        }
    },
]

const postsSlice = createSlice( {
    name: 'posts',
    initialState,
    reducers: {
        postAdd: {
            reducer( state, action ) {
                state.push( action.payload )
            },
            prepare( title, content, userId ){
                return {
                    payload: {
                        id: nanoid(),
                        user: userId,
                        title,
                        content,
                        date: new Date().toISOString(),
                        reactions: {
                            heart: 0,
                            eyes: 0
                        }
                    }
                }
            }
        },
        reactionAdd( state, action ){
            const { reaction, postId } = action.payload
            const existingPost = state.find( post => post.id === postId )
            if( existingPost ){
                existingPost.reactions[reaction]++
            }   
        },
        postUpdate( state, action){
            const { title, content, postId } = action.payload;
            const existingPost = state.find( post => post.id === postId )
            if( existingPost ){
                existingPost.title = title
                existingPost.content = content
            }
        }
    }
} )

export const { postAdd, reactionAdd, postUpdate } = postsSlice.actions

export default postsSlice.reducer
```



##### store.js

```js
import { configureStore } from '@reduxjs/toolkit';  
import postsReducer from '../features/posts/postsSlice';
import usersReducer from '../features/users/usersSlice';

export default configureStore( {
    reducer: {
        posts: postsReducer,
        users: usersReducer
    }
} )
```



##### AddPostForm.jsx

```jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import  postAdd  from './postsSlice'

export default function AddPostForm() {
  const [ title, setTitle ] = React.useState('')  
  const [ content, setContent ] = React.useState('')  
  const [ userId, setUserId ] = React.useState('')  

  const dispatch = useDispatch()
  const users = useSelector( state => state.users ) 
  
  const onSavePostClicked = () => {
    dispatch( postAdd( title, content, userId ) )
    setTitle('')
    setContent('')
  }
  
  const canSave = Boolean( title ) && Boolean( content ) && Boolean( userId )

  const usersOptions = users.map( user => (
    <option  key={ user.id } value={ user.id }>
      { user.name }
    </option>
  ) )


  return (
    <div>
        <h2>Add a New Post</h2>
        <form>
            <label htmlFor="postTitle">Title</label>
            <input
             type="text"
             id="postTitle"
             value={title}
             placeholder="Input Title Here"
             onChange={ (e) => { setTitle( e.target.value ) } } 
            />

            <label htmlFor="postContent">Content</label>
            <textarea
             id=""
             value={content}
             onChange={ (e) => { setContent(e.target.value) } }
            />

            <label htmlFor="postAuthor">Author</label>
            <select id="postAuthor" value={userId} onChange={ (e) => { setUserId(e.target.value) } }>
                <option value=""></option>
                { usersOptions }
            </select>

            <button type="button" onClick={ onSavePostClicked } disabled={!canSave}> 
              Save Post
            </button>

        </form>

    </div>
  )
}
```



##### PostInfo.jsx

```jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { parseISO, formatDistanceToNow } from 'date-fns'

export default function PostAuthor( { userId, timestamp } ) {
    const author =  useSelector( state => (
        state.users.find( user => user.id === userId )
    ) )
    const timePeriod = formatDistanceToNow( parseISO( timestamp ) )
    return (
    <span>by { author } {timePeriod} ago</span>
  )
}
```



##### ReactionButtons.jsx

```jsx
import React from 'react'
import { useDispatch } from 'react-redux'

import { reactionAdd } from './postsSlice'  


export default function ReactionButtons( { post } ) {
    const dispatch = useDispatch()

    const reactionEmoji = {
        heart: '❤️',
        eyes: '👀',
    }

    const reactionButtons = Object.entries( reactionEmoji ).map( ( [ name, emoji ] ) => (
        <button
            key={ name }    
            type="button"
            onClick={ () => { dispatch( reactionAdd( { postId: post.id, reaction: name } ) ) } } 
        >
            { emoji } { post.reactions[name] }
        </button>
    ) )

  return (
    <div>{ reactionButtons }</div>
  )
}
```



##### PostList.jsx

```jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import  PostInfo  from './PostInfo'
import  ReactionButtons  from './ReactionButtons'

export default function PostList() {
    const posts = useSelector( state => state.posts )

    const orderedPosts = posts.slice().sort( ( a, b ) => b.date.localeCompare( a.date ) )  //b字典序靠前就返回负数导致a排在b前面

    const renderedPosts = orderedPosts.map( post => (
        <article key={ post.id }>
            <h3>{ post.title }</h3>
            <div>
                <PostInfo userId={ post.user } timestamp={ post.date }></PostInfo>
            </div>
            <p>{ post.content }</p>
            <ReactionButtons post={ post } />
            <Link to={ `/posts/${post.id}` }>View Post</Link>
        </article>
    )  )

  return (
    <div>
        <h2>Posts</h2>        
        { renderedPosts }
    </div>
  )
}
```



##### PostPage.jsx

```jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom' 

import  PostInfo  from '../features/posts/PostInfo'
import  ReactionButtons  from '../features/posts/ReactionButtons'   


export default function PostPage() {
  const { postId } = useParams()

  const post = useSelector( state => ( 
    state.posts.find( post => post.id === postId )  
   ) )


  return (
    <div>
        <article>
            <h2>{ post.title }</h2>
            <div>
                <PostInfo userId={ post.user } timestamp={ post.date }></PostInfo>
            </div>
            <p>{ post.content }</p>
            <ReactionButtons post={ post } />
            <Link to={ `/editPost/${ post.id }` }>Edit Post</Link>
        </article>
    </div>
  )
}
```



##### EditPost.jsx

```jsx
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'  
import { useNavigate, useParams } from 'react-router-dom'

import  { postUpdate }   from '../features/posts/postsSlice'  


export default function EditPost() {
  const { postId } = useParams()
  
  const post = useSelector( state => state.posts.find( post => post.id === postId ) )   

  const [ title, setTitle ] = useState( post.title )
  const [ content, setContent ] = useState( post.content )  

  const dispatch = useDispatch()    
  const navigate = useNavigate()    

  const onSavePostClicked = () => {
    dispatch( postUpdate( { title, content, postId } ) )
    navigate( `/posts/${ postId }` )
  }  


  return (
    <div>
        <h2>Edit Post</h2>
        <form>
            <label htmlFor="postTitle">Title</label>
            <input
             type="text"
             id="postTitle"
             value={ title }
             placeholder="Input Title Here"
             onChange={ (e) => { setTitle( e.target.value ) } }
            />

            <label htmlFor="postContent">Content</label>
            <textarea
             id="postContent"
             value={ content }
             onChange={ (e) => { setContent( e.target.value ) } }    
            />
        </form>
        <button type="button" onClick={ onSavePostClicked }>Save</button>
    </div>
  )
}

```



##### App.jsx

```jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'

import  AddPostForm  from './features/posts/AddPostForm'  
import  PostList  from './features/posts/PostList'  
import  PostPage  from './pages/PostPage'
import  EditPost  from './pages/EditPost' 


function App() {
  
  return (
    <Router>
        <Navbar />

        <Routes>
            <Route
              path="/"
              element={ 
                <React.Fragment>
                   <AddPostForm />
                   <PostList />
                </React.Fragment>
              }
            />

            <Route path="/posts/:postId" element={ <PostPage /> }/>
            <Route path="/editPost/:postId" element={ <EditPost /> }/>
            <Route path="*" element={ <h1>Page Not Found</h1> }/> 
        </Routes>

    </Router>     
  )
}

export default App
```





