# this

### 默认绑定

普通函数直接调用则this绑定全局变量，严格模式下，this绑定到undefined



### 隐式绑定

函数作为对象的属性调用则会将this隐式绑定到这个对象

#### **正常绑定**

```js
function foo(){
    console.log(this.a)
}
var obj - {
    a: 42,
    foo: foo
}
obj.foo() // 42
```

#### **引用导致this丢失**

在上面的例子中，如果给函数一个别名`var bar = obj.foo` 这个时候它引用的是函数本身，如果这样调用`bar()`就相当于在全局的位置调用foo函数。

#### 传参过程this丢失

```js
function doFoo(fn){
    fn()
}
doFoo(foo)
```

即便是传入js内置函数也会发生this丢失，比如setTimeout等



### 显示绑定

- apply为函数设置绑定的this，然后调用它
- bind为函数设置绑定的this，然后返回一个新的函数，但是不会调用它

