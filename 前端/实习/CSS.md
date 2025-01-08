# CSS

#### fixed

只会以整个页面为父级标签，无法用设定某个标签`position:relative`的方式修改父级。

fixed元素默认图层被后面的元素低级，如果要fixed元素显示在上层，需要设置它的z-index比其它元素大



####  absolute

`absolute`的包含块是其父级第一个非`static`的容器，或者以下情况

- transform 或 perspective 的值不是 none
- will-change 的值是 transform 或 perspective 
- contain 的值是 paint (例如: contain: paint;)

设定为`position:absolute`后设置`left`和`right`都为零就可以让它铺满整个父级，设置`absolute`之后，自己的一些属性会失效，比如写了 `position:absolute`的元素再写 `justifyContent: 'flex-end'`的话，这个`flex-end`就会失效。

设置为`absolutte`的元素如果不写`left、right、top、bottom`就会完全按照写absolute之前清空掉所有兄弟节点的位置排列

#### maxHeight

使用mui时，遇到设置尺寸失效需要设置maxHeight和maxWidth



#### flex: 1

如果子元素全都是`flex:1`但有一个默认的最小尺寸，可能会导致最后面的元素被挤出去，用`min-width: 0`的方式防止这种情况。

`flex: 1`只是内容长，`border`不会长



#### border-box与flex: 1

`border`是放在元素外层的，对于一个`flex`的`div`，如果它的所有子元素都用`flex:1`，那么它们自己的大小是均分父级元素的大小的结果，但是不包含`border`，即便它们是`box-sizing: border-box`。

解决方案是把它们的宽设置`100%`然后包裹在一个`div`里面，这个`div`设置`flex:1`，或者直接给每个子元素都加同大小的`border`



#### grid

如果`grid`设置`gridTemplateColumns: 'repeat(3, 1fr)'`那么它是确保一行三个，且三个均分大小，这里均分大小是指整个元素加上边框的大小是相同的，而子元素全`flex: 1`只能确保子元素不算边框的内部大小相同



#### hover换视频

将图片的`opacity`设置为`1`，在`hover`状态则变为`0`，而视频就放在同一个父级容器下，用`absolute`

```tsx
const BaseVideo = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  borderRadius: '8px',
  opacity: 0,
  boxSizing: 'border-box',
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1,
  },
  cursor: 'pointer',
})
```



### 包围盒

#### static、relative

如果是块级元素，包围盒是最近的块级祖先元素

如果是行内元素，包围盒是最近的行内祖先元素

#### absolute

包围盒是向上第一个非`static`的标签，如果有`transform`会以之为包围盒

#### fixed

包围盒是视窗，如果有`transform`会以之为包围盒

#### left、right....

这些元素在`static`状态会被忽略





### 设置比例

由于  `padding`  写百分比时以父组件的 `width` 为参照，故可以用来设计固定比例的容器
