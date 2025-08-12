# javaScript

### 事件循环

- 执行栈存被调用函数的上下文
- 微任务队列存`Promise`的回调函数还有`await`之后的代码
- 宏任务队列存`setTimeout`里面的函数
- 先执行同步函数，在执行栈空时检查事件队列，先检查微任务队列，其空了再检查宏任务队列，宏任务每次事件循环只执行一次，执行完后会把整个微任务队列都执行完再执行下一个宏任务

```js
async function async1() {

  console.log('async1 start')

  await async2()

  console.log('async1 end')

}

async function async2() {

  console.log('async2')

}

console.log('script start')

setTimeout(function () {

  console.log('settimeout')

})

async1()

new Promise(function (resolve) {

  console.log('promise1')

  resolve()

}).then(function () {

  console.log('promise2')

})

console.log('script end')
```

`setTimeout`设置的为宏任务，最后执行

`await`的后续以及`promise`的回调都是微任务

执行顺序为：
script start
async1 start
async2
promise1
script end
async1 end
promise2
settimeout

### 垃圾回收机制

具有可达性的内存是不会被回收的，全局变量永远都是可达的。

**内部算法：标记-清除**类似广度优先搜索，先找到所有的根并找到它们的引用，做标记，这个过程中无法访问的内存视作是不可达的，就回收

### 最值函数

无参数时，最小值函数返回正无穷，最大值函数返回负无穷

```js
var min = Math.min();
max = Math.max();
console.log(min < max); //false 
```

### 继承

继承者本身并不会有父类的属性，调用时会去父级查找，所以无法用`delete`删除

```js
var company = {
    address: 'beijing'
}
var yideng = Object.create(company) //create(company);
delete yideng.address
console.log(yideng.address); //beijing
```

### 异步

`defer`在文档加载完后执行，执行时保持各`defer`之间的顺序

`async`在对于的script标签加载完成后就立刻执行

### 长度

- `length`:获取数组、字符串或类数组对象
- `size`:获取`Map`和`Set`的大小
- 普通对象`{}`无法获取长度 

### 闭包

一个函数中定义另一个函数，且内部函数可以访问外部函数的变量，这种变量访问机制称为闭包
**闭包底层原理**

- 作用链域：函数执行时会创建一个执行上下文，执行上下文包含了作用链域，作用链域是一个包含当前执行上下文中的变量对象及父执行上下文中的变量对象的列表。访问一个变量时，如果当前作用域找不到就沿着链向上找，直到找到变量或者抵达全局作用域
- 外部函数中的变量会被内部函数的作用链引用不会被垃圾回收

**题目描述： 写一个函数，接受一个初始值并返回一个包含三个函数的对象，分别是将现值加1和减1还有回归初始值**

```js
var createCounter = function(init) {
        let counter = init;
        return {
            increment : () => {
                return ++counter;
            },
            decrement : () => {
                return --counter;
            },
            reset : () => {
                return counter = init;
            }
        }
    };
```

**题目描述：分析代码输出**

```js
	var a = 0;
    var b = 0;
    var c = 0;
    function fn1(a) {
        console.log('fn1', a++, c)
        function fn2(b) { console.log('fn2', a, b, c) }
        var c = 4;
        return fn2;
    }
    var fn2 = fn1(1);
    fn2(2);
```

这里c在fn1中声明，声明被拉到fn1的顶部，第一次输出c是`undefined` c被赋值成4，fn2继承fn1的词法环境，在这个环境中，c已经是4了，所以第二次输出的是4

### 数组

**题目描述：数组去重**

```js
let newArr = [...new Set(oldArr)]; //利用Set
let newArr = oldArr.filter( (val,ind) => { Array.indexOf(val) === ind } ); //利用filter
let newArr = oldArr.reduce( (arr,val) => {
	if(!arr.includes(val)){
    	arr.push(val);
    }
    return arr;
} , []);
```

**题目描述：按照给定数组和给定方法获得新数组，给定的方法有数值和下标两个输入参数**

自己处理回调函数

```js
var map = function(arr, fn) {
        const newArr = {};
        for(let i=0;i<arr.length();i++){
            newArr.push(fn(arr[i],i));
        }
        return newArr;
    };
```

内置方法解决

```js
 var map = function(arr, fn) {
        return arr.map( (val,ind) => fn(val,ind) );
    };
```

**题目描述：根据fn函数过滤数组**

内置方法

