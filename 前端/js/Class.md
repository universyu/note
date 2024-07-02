# Class

类是一种函数（function） 利用类构造出来的实例是一个对象（object）
利用类构造对象时会自动调用类的constructor函数

```js
    class Clock {
        constructor({ template }) {
            this.template = template;
        }

        render() {
            let date = new Date();  //获取当下时间

            let hours = date.getHours();
            if (hours < 10) hours = '0' + hours;

            let mins = date.getMinutes();
            if (mins < 10) mins = '0' + mins;

            let secs = date.getSeconds();
            if (secs < 10) secs = '0' + secs;

            let output = this.template
                .replace('h', hours)
                .replace('m', mins)
                .replace('s', secs);

            console.log(output);
        }

        stop() {
            clearInterval(this.timer);
        }

        start() {
            this.timer = setInterval(() => this.render(), 1000);
        }
    }
    let clock = new Clock({template: 'h:m:s'});
    clock.start();
```

类的继承、一般方法重写

extends后面写继承的父类，类本身就是函数，extends后面也可以写返回一个类的函数

```js
function f(phrase) {
  return class {
    sayHi() { alert(phrase); }
  };
}
class User extends f("Hello") {
	sayHi(){
    	super.sayHi();
        alert("Welcome to my world!")
    }
}
new User().sayHi(); // 依次输出Hello和Welcome to my world!
```

构造函数重写

```js
    class Animal {
        constructor(name) {
            this.name = name;
        }
    }
    class Rabbit extends Animal {
        constructor(name, earLength) { 
            super(name);  //子类的构造函数必须先调用父类的构造函数
            this.earLength = earLength;
        }
    }
```

静态方法

静态方法以static为前缀，只属于类而不属于类的任何实例

```js
    class Article {
        constructor(title, date) {
            this.title = title;
            this.date = date;
        }

        static compare(articleA, articleB) { //用来比较Article类的实例
            return articleA.date - articleB.date;
        }
    }
    let articles = [
        new Article("HTML", new Date(2019, 1, 1)),
        new Article("CSS", new Date(2019, 0, 1)),
    ];
    articles.sort(Article.compare);  //调用静态方法的对象是类而不是任一个实例
    alert( articles[0].title ); // CSS
```

受保护的属性

以下划线开头的属性视作受保护的属性，约定不可直接操作这类属性，而是通过get/set间接操作
只设置了get而没有set的属性是只读属性

```js
class CoffeeMachine {
  _waterAmount = 0;
  set waterAmount(value) {
    if (value < 0) {
      value = 0;
    }
    this._waterAmount = value;
  }
  get waterAmount() {
    return this._waterAmount;
  }
  get power(){
  	return this._power;
  }
  constructor(power) {
    this._power = power;
  }
}
let coffeeMachine = new CoffeeMachine(100);
coffeeMachine.waterAmount = -10; // _waterAmount 将变为 0，而不是 -10
alert(coffeeMachine.waterAmount); // 0
```

多继承

函数的prototype可以设置其继承，向prototype拷贝就可以实现对多继承

```js
    let sayHiMixin = {
        sayHi() {
            alert(`Hello ${this.name}`);
        },
    };
    let showAgeMixin = {
        showAge(){
            alert(this.age);
        }
    };
    class User{
        constructor(name,age) {
            this.name = name;
            this.age = age;
        }
    }
    Object.assign(User.prototype, sayHiMixin);
    Object.assign(User.prototype, showAgeMixin);
    let entity = new User("Lios",19);
    entity.sayHi();
    entity.showAge();
```

