
blender 默认将 glb 的坐标系由 threejs 右手系转到右 x 上 z 前 y，在 threejs 中做的 transform 矩阵需要同步转系

```typescript
    const swapYZ = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1)

    const blenderMatrix = swapYZ.multiply(matrix).multiply(swapYZ)
```