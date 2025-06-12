## 混合

对于有全透明部分的纹理，直接在 fs 中 discard 不透明度为 0 的片段

对于部分透明的混合纹理，需要开启 blend 功能并配置混合函数

```cpp
glEnable(GL_BLEND);
glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
```

但是深度测试不会带有不透明度信息，如果多个半透明做混合，就需要设置渲染顺序，先渲染远的物体

## 剔除

前置需要给三角面顶点定义顺序，然后启用面剔除并选择需要剔除的面以及定义正面代表的点顺序

```cpp
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);
    glFrontFace(GL_CCW);
```

