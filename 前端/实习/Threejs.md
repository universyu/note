# Threejs

### 构造ThreeJsRenderer

构造场景

```ts
type Props = {
  canvas: HTMLCanvasElement
    ...
}

class ThreeJsRenderer {
    private canvas: HTMLCanvasElement
    ...
    constructor({canvas, ...} : Props){
    	this.canvas = canvas
    	const { width, height } = this.canvas.getBoundingClientRect()
        //后面两个参数分别表示：允许背景透明、开启抗锯齿
    	this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true })
    	//关闭对canva标签的宽高影响，否则UI将改不到canvas的宽高
    	this.renderer.setSize(width, height, false) 
		//使用现代化光源
	    this.renderer.useLegacyLights = false 
    	this.scene = new THREE.Scene()
    	this.scene.background = new THREE.Color(0xebebeb)
        
    }
}
```

构造相机

```ts
//相机可视角大小为75度，宽高比和canvas的一致，可渲染的距离：最近0.5 最远1000
this.camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 1000) 
this.camera.position.set(...)
//如果设置为0,0,1 那么按着右键向上移动的时候相机会向着z轴正方向移动                         
this.camera.up.set(...)
this.controls = new OrbitControls(this.camera, this.canvas)
//如果const DefaultCameraLookAt = new THREE.Vector3(0, 0, 0)那么场景旋转中心点为原点
this.controls.target = DefaultCameraLookAt
this.controls.update()
```

构造grid

```ts
    //大小是XZ轴256*256
	const X1Grid = new THREE.GridHelper(256, 32, 0x666666, 0x666666)
    X1Grid.position.set(0, 0, 0)
	//翻到XY平面
    X1Grid.rotation.set(-Math.PI / 2, 0, 0)
    this.scene.add(X1Grid)
```

构造灯光

```ts
    const ambientLight = new THREE.AmbientLight(0x888888)
    this.scene.add(ambientLight)
    const hemisphereLight = new THREE.HemisphereLight(0x8d7c7c, 0x494966)
    this.scene.add(hemisphereLight)
    const pointLight1 = new THREE.PointLight(0xffffff, 2, 0, 0)
    pointLight1.position.set(50, -25, 5)
    this.scene.add(pointLight1)
    const pointLight2 = new THREE.PointLight(0xffffff, 2, 0, 0)
    pointLight2.position.set(-50, -25, 5)
    this.scene.add(pointLight2)
```

构造后期处理

```ts
  private fxaaPass: ShaderPass
  
  private setupPostEffect(width: number, height: number) {
    this.composer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    )
    this.outlinePass.edgeStrength = 7
    this.outlinePass.edgeGlow = 0.6
    this.outlinePass.edgeThickness = 2.0
    this.outlinePass.pulsePeriod = 1.5
    this.outlinePass.visibleEdgeColor.set('#ffffff')
    this.outlinePass.hiddenEdgeColor.set('#ffffff')
    this.composer.addPass(this.outlinePass)
    const outputPass = new OutputPass()
    this.composer.addPass(outputPass)
    this.fxaaPass = new ShaderPass(FXAAShader)
    const pixelRatio = this.renderer.getPixelRatio()
    this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio)
    this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio)
    this.composer.addPass(this.fxaaPass)
  }
```

构造render函数

```ts
  private render() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    this.composer.render()
  }
```

使用render函数

```ts
this.renderer.setAnimationLoop(this.render.bind(this))
```



### 使用ThreeJsRenderer

用ref取定一个canvas就可以了

```tsx
    <canvas	ref={canvasRef}/>
```



```tsx
const renderer = new ThreeJsRenderer(canvas: canvasRef.current)
```



### 模型实际底部

利用`Box`计算时会有很大的偏差，遍历每一个顶点可以找到实际坐标最小值，下面的程序用来找到`THREE.Object3D `的最小z

```tsx

  public findMinZ(minZ = Infinity) {
    this.object!.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const positionAttribute = child.geometry.getAttribute('position')
        for (let i = 0; i < positionAttribute.count; i++) {
          const vertex = new THREE.Vector3()
          vertex.fromBufferAttribute(positionAttribute, i)
          vertex.applyMatrix4(child.matrixWorld)
          minZ = Math.min(minZ, vertex.z)
        }
      }
      if (child.children.length) {
        minZ = this.findMinZ(minZ)
      }
    })
    return minZ
  }
```