```js
var filter = function(arr, fn) {
        return arr.filter( (val,ind) => fn(val,ind) );
    };
```

**题目描述：完成reduce功能（如果fn是求和函数，那么结果就是把整个数组与init求和）**

自己处理（let of是值遍历，let in是键遍历）

```js
var reduce = function(nums, fn, init) {
        let res = init;
        for(let val of nums){
            res = fn(res,val);
        }
        return res;
    };
```

内置函数

```js
var reduce = function(nums, fn, init) {
    return nums.reduce(fn, init);
};
```

**题目描述：将数组以size做分割**

```js
var chunk = function(arr, size) {
    const chunkedArr = [];
    let ind = 0;
    while(ind < arr.length){
        chunkedArr.push( arr.slice(ind,ind+size) );
        ind += size;
    }
    return chunkedArr;
};
```

**题目描述：fn求分类标准，依照数组返回一个对象，键是分类标准**

```js
Array.prototype.groupBy = function(fn) {
	return this.reduce( (res,item)=>{ //res继承上份返回值，item是当下遍历到的内容
    	const key = fn(item);
        res[key] ||= [];
        res[key].push(item);
        return res;
    } , {} ) //初始值为空对象
}
```

**题目描述：合并两个数组，数组内的元素是对象，对象都有id值，要求按照id值升序排序，并且同id值时，第二个数组的对象覆盖第一个数组的对象**

```js
var join = function(arr1, arr2) {
  const combinedArr = arr1.concat(arr2);
  const merged = {}; //用对象是为了方便覆盖
  combinedArr.forEach( item => {
  	const id = item.id;
    if( !(id in merged) ){
        merged[id] = item;
    }
    else{
    	merged[id] = {...merged[id],...item};  //如果有同键的键值对，后面会覆盖前面
    }
  } );
  const res = Object.values(merged);
  res.sort( (a,b) => a.id - b.id );  //如果减法的结果小于零，那么a排前，等于零就a和b之间的位置不变，大于零就b排前
  return res;
};
```

**题目描述：根据给定的深度对数组做展开，如果n是0就不展开，是1就把数组内的数组展开，是2就把数组内的数组内的数组也展开**

```js
var flat = function (arr, n) {
    let res = [];
    const flattening = (nums,l) => {
        for(let val of nums){
    		if(Array.isArray(val) && l>0){
            	flattening(val,l-1);
            }	
            else{
            	res.push(val);
            }
        }
    }
    flattening(arr,n);
    return res;
};
```

**题目描述：对于一个数组或者对象，它内部存在数组或者对象，要求去掉所有假值**

深度优先搜索

```js
var compactObject = function(obj) {
    const dfs = (item) => { 
        if(!item) return false;
        if(typeof item !== 'object') return item;

        if(Array.isArray(item)){
            const ret = [];
            for(let val of item){
                const cur = dfs(val); 
                if(cur){
                    ret.push(cur);
                }
            }
            return ret;
        }

        else{
            const ret = {};
            for(let key in item){ 
                const cur = dfs(item[key]); 
                if(cur){
                    ret[key] = cur; 
                }
            }
            return ret;
        }
    }
    return dfs(obj);
};
```

### 函数

**题目描述：返回一系列函数的复合函数**

```js
var compose = function(functions) {  //这样传递的是类数组，不能使用map等方法，如果是...fuctions则是数组
        return function(x) {
            let res = x;
            for(let i=functions.length-1;i>=0;i--){
                res = functions[i](res);
            }
            return res;
        }
    };
```

**题目描述：将函数变成一个记忆函数**

```js
function memoize(fn) {
    const cache = {};
    return function(...args) {
        const key = JSON.stringify(args);
        if (key in cache) {
            return cache[key];
        }
        const functionOutput = fn(...args);
        cache[key] = functionOutput;
        return functionOutput;
    }
}
```

### 异步

**题目描述：手写实现Promise**



**题目描述：实现睡眠函数**

调用方法：`sleep(100).then( () => {...} )`可以让函数在100ms后执行

```js
    async function sleep(millis) {
        return  new Promise( resolve => {
            setTimeout( resolve, millis );  //延时执行resolve从而改变promise的状态
        } );
    }
```

·**题目描述：实现可取消的延时函数**

调用方法：`const cancelFn = cancellable( ..., [...], t);setTimeout(cancelFn, cancelTimeMs);`
如果`cancelTimeMs`比`t`大，那么就会执行`fn` 否则不会执行

