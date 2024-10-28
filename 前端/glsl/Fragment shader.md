# Fragment shader

## 应用范围

通过光栅化生成`fragment`，一般是一个像素点对应一个`fragment`，对每个`fragment`调用`Fragment shader`

## 应用示例

下面的程序在`(256.5,256.5)处画一个半径128的圆`，`gl_FragCoord`是内置的变量，其中的`xy`表示当下渲染的点的坐标。`gl_FragColor`是内置的变量，表示当下渲染的颜色

```glsl
precision highp float;

#define CIRCLE_COLOR    vec4(1.0, 0.4313, 0.3411, 1.0)
#define OUTSIDE_COLOR   vec4(0.3804, 0.7647, 1.0, 1.0)

void main() {

  float dist  = distance(gl_FragCoord.xy, vec2(256.5,256.5));
  if(dist < 128.0) {
    gl_FragColor = CIRCLE_COLOR;
  } else {
    gl_FragColor = OUTSIDE_COLOR;
  }
}
```



## 关键字：discard

如果不显示设置`gl_FragColor`那么行为将是未定义的，如果不需要写入当下片段，那么需要用`discard`显式注明

### 循环瓷砖

每当单轴偏移一个`size`，它除以`size`再除以`2`就会导致一个`0.5`的偏移量，以此使相邻的瓷砖颜色不同

```glsl
bool isOddTile(vec2 point,float tileSize){
  vec2 tilePoint = step(0.5,fract( 0.5 * point / tileSize  )) 
  return vec2.x == vec2.y
}
```



```glsl
precision mediump float;

bool isOddTile(vec2 point,float tileSize){
  vec2 tilePoint = step(0.5,fract( 0.5 * point / tileSize  )) 
  return vec2.x == vec2.y
}

void main() {
  if(isOddTile(gl_FragCoord.xy,16.0)){
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }else{
  	discard;
  }
}
```