### 凸包优化

直接计算所有顶点太费时，在第一次渲染模型的时候做出凸包，后续更新模型时，同步更新凸包，遍历凸包的顶点拿到实际坐标最小值，凸包的顶点数远远小于模型的顶点数

**构造凸包（以THREE.Group为例）**

```tsx
export function createConvexHull(object: THREE.Object3D | THREE.Mesh): THREE.Mesh {
  const vertices: THREE.Vector3[] = []

  function collectVerticesFromGeometry(geometry: THREE.BufferGeometry) {
    const positionAttribute = geometry.attributes.position
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3()
      vertex.fromBufferAttribute(positionAttribute, i)
      vertices.push(vertex)
    }
  }

  if (object instanceof THREE.Mesh && object.geometry) {
    collectVerticesFromGeometry(object.geometry)
  } else {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        collectVerticesFromGeometry(child.geometry)
      }
    })
  }

  const geometry = new ConvexGeometry(vertices)
  return new THREE.Mesh(geometry)
}
```

**根据凸包找到最小坐标**

```tsx
export function findMinZPoint(mesh: THREE.Mesh): THREE.Vector3 {
  let minZ = Infinity
  const minZPoint = new THREE.Vector3()

  const positionAttribute = mesh.geometry.attributes.position
  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3()
    vertex.fromBufferAttribute(positionAttribute, i)
    vertex.applyMatrix4(mesh.matrix)

    if (vertex.z < minZ) {
      minZ = vertex.z
      minZPoint.copy(vertex)
    }
  }
  return minZPoint
}
```



### 凸包算法

无论是顶点还是凸包都无法完全表示上表面，为了找到准确的上表面范围，需要利用上表面的顶点构造出凸包

```ts
export function makeBaseConvexHull(mesh: THREE.Mesh, surfaceZ: number): THREE.Vector3[] {
  const positionAttribute = mesh.geometry.attributes.position
  const vertices: THREE.Vector3[] = []
  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3()
    vertex.fromBufferAttribute(positionAttribute, i)
    vertex.applyMatrix4(mesh.matrix)
    vertices.push(vertex)
  }
  const upperSurfaceVertices = vertices.filter((vertex) => Math.trunc(surfaceZ) < vertex.z)

  upperSurfaceVertices.sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x
    return a.y - b.y
  })

  // Andrew's algorithm implementation
  const lowerHull: THREE.Vector3[] = []
  const upperHull: THREE.Vector3[] = []

  function isLeftTurn(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): boolean {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0
  }

  for (const vertex of upperSurfaceVertices) {
    while (
      lowerHull.length >= 2 &&
      !isLeftTurn(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], vertex)
    ) {
      lowerHull.pop()
    }
    lowerHull.push(vertex)
  }

  // Build upper hull
  for (let i = upperSurfaceVertices.length - 1; i >= 0; i--) {
    const vertex = upperSurfaceVertices[i]
    while (
      upperHull.length >= 2 &&
      !isLeftTurn(upperHull[upperHull.length - 2], upperHull[upperHull.length - 1], vertex)
    ) {
      upperHull.pop()
    }
    upperHull.push(vertex)
  }

  // Combine lower and upper hulls
  const convexHull = [...lowerHull, ...upperHull.slice(1, -1)]

  return convexHull
}
```



### 更新canvas大小

`ThreeJsRenderer.ts`

```ts
  public onCanvasResize() {
    const { width, height } = this.canvas.getBoundingClientRect()
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.composer.setSize(width, height)
    this.fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
  }
```

在contructor里面对canvas监听大小变化，这里的entries里面只有canvas这一个html标签

```ts
    this.debouncedResize = debounce((size: { width: number; height: number }) => {
      this.onCanvasResize(size)
    }, 50)
    // Add ResizeObserver
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        this.debouncedResize({ width, height })
      }
    })

    // Start observing the canvas
    this.resizeObserver.observe(this.canvas)
```



### Move逻辑

输入数字直接控制模型的位置，z轴则是控制z偏移量，然后每次控制模型都加上这个偏移量