```js
var cancellable = function(fn, args, t) {
    let timeOut = setTimeout( () => fn(...args), t ); //用...args是因为示例中，一个参数用fn(x1)，两个参数用fn(x1,x2)，fn不是直接接收数组为参数的，不能直接用args，cancellable中是直接写args，它接收数组[...]为参数
    return function cancelFn(){
        clearTimeout(timeOut);
    };
};
```

**题目描述：实现可取消的间隔运行函数**

```js
var cancellable = function(fn, args, t) {
    fn(...args);
    let timeInterval = setInterval( () => fn(...args), t );
    return () => {
        clearInterval(timeInterval);
    };
};
```

**题目描述：限制函数的运行时间**

```js
var timeLimit = function(fn, t) {
	return async function(...args){
    	return new Promise( (resolve,reject) => {
        	setTimeout( () =>{
            	reject("Time Limit Exceeded");
            } , t );
            fn(...args).then(resolve).catch(reject);
        } );
    };
}
```

**题目描述：构建一个类，它的属性是限时有效的**

```js
class TimeLimitedCache {
    cache = new Map();
    set(key,value,duration){
        const preValue = this.cache.get(key);
        if(preValue){
            clearTimeout(preValue.timeout);
        }
        let timeout = setTimeout( () => this.cache.delete(key) , duration );
        this.cache.set(key,{value,timeout});
        return Boolean(preValue);
    }
    get(key){
        return this.cache.has(key) ? this.cache.get(key).value : -1;
    }
    count(){
        return this.cache.size;
    }
};
```

**题目描述：实现防抖函数**

```js
var debounce = function(fn, t) {
    let timeout = null;
    return function(...args) {
        if(timeout){
            clearTimeout(timeout);
        }
        timeout = setTimeout( () => fn(...args),t);
    }
};
```

### 多态

利用原型链实现多态

```js
function Instrument() {}
Instrument.prototype.play = function(){
	throw new Error("It should be implemented.");
};
function Piano() {}
Piano.prototype = Object.create(Instrument.prototype); //Piano的原型和Instrument的原型分离，不会更改到它
Piano.prototype.play = function(){
	console.log("Playing piano");
};
```

ES6中引入了类，下面利用类实现多态

```js
class Instrument {
    play() {
        throw new Error("Method 'play()' must be implemented.");
    }
}

class Piano extends Instrument {
    play() {
        console.log("Playing piano");
    }
}
```

### 原型链

**修改原型链上的方法**

```js
function Base(arg){
	this.ba = arg;
}
Base.prototype.fn = function(){
	return 0;
}
function Child(arg){
	this.ch = arg;
}
Child.prototype = Object.create(Base.prototype); //不可以直接等于Base.prototype防止无法做多态
Child.prototype.constructor = Child; //如果不这么写的话，demo.prototype会是Base
Child.prototype.fn = function(){
	return 1;
}
let demo = new Child(1); 
```

### 类

**题目描述：实现事件发射器**

```js
class EventEmitter {
   constructor(){
       	this.events = {};
   }
   
   subscribe(event,callback){
   		this.events[event] = this.events[event] ?? []; //找到第一个非空值，如果没有就返回最后一个值
       	this.events[event].push(callback);
     	return {
        	unsubscribe: () => {
          		this.events[event] = this.events[event].filter(f => f!==callback); //删除当下这个事件
                if(this.events[event].length === 0){
                    delete this.events[event];
                }
            }
        };
   }
       
   emit(event,args=[]){ //默认参数为[]
		if( !(event in this.events) ){
        	return [];
        }
       	return this.events[event].map( f => f(...args) );
   }  
}
```

**题目描述：完成String和+的重载**

调用方法：

```
const obj1 = new ArrayWrapper([1,2]);
const obj2 = new ArrayWrapper([3,4]);
obj1 + obj2; // 10
String(obj1); // "[1,2]"
```

```js
var ArrayWrapper = function(nums) {
    this.val = nums;
};

ArrayWrapper.prototype.valueOf = function() {
    return this.val.reduce( (sum,num) => sum+num , 0);
}

ArrayWrapper.prototype.toString = function() {
    return "[" + this.val.join(",") + "]";
}

```

**题目描述：设计可以链式调用的计算器类**

