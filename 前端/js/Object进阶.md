# Object进阶

## this


this是函数拥有的一个变量，它代表调用这个函数的对象，也就是函数名前面的点前面的那个对象
构建无值对应的键只需要用this就可以实现，示例如下

```js
let calculator = {
    sum() {
        return this.a + this.b;
    },
    mul() {
        return this.a * this.b;
    },
    read(){
        this.a = +prompt("input a","0");
        this.b = +prompt("input b","0");
    }
};
```

## 链式调用

连续调用一个对象的方法，可以用点来连接完成链式调用，省去多行调用代码

```js
//对象定义
let ladder = {
  step: 0,
  up() {
    this.step++;
  },
  down() {
    this.step--;
  },
  showStep: function() { // 显示当前的 step
    alert( this.step );
  }
};
//普通调用
ladder.up();
ladder.up();
ladder.down();
ladder.showStep(); // 1
ladder.down();
ladder.showStep(); // 0
//链式调用
ladder.up().up().down().showStep().down().showStep(); // 展示 1，然后 0
```

## 可选链

- ?.获取属性比直接用点要更安全，因为当属性不存在的时候，不会报错
- ?.[]获取获取属性比直接用[]更安全，属性不存在的时候不会报错
-  ?.()调用函数，当函数不存在的时候什么都不会干，也不会报错

## symbol

- symbol标志的变量是唯一的

```js
let id1 = symbol("id");
let id2 = symbol("id");
alert(id1==id2) //false
```

- symbol标志对象成员时需要用中括号定义和引用
- symbol标志的对象成员是隐藏的，用for...in的时候会跳过此成员
- symbol标志的成员对象是可复制的，用Object.assign时不会跳过此成员

```js
let id = symbol("id");
let user = {
	[id]:123,
};
let clone = Object.assign({},user);
alert(clone[id]); //123
```

