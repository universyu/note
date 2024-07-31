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
        const vertices: THREE.Vector3[] = []
        object.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            const positionAttribute = child.geometry.attributes.position
            for (let i = 0; i < positionAttribute.count; i++) {
              const vertex = new THREE.Vector3()
              vertex.fromBufferAttribute(positionAttribute, i)
              vertices.push(vertex)
            }
          }
        })
        const geometry = new ConvexGeometry(vertices)
        this.convexHull = new THREE.Mesh(geometry)
        this.convexHull.matrixAutoUpdate = false
        object.updateMatrix()
        this.convexHull.matrix = object.matrix.clone()
```

**根据凸包找到最小坐标**

```tsx
  private findMinZ(minZ = Infinity) {
    const positionAttribute = this.convexHull.geometry.attributes.position
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3()
      vertex.fromBufferAttribute(positionAttribute, i)
      vertex.applyMatrix4(this.convexHull.matrix)
      if (vertex.z < minZ) {
        minZ = vertex.z
      }
    }
    return minZ
  }
```

**更新模型后更新位置**

```tsx
//首先更新凸包
      this.object.updateMatrixWorld()
      this.convexHull.matrix = this.object.matrix.clone()
//然后更新位置
      if (this.baseModel) {
        this.baseBox.setFromObject(this.baseModel)
        this.object.position.z -= this.findMinZ() - this.baseBox.max.z
      }
```

