
## Promise.resolve

如果输入是 promise 就返回，是 thenable 对象就构造一个真正的 promise 并放回，如果是一个普通值就返回一个已经 resolve 的 promise