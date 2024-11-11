# Geometry

## 坐标变换

从顶点坐标变成齐次坐标然后乘以模型矩阵获得世界坐标，乘以视角矩阵切换到相机坐标，乘以投影矩阵把`3D`空间投影到`2D`空间

```glsl
precision highp float;

attribute vec3 position;

uniform mat4 model, view, projection;

void main() {
  gl_Position = projection * view * model * vec4(position, 1);
}
```

## 平移操作

位置为`p`，将齐次位置（  vec4( p , 1 )  ）前乘以一个

```glsl
mat4(1, 0, 0, 0,
     0, 1, 0, 0, 
     0, 0, 1, 0,
     -p.x, -p.y, -p.z, 1)
```

即可将其移动到原点。

这里的 mat4 每一行是一个 vec4 ， 而 vec4 是列向量



