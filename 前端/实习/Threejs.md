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

