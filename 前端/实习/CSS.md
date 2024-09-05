# CSS

#### fixed

只会以整个页面为父级标签，无法用设定某个标签`position:relative`的方式修改父级。

fixed元素默认图层被后面的元素低级，如果要fixed元素显示在上层，需要设置它的z-index比其它元素大



####  absolute

设定为`position:absolute`后设置`left`和`right`都为零就可以让它铺满整个父级，设置`absolute`之后，自己的一些属性会失效，比如写了 `position:absolute`的元素再写 `justifyContent: 'flex-end'`的话，这个`flex-end`就会失效。

设置为`absolutte`的元素如果不写`left、right、top、bottom`就会完全按照写absolute之前清空掉所有兄弟节点的位置排列，而`left、right、top、bottom`是以最近的一个`position:relative`为父级

#### maxHeight

使用mui时，遇到设置尺寸失效需要设置maxHeight和maxWidth