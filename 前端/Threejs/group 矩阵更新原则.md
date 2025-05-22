
## auto update

### matrixAutoUpdate

当手动设置了 rotation 、 scale 、 position 、 quaternion 之后会把 matrixNeedsUpdate 设置为 true，在下一次 render 之前会检查这个标志位，并更新 matrix

### matrixWorldAutoUpdate

当父级的 matrixWorld 更新后，会把 matrixWorldNeedsUpdate 设置为 true，在下一次 render 之前检查这个标志位，并更新 mareixWorld

## renderer.render

render 的时候会调用 scene 的 updateMatrixWorld，强制把所以父级的 matrixWorld 递归向下应用

