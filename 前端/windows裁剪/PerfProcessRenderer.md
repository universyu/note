
## 最终效果

裁剪框永远被底片包含，底片位置可以移动，也可以滚轮缩放。裁剪框宽高比可以修改，修改后需要做居中并缩放，让裁剪框永远在 canvas 正中间，且其大小合适。

## 设计方案

###  存储数据

#### crop 

cacheCropValue 存储上一次的 width、height、centerX、centerY，originalRatio 存储初始化时的 ratio，fabric 的 Rect 自动存储最开始设置的 width 和 height 

#### frontImg

存储 url ，存储初始化时的 scaleX、scaleY，存储当下 scaleX、scaleY、centerX、centerY，第二张照片不影响到第一张，所以第一张照片修改配置时一定是处于 canvas 中的，可以直接读取其原始宽高，不需要存储

#### backImg

存储 url ，存储初始化时的 scaleX、scaleY，存储当下 scaleX、scaleY、centerX、centerY，存储照片原生 width、height


### 缩放原则

#### 长边的定义

对象 A 相对于对象 B 的长边由两者 ratio 决定，若 ratioA > ratioB , 那么 A 的长边为宽。
假设  A 的宽设置为 B 的宽，那么 W / ratioA < W / ratioB ，可以确保 A 被 B 包含

#### 缩放中心

fabric 照片缩放中心默认为自己的中心，希望照片缩放后 crop 中心点仍然对应同一个点。假设照片的缩放系数乘以了 factor，crop 中心坐标减去 img 中心坐标得到 d ，那么缩放前距离 img d 的点缩放后距离 img fd ，偏差量 ( f-1 ) d ，img 的坐标减去这个偏差量即可


### 初始化 

#### 默认配置

fabric canvas 坐标系以左上角为原点，x 轴以右为正向，y 轴以下为正向

#### 初始化原则

第一张照片按照缩放原则占满 canvas ，crop 贴合第一张照片，第二张照片按照缩放原则占满 crop


### 单张照片实现 windows 图片编辑器裁剪效果

#### 照片拖拽

##### 基本拖拽

mouse down 时存储鼠标位置，mouse move 时计算鼠标 x、y 轴的 offset 并应用在照片上

##### 位置矫正

fabric 有些操作无法 prevent，这里为了统一逻辑，采取先拖拽后矫正的方法确保裁剪框被照片包含

首先矫正 x 轴，要么左超边界，要么右超边界，只需要设置超边界的边贴合裁剪框对应边

```ts
        if (newLeft >= cropBoundingRect.left) {
          this._image.left = cropBoundingRect.left + imgBoundingRect.width / 2
        } else if (newRight <= cropBoundingRect.left + cropBoundingRect.width) {
          this._image.left =
            cropBoundingRect.left + cropBoundingRect.width - imgBoundingRect.width / 2
        } else {
          this._image.left = deltaX + (this.dragInfo.lastImgLeft ?? 0)
        }
```

同理矫正 y 轴

#### 滚轮缩放（handleZoom）

先克隆照片，尝试缩放，若操作非法，则不操作实际照片。
最后的效果是照片永远等比缩放，裁剪框永远在照片内，照片缩小时会自动偏移到一条边占满裁剪框对应边时停止。

##### 以 crop 中心为中心缩放照片

由于 fabric y 轴与浏览器反向，当滚轮事件的 deltaY 大于零时，delta = -scaleStep，反之为 scaleStep，计算当下照片的 scale 与起始 scale 的商记作 zoom，并加上滚轮 delta： 
```ts
let zoom = this._image.scaleX / originScaleX 
zoom += delta
```
根据 zoom 求出新的 scaleX 
```ts
clonedImage.scaleX = originScaleX * zoom
```
可以求得缩放原则中缩放中心的 factor =  1 + delta / zoom
设 x 为 crop 中心减去 img 中心，则 
```ts
let deltaDiff = delta / zoom
clonedImage.left -= x * deltaDiff
```

或者理解为： delta 用来累加在 zoom 上， delta 相对于 zoom 的大小就是累加前后的差距大小，所以 deltaDiff = ( zoom + delta - zoom ) / zoom

##### 以crop中心为中心二次缩放

经过第一次缩放照片可能宽度或者高度不够，第二次缩放让宽高不小于 crop 尺寸，而且必须是等比缩放不改变照片 ratio

```ts
        if (delta < 0) {
          if (
            clonedBoundingRect.width - cropBoundingRect.width < 0 &&
            clonedBoundingRect.height - cropBoundingRect.height < 0
          ) {
            // 两边都超出就让相对长边拉满，让两边都不超出
            scaleFactor = isImgWider
              ? cropBoundingRect.height / clonedBoundingRect.height
              : cropBoundingRect.width / clonedBoundingRect.width
          } else if (
            clonedBoundingRect.width - cropBoundingRect.width < 0 &&
            clonedBoundingRect.height - cropBoundingRect.height >= 0
          ) {
            scaleFactor = cropBoundingRect.width / clonedBoundingRect.width
          } else if (
            clonedBoundingRect.width - cropBoundingRect.width >= 0 &&
            clonedBoundingRect.height - cropBoundingRect.height < 0
          ) {
            scaleFactor = cropBoundingRect.height / clonedBoundingRect.height
          }
          // 中心二次缩放
          clonedBoundingRect.left -=
            (cropBoundingRect.centerX - clonedBoundingRect.left) * (scaleFactor - 1)
          clonedBoundingRect.top -=
            (cropBoundingRect.centerY - clonedBoundingRect.top) * (scaleFactor - 1)
          clonedBoundingRect.width *= scaleFactor
          clonedBoundingRect.height *= scaleFactor
          zoom *= scaleFactor
          deltaDiff = deltaDiff * scaleFactor + scaleFactor - 1
```

