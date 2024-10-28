# TransformControls (Enhanced)

## Introduction

I attempted to import  `transformControls` into  a 3D webpage using  `Invoker`  , but i found that it doesn't have an API to change the behavior of the controls. To enhance the extensibility of  `transformControls`  , I added two parameters: `uiConfig` to adjust the UI of the controls and `controlFunction` to change the behavior of the controls.

## Overview of the control logic

It mainly consists of three parts of the logic:  `translate`  is used to control the translation of the model's position,  `rotate`  controls the rotation of the model, and  `scale`  controls the scaling of the model.

### translate

The offset is obtained by subtracting the starting coordinates from the ending coordinates of the mouse drag. The model's position is then updated by adding the offset.

### rotate

Obtain a reference vector that is perpendicular to the rotation axis and the direction of the view to confirm the rotation angle during mouse movement. Construct a quatrenion using the rotation axis and the rotation angle, and use this quaternion to implement the rotation of the model.

### scale

The scaling ratio is obtained by dividing the ending coordinates of the mouse drag by the starting coordinates. The model's initial scale is then multiplied by the scaling ratio to update the scale.

## Optional parameters

### uiConfig

#### params

##### colorMappings

 change the colorMappings of the material 

```ts
example
          colorMappings: {
            red: 0xff0000,
            green: 0x00ff00,
            blue: 0x0000ff,
          }
```

##### matHelperOpacity  

change the opacity of the matHelper,  setting it to  `0` means hidding the helper

```ts
example
          matHelperOpacity: 0
```

##### gzConfig  

change the config of the gizmo

```ts
example
          gzConfig: {
            translate: {
              x: [
                ['arrow', 'r', [0.5, 0, 0], [0, 0, -Math.PI / 2]],
                ['line', 'r', [0, 0, 0], [0, 0, -Math.PI / 2]],
              ],
              y: [
                ['arrow', 'g', [0, -0.5, 0], [Math.PI, 0, 0]],
                ['line', 'g', null, [Math.PI, 0, 0]],
              ],
              z: [
                ['arrow', 'b', [0, 0, -0.5], [-Math.PI / 2, 0, 0]],
                ['line', 'b', null, [-Math.PI / 2, 0, 0]],
              ],
              xyz: true,
            },
            rotate: {
              x: true,
              y: true,
              z: true,
            },
            scale: {
              x: [
                ['handle', 'r', [0.5, 0, 0], [0, 0, -Math.PI / 2]],
                ['line', 'r', [0, 0, 0], [0, 0, -Math.PI / 2]],
              ],
              y: [
                ['handle', 'g', [0, 0.5, 0]],
                ['line', 'g'],
              ],
              z: [
                ['handle', 'b', [0, 0, 0.5], [Math.PI / 2, 0, 0]],
                ['line', 'b', [0, 0, 0], [Math.PI / 2, 0, 0]],
              ],
            },
            pickerScale: {
              x: true,
              y: true,
              z: true,
            },
          }
```



### controlFunction

#### params

##### **preTranslate**

**change the position of the object**



```ts
      /**
       * Translate the model.
       * @param offset Difference from the starting position of the mouse drag.
       * @param positionStart Initial position of the model.
       * @param axis The coordinate axis of transformControls.
       * If it returns true, continue executing the remaining original code in transformControls.
       */

example
  public transformTranslate = (
    offset: THREE.Vector3,
    positionStart: THREE.Vector3,
    axis: string
  ) => {
    const newPosition = new Vector3().copy(offset).add(positionStart)
    newPosition.x = Math.trunc(newPosition.x * 10) / 10
    newPosition.y = Math.trunc(newPosition.y * 10) / 10
    this.renderer.updateModelTransform(ETransform.position, false, {
      x: newPosition.x,
      y: newPosition.y,
    })
    if (axis.indexOf('Z') !== -1) {
      offset.z = Math.trunc(offset.z * 10) / 10
      this.renderer.updateModelTransform(ETransform.position, false, {
        z: -offset.z,
      })
    }
    return false
  }
```

##### rotate

**change the rotationof the object**

```ts
      /**
       * Rotate the model.
       * @param axis The coordinate axis of transformControls.
       */
example
  public transformRotate = (axis: string) => {
    if (axis === 'X') {
      this.rotationAxis[0] = true
    } else {
      this.rotationAxis[0] = false
    }
    if (axis === 'Y') {
      this.rotationAxis[1] = true
    } else {
      this.rotationAxis[1] = false
    }
    if (axis === 'Z') {
      this.rotationAxis[2] = true
    } else {
      this.rotationAxis[2] = false
    }
  }
```

##### **preScale**

**change the scale of the object**

