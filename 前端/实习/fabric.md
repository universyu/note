# fabric

## 初始化

创建 `canvas` ， 保留父级的大小以及 `canvas` 的中心

```ts
  constructor(canvas: HTMLCanvasElement) {
    this._domCanvas = canvas
    const parentEl = canvas.parentElement
    let width = canvas.clientWidth
    let height = canvas.clientHeight
    if (parentEl) {
      width = parentEl.clientWidth
      height = parentEl.clientHeight
    }
    this._dimension = { width, height }
    this.canvas = new fabric.Canvas(canvas, {
      width,
      height,
      selection: false,
      backgroundColor: '#FFFFFF',
    })
    this._center = this.canvas.getVpCenter()
    // init drag info
    this.dragInfo = {
      isDragging: false,
      lastPointerX: 0,
      lastPointerY: 0,
      lastImgLeft: 0,
      lastImgTop: 0,
    }
  }
```



## 初始化图片

```ts
  public async initElement(options: { image: string; ratio: CropRatioEnum; scale: number }) {
    const { image, ratio, scale } = options
    await this.initImage(image)
    this.setupCanvasListener()
    this.initCropRect()
    this.applyCropType(ratio)
    // 允许存在初始化时缩放，但一般默认填 1
    this.applyCropScale(scale)
  }
```

这里的applyCropScale是缩放但不把照片移回中心

```ts
  public applyCropScale(scale: number) {
    this.adjustWithScale(scale, false)
  }
```



## 把图片缩放到canvas内的可见区域

```ts
  private async initImage(url: string) {
    return new Promise<void>(async (resolve) => {
      const imageElement = new Image()
      imageElement.src = url
      imageElement.crossOrigin = 'anonymous'
      const scaledWidth = this._dimension.width * VIEW_SCALE
      const scaledHeight = this._dimension.height * VIEW_SCALE
      imageElement.onload = () => {
        const { naturalWidth, naturalHeight } = imageElement
         // 这里根据canvas和图片自身的宽高比做一下限制就好了
        const { width, height, scaleX, scaleY } = getResizeScale({
          naturalWidth,
          naturalHeight,
          scaledWidth,
          scaledHeight,
        })
        this.originalScale = {
          scaleX,
          scaleY,
        }
        const image = new fabric.Image(imageElement, {
          selectable: false,
          evented: false,
          originX: 'center',
          originY: 'center',
        })

        if (this._image) { 
            // 切换是否去背景图时触发
          const { left, top } = this._image
          image.set({ left, top })
          this.canvas.remove(this._image)
        } else {
          image.set({ left: width / 2, top: height / 2, scaleX, scaleY })
        }
        this._image = image
        this.canvas.add(image)
        this.canvas.renderAll()
        resolve()
      }
    })
  }
```



## canvas监听鼠标操作缩放和平移图片

```ts
  private setupCanvasListener() {
    // 滚轮缩放，以鼠标为中心
    const handleZoom = throttle((pointer: fabric.Point, delta: number) => {
      let zoom = (this._image?.scaleX ?? 1) / this.originalScale.scaleX
      zoom += delta
      if (zoom < IMAGE_EDIT_SCALE_MIN || zoom > IMAGE_EDIT_SCALE_MAX) return

      if (this._image && pointer) {
        const x = pointer.x - (this._image.left ?? 0)
        const y = pointer.y - (this._image.top ?? 0)
        const originalScaleX = this.originalScale.scaleX
        const originalScaleY = this.originalScale.scaleY
        this._image.scaleX = originalScaleX * zoom
        this._image.scaleY = originalScaleY * zoom
        if (this._image.left) {
          this._image.left -= x * delta
        }
        if (this._image.top) {
          this._image.top -= y * delta
        }
        this._image.setCoords()
        this._onScaleChange?.(zoom)
        this.canvas.renderAll()
      }
    }, 16) // 约60fps的频率

    const wheelChange = (opt: fabric.IEvent<WheelEvent>) => {
      opt.e.preventDefault()
      const { pointer } = opt
      if (!pointer) return
      const delta = opt.e.deltaY > 0 ? -IMAGE_EDIT_SCALE_STEP : IMAGE_EDIT_SCALE_STEP
      handleZoom(pointer, delta)
    }

    const mouseDown = (opt: fabric.IEvent<MouseEvent>) => {
      if (this.canvas && this._image) {
        const { pointer } = opt
        if (!pointer) return
        const activeObject = this.canvas.getActiveObject()
        // @ts-ignore
        if (activeObject && activeObject.__corner) {
            // 在伸缩裁剪框的时候不要移动照片
          this.dragInfo.isDragging = false
        } else {
          this.dragInfo.isDragging = true
          this.dragInfo.lastPointerX = pointer.x
          this.dragInfo.lastPointerY = pointer.y
          this.dragInfo.lastImgLeft = this._image.left ?? 0
          this.dragInfo.lastImgTop = this._image.top ?? 0
        }
      }
    }

    const mouseMove = (opt: fabric.IEvent<MouseEvent>) => {
      if (this._image && this.canvas && this.dragInfo.isDragging) {
        const { pointer } = opt
        if (!pointer) return
        const deltaX = pointer.x - this.dragInfo.lastPointerX
        const deltaY = pointer.y - this.dragInfo.lastPointerY
        this._image.left = deltaX + (this.dragInfo.lastImgLeft ?? 0)
        this._image.top = deltaY + (this.dragInfo.lastImgTop ?? 0)
        this._image.setCoords()
        this.canvas.requestRenderAll()
      }
    }

    const mouseUp = () => {
      this.dragInfo.isDragging = false
    }

    this.canvas.on('mouse:down', mouseDown)
    this.canvas.on('mouse:move', mouseMove)
    this.canvas.on('mouse:up', mouseUp)
    this.canvas.on('mouse:wheel', wheelChange)
  }
```