这最终的 deltaDiff 计算是 zoom -> zoom + delta -> ( zoom + delta ) * scaleFactor 
deltaDiff = ( ( zoom + delta ) * scaleFactor  - zoom ) / zoom  
##### 位置矫正

哪边超出就让那边贴边界
```ts
          if (clonedBoundingRect.left - cropLeft > 0) {
            offSetX = clonedBoundingRect.left - cropLeft
          } else if (
            clonedBoundingRect.left + clonedBoundingRect.width <
            cropLeft + cropBoundingRect.width
          ) {
            offSetX =
              clonedBoundingRect.left + clonedBoundingRect.width - cropLeft - cropBoundingRect.width
          }
          if (clonedBoundingRect.top - cropTop > 0) {
            offSetY = clonedBoundingRect.top - cropTop
          } else if (
            clonedBoundingRect.top + clonedBoundingRect.height <
            cropTop + cropBoundingRect.height
          ) {
            offSetY =
              clonedBoundingRect.top + clonedBoundingRect.height - cropTop - cropBoundingRect.height
          }
```

##### 整合

应用缩放，并位移确保是以 canvas 中心为缩放中心，然后再应用 offset 防止超边界
```ts
        this._image.scaleX = originScaleX * zoom
        this._image.scaleY = originScaleY * zoom
        const xDiff = x * deltaDiff
        const yDiff = y * deltaDiff
        if (this._image.left) {
          this._image.left -= offSetX + xDiff
        }
        if (this._image.top) {
          this._image.top -= offSetY + yDiff
        }
        this._image.setCoords()
```

#### 拖拽缩放裁剪框（cropScaling）

##### 自由方框

确保 crop 的大小不能超出 img ， 水平方向如果左边超出就从 crop 右边到 img 左边的距离和 img 的宽度中选一个小的当做 crop 新宽度，如果左边没错右边错那么新宽度比如是 crop 左边到 img 右边。竖直方向同理。

```ts
            if (cropLeft - imgBoundingRect.left < 0) {
              const newWidth = Math.min(cropRight - imgBoundingRect.left, imgBoundingRect.width)
              const newScaleX = newWidth / originalWidth
              const newCenterX = imgBoundingRect.left + newWidth / 2
              cropRect.set({
                left: newCenterX,
                scaleX: newScaleX,
              })
            } else if (cropRight - imgRight > 0) {
              const newWidth = imgRight - cropLeft
              const newScaleX = newWidth / originalWidth
              const newCenterX = cropLeft + newWidth / 2
              cropRect.set({
                left: newCenterX,
                scaleX: newScaleX,
              })
            }
            if (cropTop - imgBoundingRect.top <= 0) {
              const newHeight = Math.min(cropBottom - imgBoundingRect.top, imgBoundingRect.height)
              const newScaleY = newHeight / originalHeight
              const newCenterY = imgBoundingRect.top + newHeight / 2
              cropRect.set({
                top: newCenterY,
                scaleY: newScaleY,
              })
            } else if (cropBottom - imgBottom > 0) {
              const newHeight = imgBottom - cropTop
              const newScaleY = newHeight / originalHeight
              const newCenterY = cropTop + newHeight / 2
              cropRect.set({
                top: newCenterY,
                scaleY: newScaleY,
              })
            }
```

##### 等比缩放框

###### stroke width 

fabric 的对象 width 是起始内容尺寸，不包含 strokeWidth，但是 boundingbox 是包含 strokeWidth 的，stroke width 是盒子内一半盒子外一半。

```ts
	
```
#### crop and img 居中

##### crop 居中

直接把中心点拉到 canvas 中心就可以了

```ts
      const offsetX = cropRect.left! - canvasCenterX
      const offsetY = cropRect.top! - canvasCenterY
      cropRect.set({
        left: canvasCenterX,
        top: canvasCenterY,
      })
```

##### img 居中

和 crop 保持相对静止

```ts
        this._image.set({
          left: this._image.left! - offsetX,
          top: this._image.top! - offsetY,
        })
```

##### back_img 居中

背面照片只在 crop 非等比缩放时被影响，首先它应用和 crop 一样的位移，如果 crop 左边拉到了照片外面，就尝试把照片左移，如果照片宽度不够就缩放照片宽度至和 crop 等宽并让两者中心对齐


#### crop 和 img 缩放

为了让 crop 尽量占满屏幕并在不同的宽高比下尺寸有所差异，以 cropRatio 和 canvasRatio 的相对大小为分支条件，让 crop 的相对长边和 canvas 对应边等长然后再乘以一定系数制造差异。

##### 系数计算

以 crop 原始 ratio 和 canvasRatio 的相对大小为分支条件， crop 初始化时就已经让相对长边占满了 canvas 的对应边。 假设起始相对长边是宽，当下相对长边还是宽，那么 canvasRatio 到 originalRatio 之间让系数从 0.9 到 1.0。起始宽长现在高长，那么会求高相对于 canvas 高的系数，这时假设 originalRatio 对于 canvasRatio 的对称点为比例为 1 的点，还需要考虑程序健壮性：
```ts
      const distance = cropOriRatio - canvasRatio
      const endPoint = Math.max(0.1, canvasRatio - distance)
```
起始相对长边是高时，数据取倒数就可以了