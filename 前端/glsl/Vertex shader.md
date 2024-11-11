# Vertex shader

运行在片段着色器之前，控制图元顶点在屏幕上的位置。

每个顶点都有独特的`attribute`值，只读，描述顶点的信息

顶点着色器向片段着色器传递值可用`varying`，仅限`float、vec2、vec3、vec4`

## 旋转theta角

根据三角坐标以及合角公式可得，旋转后的坐标

(Tips：第三个坐标是深度，用于做深度计算，第四个坐标用于透视除法，最后的坐标将是各个值除以 w 的结果)

```glsl
precision highp float;

uniform float theta;

attribute vec2 position;

void main() {
  vec2 rotatedPosition = vec2(position.x * cos(theta) - position.y * sin(theta), position.x * sin(theta) + position.y * cos(theta));
  gl_Position = vec4(rotatedPosition, 0, 1.0);
}

```



