# uniform

## 简介

全局变量，所有片段都可以调用



## 纹理加载示例

纹理坐标系坐标范围是`0`到`1`

```glsl
precision highp float;

uniform sampler2D texture;
uniform vec2 screenSize;

void main() {
  vec2 coord = gl_FragCoord.xy / screenSize;
  vec4 texColor = texture2D(texture, coord);
  //Swap red and blue color channels of image
  gl_FragColor = vec4(texColor.b, texColor.g, texColor.r, texColor.a);
}
```

