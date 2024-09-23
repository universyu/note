# Misc

### 子标签覆盖父级border

如果父级有`border-radius`，子标签设置了`height、width 100%`，那么在父级边角的`border`会被覆盖，所以需要给父级加上`overflow: hidden`



### padding

只有设置了`boxSizing: border-box`才能保证在子元素设置`width: 100%`的时候获取的是去掉`padding`之后留下的部分的`100%`