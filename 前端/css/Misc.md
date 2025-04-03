
## 子标签覆盖父级border

如果父级有`border-radius`，子标签设置了`height、width 100%`，那么在父级边角的`border`会被覆盖，所以需要给父级加上`overflow: hidden`



## padding

只有设置了`boxSizing: border-box`才能保证在子元素设置`width: 100%`的时候获取的是去掉`padding`之后留下的部分的`100%`

## flex: 1 

只在 `display:flex` 父组件的主轴上填充， `img` 行为特殊，一般用一个包容器来做 `flex:1` ， 然后 `img` 设置 `absolute` 并填满容器（ `width:100%,height:100%,top:0,left:0` ）


## display none

设置 `display:none` 会直接导致 dom 计算有问题，如果涉及 canvas 做渲染的话，会因为尺寸问题导致渲染出错，替代方案是 `visibility:hidden`

## border 三角

border实际上是梯形，可以压缩盒子内容为 0 宽高把梯形挤压成三角形，下面代码实现朝左的三角形，左边没有 border 导致上下都被压缩成直角三角形，而右边是个锐角三角形

```css
 
        width: 0,
        height: 0,
        borderWidth: '12px 14px 12px 0px',
        borderColor: 'transparent #333 transparent transparent',
        borderStyle: 'solid',
```

## 伪元素

不存在 dom 中，用于修饰，必须有 content 才显示，下面的代码在边框坐标加三角

```css
  '&::before': selected
    ? {
        content: '""',
        width: 0,
        height: 0,
        borderWidth: '12px 14px 12px 0px',
        borderColor: 'transparent #333 transparent transparent',
        borderStyle: 'solid',
        position: 'absolute',
        top: '50%',
        left: '-14px',
        transform: 'translateY(-50%)',
      }
```


## img内联问题

img 默认是内联元素，会在下面留下 4px 的空余空间，也就是 img 的父级标签的高度会比实际大 4px，除非让 display 为 block