## 初始化裁剪区域

```ts
  private initCropRect() {
    const { width, height } = this._image?.getBoundingRect(true, true) ?? { width: 0, height: 0 }
    const canvasWidth = this.canvas.getWidth() || 0
    const canvasHeight = this.canvas.getHeight() || 0
    const center = this._center

    // 创建遮罩层，即黑色背景
    this._overlay = new fabric.Rect({
      width: canvasWidth,
      height: canvasHeight,
      left: center.x,
      top: center.y,
      originX: 'center',
      originY: 'center',
      fill: 'rgba(0, 0, 0, 0.64)',
      selectable: false,
      evented: true,
      excludeFromExport: true,
    })

    // 创建裁剪框，即边框，中心填充透明
    this._cropRect = new fabric.Rect({
      width: width,
      height: height,
      left: width / 2,
      top: height / 2,
      originX: 'center',
      originY: 'center',
      fill: 'transparent',
      stroke: '#c9c9c9',
      selectable: false,
      evented: true,
      lockMovementX: true,
      lockMovementY: true,
      centeredScaling: true,
      excludeFromExport: true,
    })

    // 与 cropRect 对应的裁切区域，即边框内部白色区域
    const clipPath = new fabric.Rect({
      width: width,
      height: height,
      left: width / 2,
      top: height / 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      inverted: true,
      strokeWidth: 0,
    })

    this._overlay.clipPath = clipPath
    this.setupCropListener()
    this.canvas.add(this._overlay)
    this.canvas.add(this._cropRect)
    this.canvas.renderAll()
  }
```



做监听

```ts
  private setupCropListener() {
      // 伸缩裁剪框的时候更新中间透明路径
    this._cropRect?.on('scaling', (e: any) => {
      this.updateClipPath()
    })
      // 持续选中裁剪框
    this._cropRect?.on('deselected', (e: any) => {
      this.canvas.setActiveObject(this._cropRect!)
    })
  }
```



## 更换裁剪框类型

