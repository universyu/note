# Reset

#### 前置

前端对模型的控制都靠加法或者乘法来体现，全局存储的数组并非真实的位置、角度、缩放数组

#### renderer

初始状态和`reset`之前的状态都写在`ThreeJsRenderer.ts`里面

```ts
  public resetModel() {
    if (this.object) {
      this.prePosition = this.object.position.toArray() as [number, number, number]
      this.preRotation = [this.object.rotation.x, this.object.rotation.y, this.object.rotation.z]
      this.preScale = this.object.scale.toArray() as [number, number, number]
      this.normalScale = [...this.preScale]
      this.lockScale = [...this.normalScale]
      this.basePreScale = [...this.baseOriginScale]
      this.object.position.set(...this.originPosition)
      this.object.rotation.set(...this.originRotation)
      this.object.scale.set(...this.originScale)
      this.object.updateMatrix()
      this.convexHull.matrix = this.object.matrix.clone()
      if (this.baseModel) {
        this.preScaleBase = this.baseModel.scale.toArray() as [number, number, number]
        this.baseModel.scale.set(...this.baseOriginScale)
        this.baseBox.setFromObject(this.baseModel)
        this.object.position.z += this.baseBox.max.z - this.findMinZ()
      }
    }
  }

  public resetUndo() {
    if (this.object) {
      this.object.position.set(...this.prePosition)
      this.object.rotation.set(...this.preRotation)
      this.object.scale.set(...this.normalScale)
      this.object.updateMatrix()
      this.convexHull.matrix = this.object.matrix.clone()
      if (this.baseModel) {
        this.baseModel.scale.set(...this.preScaleBase)
        this.baseBox.setFromObject(this.baseModel)
        this.object.position.z += this.baseBox.max.z - this.findMinZ()
      }
    }
  }
```



#### command

调用初始值对全局变量做`reset`，记录`reset`前的状态做`undo`

```ts
import { ICommand, getController } from './Command'
import { useEditorStore } from '@src/stores/editorStore'

export class Reset implements ICommand {
  prePosition: number[]
  preRotation: number[]
  preScale: number[]
  preScaleOverall: number[]

  public constructor() {
    const { modelPosition, modelRotation, relativelyScale, overallScale } =
      useEditorStore.getState()
    this.prePosition = [...modelPosition]
    this.preRotation = [...modelRotation]
    this.preScale = [...relativelyScale]
    this.preScaleOverall = overallScale
  }

  execute(): void | Promise<void> {
    const controller = getController()
    const {
      setModelPosition,
      setModelRotation,
      setRelativelyScale,
      subjectInits,
      setOverallScale,
      overallInits,
    } = useEditorStore.getState()

    if (controller) {
      controller.resetModel()
      setModelPosition(new Array(3).fill(parseFloat(subjectInits[0])))
      setModelRotation(new Array(3).fill(parseFloat(subjectInits[1])))
      setRelativelyScale(new Array(3).fill(parseFloat(subjectInits[2])))
      setOverallScale(new Array(1).fill(parseFloat(overallInits[0])))
    }
  }

  undo(): void | Promise<void> {
    const controller = getController()
    const { setModelPosition, setModelRotation, setRelativelyScale, setOverallScale } =
      useEditorStore.getState()

    if (controller) {
      controller.resetUndo()
      setModelPosition(this.prePosition)
      setModelRotation(this.preRotation)
      setRelativelyScale(this.preScale)
      setOverallScale(this.preScaleOverall)
    }
  }
}

```



