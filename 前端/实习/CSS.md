# CSS

#### fixed

只会以整个页面为父级标签，无法用设定某个标签`position:relative`的方式修改父级。

fixed元素默认图层被后面的元素低级，如果要fixed元素显示在上层，需要设置它的z-index比其它元素大



####  absolute

设定为`position:absolute`后设置`left`和`right`都为零就可以让它铺满整个父级，设置`absolute`之后一些属性会失效，比如`justifyContent: 'flex-end'`



#### maxHeight

使用mui时，遇到设置尺寸失效需要设置maxHeight和maxWidth