```ts
  public applyCropType(cropRatio: CropRatioEnum) {
    this.resetScale()
    this.cropRatio = cropRatio
    this.canvas.setActiveObject(this._cropRect!)
    const maxWidth = this.canvas.getWidth() * VIEW_SCALE
    const maxHeight = this.canvas.getHeight() * VIEW_SCALE
    const { width, height } = this._image?.getBoundingRect(true, true) ?? { width: 0, height: 0 }
    const optionsRect: IRectOptions = {}
    let optionsCircle = {} as { radius: number; left: number; top: number }
    let controlsOptions = {}
    switch (cropRatio) {
      case CropRatioEnum.RatioFree: {
        optionsRect.width = width
        optionsRect.height = height
        optionsRect.left = this._center.x
        optionsRect.top = this._center.y
        optionsRect.selectable = true
        optionsRect.scaleX = NORMAL_SCALE
        optionsRect.scaleY = NORMAL_SCALE
        optionsRect.hasBorders = false

        controlsOptions = {
          mtr: false,
          bl: true,
          br: true,
          tl: true,
          tr: true,
          mb: true,
          mr: true,
          ml: true,
          mt: true,
        }
        this.setupRectClipPath({ width, height })
        break
      }
      case CropRatioEnum.RatioCircle: {
        const minSide = Math.min(width, height)
        optionsCircle = {
          radius: minSide / 2,
          left: this._center.x,
          top: this._center.y,
        }
        optionsRect.width = minSide
        optionsRect.height = minSide
        optionsRect.left = this._center.x
        optionsRect.top = this._center.y
        optionsRect.selectable = true
        optionsRect.scaleX = NORMAL_SCALE
        optionsRect.scaleY = NORMAL_SCALE
        optionsRect.hasBorders = false
        controlsOptions = {
          mtr: false,
          bl: true,
          br: true,
          tl: true,
          tr: true,
          mb: true,
          mr: true,
          ml: true,
          mt: true,
        }
        this.setupCircleClipPath(optionsCircle)
        break
      }
      default: {
        const ratio = cropRatio.split('/')
        const aspectRatio = ratio.map((item) => parseInt(item)).reduce((acc, cur) => acc / cur)
        // 页面 canvas 为长方形 在一定比例下可能 Crop 框会超出范围
        // 由于 height 比较低 所以优先尝试 height
        let height = maxHeight
        let width = height * aspectRatio

        if (width > maxWidth) {
          width = maxWidth
          height = width / aspectRatio
        }

        optionsRect.width = width
        optionsRect.height = height
        optionsRect.left = this._center.x
        optionsRect.top = this._center.y
        optionsRect.selectable = false
        optionsRect.scaleX = NORMAL_SCALE
        optionsRect.scaleY = NORMAL_SCALE
        optionsRect.hasBorders = false

        controlsOptions = {
          bl: false,
          br: false,
          tl: false,
          tr: false,
          mb: false,
          mr: false,
          ml: false,
          mt: false,
          mtr: false,
        }
      }
    }
    this._cropRect?.set(optionsRect) // 框本身信息
    this._cropRect?.setControlsVisibility(controlsOptions) // 可操作点信息
    this.updateClipPath()
  }
```



## 更新缩放

```ts
  public adjustWithScale = (scale: number, withCenter = true) => {
    if (withCenter) {
        // 会把图片移回中心，消除鼠标平移的影响
      this._image?.setPositionByOrigin(this._center, 'center', 'center')
    }
    const originalScaleX = this.originalScale.scaleX
    const originalScaleY = this.originalScale.scaleY
    this._image?.set({ scaleX: originalScaleX * scale, scaleY: originalScaleY * scale })
    this.canvas.renderAll()
  }
```



## 建立矩形或圆形透明区域

```ts
  private setupCircleClipPath(options: { radius: number; left: number; top: number }) {
    const { radius, left, top } = options
    const clipPathCircle = new fabric.Circle({
      radius: radius - PADDING,
      left: left + PADDING,
      top: top + PADDING,
      fill: 'transparent',
      originX: 'center',
      originY: 'center',
      selectable: false,
      inverted: true,
      strokeWidth: 0,
    })
    if (this._overlay) {
      this._overlay.clipPath = clipPathCircle
    }
  }

  private setupRectClipPath(options: { width: number; height: number }) {
    const { width, height } = options
    const clipPathRect = new fabric.Rect({
      width,
      height,
      left: width / 2,
      top: height / 2,
      originX: 'center',
      originY: 'center',
      fill: 'transparent',
      stroke: '#c9c9c9',
      selectable: false,
      evented: true,
      lockMovementX: true,
      lockMovementY: true,
      centeredScaling: true,
      excludeFromExport: true,
      inverted: true,
      strokeWidth: 0,
    })
    if (this._overlay) {
      this._overlay.clipPath = clipPathRect
    }
  }
```





## 导出大小问题

防止裁剪边框导致导出大小不对

```ts
          cloneObj.clipPath = new fabric.Ellipse({
            rx: cropWidth / 2 - PADDING,
            ry: cropHeight / 2 - PADDING,
            left: cropLeft + PADDING,
            top: cropTop + PADDING,
            absolutePositioned: true,
            strokeWidth: 0,
          })
```