```ts
  public moveModel(params: { x?: number; y?: number; z?: number }) {
    const { x, y, z } = params
    if (this.object) {
      if (x !== undefined) this.object.position.x = x
      if (y !== undefined) this.object.position.y = y
      if (z !== undefined) this.offsetZ = z

      this.object.updateMatrixWorld()
      this.convexHull.matrix = this.object.matrix.clone()
      if (this.baseModel) {
        this.object.position.z += this.baseTop - findMinZ(this.convexHull) - this.offsetZ
        this.object.updateMatrixWorld()
        this.convexHull.matrix = this.object.matrix.clone()
        this.positionLimits = findRangeBounds(
          this.convexHull,
          this.baseConvexHull,
          this.baseTop,
          this.object.position.x,
          this.object.position.y
        )
        this.store.setPositionLimits(this.positionLimits)
      } else {
        this.object.position.z -= findMinZ(this.convexHull)
        this.object.updateMatrixWorld()
        this.convexHull.matrix = this.object.matrix.clone()
      }
    }
    this.updateOverallGroup(true, true)
  }
```



### Rotate逻辑

输入的数字转换成弧度制并加到原始rotation上

```ts
  public rotateModel(params: { x?: number; y?: number; z?: number }) {
    const { x, y, z } = params
    if (this.object) {
      if (x !== undefined) this.object.rotation.x = x * (Math.PI / 180) + this.originRotation[0]
      if (y !== undefined) this.object.rotation.z = y * (Math.PI / 180) + this.originRotation[2]
      if (z !== undefined) this.object.rotation.y = z * (Math.PI / 180) + this.originRotation[1]

      this.object.updateMatrixWorld()
      this.convexHull.matrix = this.object.matrix.clone()
      if (this.baseModel) {
        this.object.position.z += this.baseTop - findMinZ(this.convexHull) - this.offsetZ
        this.object.updateMatrixWorld()
        this.convexHull.matrix = this.object.matrix.clone()
        this.attachModelToBase()
      } else {
        this.object.position.z -= findMinZ(this.convexHull)
        this.object.updateMatrixWorld()
        this.convexHull.matrix = this.object.matrix.clone()
      }
    }
    this.updateOverallGroup(true, true)
  }
```



### group

利用group可以包裹模型和底座，一起做scale操作。

```ts
//constructor里面setup
  private overallGroup: THREE.Group = new THREE.Group()
  private setupOverallGroup() {
    this.scene.add(this.overallGroup)
    this.overallGroup.matrixAutoUpdate = false
    this.overallGroup.updateMatrix()
  }
```

加载完模型或者底座之后，在group里面add对应的模型，然后更新

```ts
  private updateOverallGroup(edit?: boolean, modelTransform?: boolean) {
    this.overallGroup.updateMatrix()
    this.overallBox.setFromObject(this.overallGroup)
    const newSize = new THREE.Vector3()
    this.overallBox.getSize(newSize)
     //外界调用lockedScale的时候不需要改变这个原始缩放比
    if (!edit) {
      this.store.setOverallScaleFactor([newSize.x, newSize.y, newSize.z])
    }
     //内部move、rotate等操作时需要改变原始缩放比
    if (modelTransform) {
      const ratio = this.store.overallScale[0]
      newSize.divideScalar(ratio)
      this.store.setOverallScaleFactor([newSize.x, newSize.y, newSize.z])
    }
  }
```



```ts
  public lockedScale(scale: number, edit?: boolean) {
    if (this.object) {
      this.overallGroup.scale.set(scale, scale, scale)
      this.updateOverallGroup(edit)
    }
  }
```



### transformControl

构造时第一个参数是相机，第二个是需要监听的html对象

```ts
      this.transformControls = new TransformControls(this.camera,this.canvas)
      this.scene.add(this.transformControls)
    // controls变化的时候更新场景
      this.transformControls.addEventListener('change', this.render.bind(this))
   // 拖拽时（event.value为true）关掉自己的controls，防止和transformControls冲突
      this.transformControls.addEventListener('dragging-changed', (event) => {
        this.controls.enabled = !event.value
      })
```

显示和隐藏controls

```ts
  public showTransformControls() {
    if (this.transformControls) {
      this.transformControls.attach(this.object)
      this.transformControls.visible = true
    }
  }
  public hideTransformControls() {
    if (this.transformControls) {
      this.transformControls.visible = false
      this.transformControls.detach()
    }
  }
```

### 惯性视角

```ts
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
```