```js
class Calculator {
    
    constructor(value) {
        this.val = value;
    }
    
    add(value){
        return new Calculator(this.val+value);
    }
    
    divide(value) {
        if(value===0){ //js中不会因为除以0而报error，所以不可以用try catch
            throw new Error("Division by zero is not allowed");
        }
        return new Calculator(this.val/value);
    }
    
    power(value) {
        return new Calculator(this.val**value);
    }
    

    getResult() {
        return this.val;
    }
}
```

###  柯里化

可以参数复用，使函数调用更加灵活

```javascript
function curry(fn){

	return curried(...args){
    	if(args.length >= fn.length){
        	return fn.apply(this,..args);
        }
        else{
        	return function(...args1){
            	return curried.apply(this,args.concat(args1));
            }
        }
    }

}
```

### 滚动窗口

**找到字符串的最大不重复子串**

```js
function longestStr(s){
        let left = 0;
        let maxStart = 0;
        let maxLength = 0;
        let myMap = new Map();
        for(let right=0;right<s.length;right++){
            let preInd = myMap.get(s[right]);
            if(preInd>=left ){
                left = preInd + 1;
            }
            myMap.set(s[right],right);
            if(right - left + 1 > maxLength){
                maxLength = right - left + 1;
                maxStart = left;
            }
        }
        return s.slice(maxStart,maxStart+maxLength);
    }
```

### 动态规划

**爬楼梯**

```js
function climbStairs(n){
	if(n==1){
    	return 1;
    }
    let first  = 1;
    let second = 2;
    for(i=3;i<=n;i++){
    	let third = first + second;
        first = second;
        second = third;
    }
    return second;
}
```

**给定零钱的种类，要求组合出指定目标的最少零钱个数**

```js
function solve(coins,target){
	let ret = new Array(target+1).fill(target+1);
    ret[0] = 0;
   	for(let i=1;i<=target;i++){
    	for(let coin of coins){
        	if(i-coin>0){
            	ret[i] = Math.min(ret[i],ret[i-coin]+1);
            }
        }
    }
    return ret[target] > target ? -1 : ret[target];
}
```

### 沙盒

```html
<textarea id="code" rows="10" cols="50">console.log("Hello World!");</textarea>
<button id="run">运行</button>
<div id="output"></div>

<script>
    function createSandbox(code,outputArea){
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const sandboxGlobal = iframe.contentWindow;
        sandboxGlobal.console.log = function(...args){
            outputArea.innerText += args.join(" ");
        }
        sandboxGlobal.eval(code);

        document.body.removeChild(iframe);

    }
    document.getElementById('run').addEventListener('click',() => {
        const code = document.getElementById('code').value;
        const outputArea = document.getElementById('output');
        outputArea.innerText = "";
        createSandbox(code,outputArea);
    } );

</script>
```

### 文件流

文件流是一种数据流的抽象，允许程序处理大型文件或者数据流，不需要一次把文件加载到内存，将数据块先放入缓冲区，减少底层存储设备的直接读写次数，提高性能。

### 栈的使用

**判断括号是否有效**

```js
let isVaild = function(s){
        if(s.length===1){
            return false;
        }

        const paris = new Map([
            [')','('],
            [']','['],
            ['}','{']
        ]);
        const stk = [];
        for(let val of s){
            if(paris.has(val)){
                if(!stk.length || stk[stk.length-1] != paris.get(val)){
                    return false;
                }
                stk.pop();
            }
            else{
                stk.push(val);
            }
        }
        return !stk.length;
    }
```

### Manacher

**求最大回文子串**

```js
let longestPalindrome = function(s) {
        if(s.length===1){
            return s;
        }
        let transStr = '#' + s.split('').join('#') + '#';
        let center = 0;
        let right = 0;
        let maxCenter = 0;
        let maxR = 0;
        let r = new Array(2*s.length+1).fill(1);
        for(let i=1; i<=2*s.length; i++){
            if(i<right){
                r[i] = Math.min(r[2*center-i],right-i);
            }
            while(i-r[i]>=0 && transStr[i-r[i]]==transStr[i+r[i]]){
                r[i]++;
            }
            if(i+r[i]>right){
                center = i;
                right = i + r[i];
            }
            if(r[i]>maxR){
                maxCenter = i;
                maxR = r[i];
            }
        }
        let originCenter = Math.floor(maxCenter/2);
        let originR = Math.floor( (maxR-1) / 2 );`
        return s.slice( originCenter-originR, originCenter+originR+1 );
    };
```

