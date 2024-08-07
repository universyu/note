# Threejs

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
export function findMinZ(mesh: THREE.Mesh, minZ = Infinity): number {
  const positionAttribute = mesh.geometry.attributes.position
  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3()
    vertex.fromBufferAttribute(positionAttribute, i)
    vertex.applyMatrix4(mesh.matrix)

    if (vertex.z < minZ) {
      minZ = vertex.z
    }
  }
  return minZ
}
```

**更新模型后更新位置**

```tsx
  public moveModel(params: { x?: number; y?: number; z?: number }) {
    const { x, y, z } = params
    if (this.object) {
      if (x !== undefined) this.object.position.x = x
      if (y !== undefined) this.object.position.y = y
      if (z !== undefined) this.offsetZ = z
	//更新凸包
      this.object.updateMatrixWorld()
      this.convexHull.matrix = this.object.matrix.clone()
      if (this.baseModel) {
	//贴合底座
        this.object.position.z -=
          findMinZ(this.convexHull) - findMaxZ(this.baseConvexHubll) + this.offsetZ
    //更新凸包，并重求范围限制
        this.object.updateMatrixWorld()
        this.convexHull.matrix = this.object.matrix.clone()
        this.positionLimits = findRangeBounds(
          this.convexHull,
          this.baseConvexHubll,
          this.object.position.x,
          this.object.position.y
        )
        this.store.setPositionLimits(this.positionLimits)
      }
    }
  }
```

