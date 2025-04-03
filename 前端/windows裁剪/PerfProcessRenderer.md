
## 设计方案

###  存储数据

#### crop 

存储上一次有效的 scaleX、scaleY、centerX、centerY，存储初始化时的 ratio 

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

#### 滚轮缩放

先克隆照片，尝试缩放，若操作非法，则不操作实际照片

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
可以求得缩放原则中缩放中心的 factor =  1 + originScaleX / this._image.scaleX 
设 x 为 crop 中心减去 img 中心，则 
```ts
delta /= (this._image?.scaleX ?? 1) / originScaleX
clonedImage.left -= x * delta
```

或者理解为： delta 用来累加在 zoom 上， delta 相对于 zoom 的大小就是累加前后的差距大小，差距大小应用在原始距离上即可得差距距离

##### 位置矫正

对于 x、y 轴，如果缩放时超出 crop 边界，那么分别另坐标减去 offsetX、offsetY 矫正位置，只有滚轮缩小照片时可能超出边界。

对于 x 轴，if 左边越界，需要移动照片令其左边贴合 crop 左边，在 img width 小于 crop width 时，当下滚轮操作非法，直接返回，不修改原 img 的 scale、position，否则
```ts
 offsetX =  clonedImageLeft - cropLeft   
```
else if 右边越界：如果 img 宽小于 crop 那么当下滚轮操作非法，否则
```ts
offsetX = clonedImgRight - cropRight
```

对于 y 轴，同 x 轴计算即可。

最后，把变换应用到实际照片上

```ts
this._image.scaleX = originScaleX * zoom
this._image.left -= x * delta + offSetX // 这里的 delta 已经除了 (this._image?.scaleX ?? 1) / originScaleX
```


#### 缩放 crop 

实时缓存 crop 的合法配置，并在非法时应用上一个合法配置。fabric 原生监听以一定的频率触发，如果拖拽控制点速度过快，有的中间过程无法记录，确保非法操作的最近一个合法配置是贴合 img 的，需要设置一定的错误阈度。准许在阈度内的拖拽记为合法配置，并在下一个非法操作时应用此配置。

##### 方框

对于 x 轴，if 左边超出 img ，就用上一个合法配置来更新当下的配置，让上一个配置的 width 拉至左边贴合 img 左边，即其宽度加上其 left 到 imgLeft 的距离，注意： cache 存的 left 是左边界，而 crop 设的 left 是中心
```ts
            if (cropBoundingRect.left - imgBoundingRect.left <= -errorThreshold) {

              const newWidth =

                this.cacheCropValue.left -

                imgBoundingRect.left +

                this.cacheCropValue.scaleX * originalWidth

              const newScaleX = newWidth / originalWidth

              const newLeft = imgBoundingRect.left + newWidth / 2

              cropRect.set({

                left: newLeft,

                scaleX: newScaleX,

              })

            }
```

else if 右边超出 img ，新宽度设置为 imgRight - 上一个合法配置的 left 
```ts
else if (cropRight - imgRight >= errorThreshold) {

              const newWidth = imgRight - this.cacheCropValue.left

              const newScaleX = newWidth / originalWidth

              const newLeft = this.cacheCropValue.left + newWidth / 2

              cropRect.set({

                left: newLeft,

                scaleX: newScaleX,

              })

            }
```

else 存储合法值

```ts
else {

              this.cacheCropValue.left = cropBoundingRect.left

              this.cacheCropValue.scaleX = cropRect.scaleX ?? 1

            }
```

y 轴同 x 轴的算法

##### 圆框

圆框只支持 1:1 的正圆，如果拖拽 tl 导致 l 超出边界，那么 t 要么不超边界，要么等比越界

switch e.transform.corner 考虑四个角即可，四个辅助函数分别考虑四条边越界时的 newScale 和 两个轴的 offset ，offset 都是矫正后坐标与矫正前坐标之差，下面以左边越界为例

```ts
            const cacheVaildConfig = () => {

              this.cacheCropValue.left = cropBoundingRect.left ?? 1

              this.cacheCropValue.top = cropBoundingRect.top ?? 1

              this.cacheCropValue.scaleX = cropRect.scaleX ?? 1

              this.cacheCropValue.scaleY = cropRect.scaleY ?? 1

            }

            const getNewConfigByLeft = () => {

              const newWidth =

                this.cacheCropValue.left -

                imgBoundingRect.left +

                this.cacheCropValue.scaleX * originalWidth

              const newScaleX = newWidth / originalWidth

              const newLeft = imgBoundingRect.left + newWidth / 2

              const offset = newLeft - curCenter.x

              return {

                offset,

                newScale: newScaleX,

              }

            } 

```

以 tl 为例，if l 越界 else if t 越界 else cache ，这里 t 和 l 的值同时减小，所以 offset 都用来加
```ts
              case 'tl':

              default: {

                if (cropBoundingRect.left - imgBoundingRect.left <= -errorThreshold) {

                  const { offset, newScale } = getNewConfigByLeft()

                  cropRect.set({

                    left: curCenter.x + offset,

                    top: curCenter.y + offset,

                    scaleX: newScale,

                    scaleY: newScale,

                  })

                } else if (cropBoundingRect.top - imgBoundingRect.top <= -errorThreshold) {

                  const { offset, newScale } = getNewConfigByTop()

                  cropRect.set({

                    left: curCenter.x + offset,

                    top: curCenter.y + offset,

                    scaleX: newScale,

                    scaleY: newScale,

                  })

                } else {

                  cacheVaildConfig()

                }

                break

              }
```

对于 tr ，由于 t 和 r 一个减少一个增加，故 offset 应用为异号

```ts
              case 'tr': {

                if (cropRight - imgRight >= errorThreshold) {

                  const { offset, newScale } = getNewConfigByRight()

                  cropRect.set({

                    left: curCenter.x + offset,

                    top: curCenter.y - offset,

                    scaleX: newScale,

                    scaleY: newScale,

                  })

                } else if (cropBoundingRect.top - imgBoundingRect.top <= -errorThreshold) {

                  const { offset, newScale } = getNewConfigByTop()

                  cropRect.set({

                    left: curCenter.x - offset,

                    top: curCenter.y + offset,

                    scaleX: newScale,

                    scaleY: newScale,

                  })

                } else {

                  cacheVaildConfig()

                }

                break

              }
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