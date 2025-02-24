确保斜率小于 1 ，像素沿着 x 轴运动时，x 轴每增 1 ，累计错误值就增加斜率值，直到累计错误值大于半个像素尺寸 （ 0.5 ）时，将 y 坐标增或减 1 ，具体是增还是减则由起点和终点的 y 关系决定。

```cpp
void line(int x0, int y0, int x1, int y1, TGAImage &image, TGAColor color) {
  bool steep = false;
  if (std::abs(x0 - x1) < std::abs(y0 - y1)) {
    std::swap(x0, y0);
    std::swap(x1, y1);
    steep = true;
  }

  if (x0 > x1) {
    std::swap(x0, x1);
    std::swap(y0, y1);
  }

  int dx = x1 - x0;
  int dy = y1 - y0;
  float derror = std::abs(dy / float(dx));
  float error = 0;
  int y = y0;
  for (int x = x0; x <= x1; x++) {
    if (steep) {
      image.set(y, x, color);
    } else {
      image.set(x, y, color);
    }
    error += derror;
    if (error > .5) {
      y += (y1 > y0 ? 1 : -1);
      error -= 1.;
    }
  }
}
```