```ts
      /**
       * Scale the model.
       * @param _tempVector Starting position corresponding to the world coordinate.
       * @param _tempVector2 End position corresponding to the world coordinate.
       * @param axis Rotation center axis.
       * If it returns true, continue executing the remaining original code in transformControls.
       */
example
  public transformScale = (
    _tempVector: THREE.Vector3,
    _tempVector2: THREE.Vector3,
    axis: string
  ) => {
    //保留上次scale的状态
    _tempVector2.multiply(this.preScale)
    if (axis.search('X') !== -1) {
      this.scaleAxis = 'X'
      const scaleValueX = Math.trunc(_tempVector2.x * 10) / 10
      const scaleValueY =
        Math.trunc(((_tempVector2.x * this.preScale.y) / this.preScale.x) * 10) / 10
      const scaleValueZ =
        Math.trunc(((_tempVector2.x * this.preScale.z) / this.preScale.x) * 10) / 10
      if (this.store.locked) {
        _tempVector2.x = scaleValueX
        _tempVector2.y = scaleValueY
        _tempVector2.z = scaleValueZ
        this.renderer.updateModelTransform(ETransform.lockedScaleModel, false, _tempVector2)
      } else {
        _tempVector2.x = scaleValueX
        this.renderer.updateModelTransform(ETransform.scale, false, { x: _tempVector2.x })
      }
    } else if (axis.search('Y') !== -1) {
      this.scaleAxis = 'Y'
      const scaleValueY = Math.trunc(_tempVector2.y * 10) / 10
      const scaleValueX =
        Math.trunc(((_tempVector2.y * this.preScale.x) / this.preScale.y) * 10) / 10
      const scaleValueZ =
        Math.trunc(((_tempVector2.y * this.preScale.z) / this.preScale.y) * 10) / 10
      if (this.store.locked) {
        _tempVector2.x = scaleValueX
        _tempVector2.y = scaleValueY
        _tempVector2.z = scaleValueZ
        this.renderer.updateModelTransform(ETransform.lockedScaleModel, false, _tempVector2)
      } else {
        _tempVector2.y = scaleValueY
        this.renderer.updateModelTransform(ETransform.scale, false, { y: _tempVector2.y })
      }
    } else if (axis.search('Z') !== -1) {
      this.scaleAxis = 'Z'
      const scaleValueZ = Math.trunc(_tempVector2.z * 10) / 10
      const scaleValueX =
        Math.trunc(((_tempVector2.z * this.preScale.x) / this.preScale.z) * 10) / 10
      const scaleValueY =
        Math.trunc(((_tempVector2.z * this.preScale.y) / this.preScale.z) * 10) / 10
      if (this.store.locked) {
        _tempVector2.x = scaleValueX
        _tempVector2.y = scaleValueY
        _tempVector2.z = scaleValueZ
        this.renderer.updateModelTransform(ETransform.lockedScaleModel, false, _tempVector2)
      } else {
        _tempVector2.z = scaleValueZ
        this.renderer.updateModelTransform(ETransform.scale, false, { z: _tempVector2.z })
      }
    }
    return false
  }
```

##### pointerDown

**Called when the mouse is pressed, it could be used to save the state before the operation**

```ts
      /**
       * @param objectPosition Model position.
       * @param offset Difference from the starting position of the mouse drag.
       */
example
  public truncValue = (value: number) => {
    return Math.trunc((value / THREE_DEE_DEFAULT_SCALE) * 10) / 10
  }

  public transformPointerDown = (objectPosition: THREE.Vector3, offset: THREE.Vector3) => {
    this.prePosition = [objectPosition.x, objectPosition.y, objectPosition.z]
    this.preOffsetZ = offset.z
    this.preScale.copy(this.renderer.object!.scale)
    this.preScale.x = this.truncValue(this.preScale.x)
    this.preScale.y = this.truncValue(this.preScale.y)
    this.preScale.z = this.truncValue(this.preScale.z)
    this.rotationAxis = [false, false, false]
  }
```

##### pointerUp

**Called when the mouse is released, it could be used to send a command**

```ts
      /**
       * @param objectPosition Model position.
       * @param offset Difference from the starting position of the mouse drag.
       * @param objectRotation Current rotation of the model.
       * @param tempVector2 Ending scale corresponding to the world coordinate.
       */
example
  public transformPointerUp = (
    objectPosition: THREE.Vector3,
    offset: THREE.Vector3,
    objectRotation: THREE.Vector3,
    tempVector2: THREE.Vector3
  ) => {
    if (objectPosition.x !== this.prePosition[0]) {
      this.renderer.updateModelTransform(ETransform.position, true, { x: this.prePosition[0] })
    }
    if (objectPosition.y !== this.prePosition[1]) {
      this.renderer.updateModelTransform(ETransform.position, true, { y: this.prePosition[1] })
    }
    if (offset.z !== this.preOffsetZ) {
      this.renderer.updateModelTransform(ETransform.position, true, { z: -this.preOffsetZ })
    }
    if (this.store.locked) {
      if (this.preScale.x !== tempVector2.x) {
        this.renderer.updateModelTransform(ETransform.lockedScaleModel, true, {
          x: this.preScale.x,
          y: this.preScale.y,
          z: this.preScale.z,
        })
      }
    } else {
      if (this.preScale.x !== tempVector2.x && this.scaleAxis === 'X') {
        this.renderer.updateModelTransform(ETransform.scale, true, { x: this.preScale.x })
      }
      if (this.preScale.y !== tempVector2.y && this.scaleAxis === 'Y') {
        this.renderer.updateModelTransform(ETransform.scale, true, { y: this.preScale.y })
      }
      if (this.preScale.z !== tempVector2.z && this.scaleAxis === 'Z') {
        this.renderer.updateModelTransform(ETransform.scale, true, { z: this.preScale.z })
      }
    }

    if (this.rotationAxis[0]) {
      this.renderer.updateModelTransform(ETransform.rotation, true, {
        x: Number(MathUtils.radToDeg(objectRotation.x).toFixed(1)),
      })
    }
    if (this.rotationAxis[1]) {
      this.renderer.updateModelTransform(ETransform.rotation, true, {
        y: Number(MathUtils.radToDeg(objectRotation.y).toFixed(1)),
      })
    }
    if (this.rotationAxis[2]) {
      this.renderer.updateModelTransform(ETransform.rotation, true, {
        z: Number(MathUtils.radToDeg(objectRotation.z).toFixed(1)),
      })
    }
  }
```



