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

