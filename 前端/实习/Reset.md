# Reset

#### 前置

前端对模型的控制都靠加法或者乘法来体现，全局存储的数组并非真实的位置、角度、缩放数组

#### renderer

初始状态和`reset`之前的状态都写在`ThreeJsRenderer.ts`里面

在模型初始化完成的时候记录模型的初始位置，做了`reset`前记录位置

```ts
  public resetModel() {
    if (this.object) {
      this.resetPosition = this.object.position.toArray() as [number, number, number]
      this.resetRotation = [this.object.rotation.x, this.object.rotation.y, this.object.rotation.z]
      this.resetScale = this.object.scale.toArray() as [number, number, number]
      this.object.position.set(...this.originPosition)
      this.object.rotation.set(...this.originRotation)
      this.object.scale.set(...this.originScale)
    }
  }

  public resetUndo() {
    if (this.object) {
      this.object.position.set(...this.resetPosition)
      this.object.rotation.set(...this.resetRotation)
      this.object.scale.set(...this.resetScale)
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

  public constructor() {
    const { modelPosition, modelRotation, relativelyScale } = useEditorStore.getState()

    this.prePosition = [...modelPosition]
    this.preRotation = [...modelRotation]
    this.preScale = [...relativelyScale]
  }

  execute(): void | Promise<void> {
    const controller = getController()
    const { setModelPosition, setModelRotation, setRelativelyScale, subjectInits } =
      useEditorStore.getState()

    if (controller) {
      controller.resetModel()
      setModelPosition(new Array(3).fill(parseFloat(subjectInits[0])))
      setModelRotation(new Array(3).fill(parseFloat(subjectInits[1])))
      setRelativelyScale(new Array(3).fill(parseFloat(subjectInits[2])))
    }
  }

  undo(): void | Promise<void> {
    const controller = getController()
    const { setModelPosition, setModelRotation, setRelativelyScale } = useEditorStore.getState()

    if (controller) {
      controller.resetUndo()
      setModelPosition(this.prePosition)
      setModelRotation(this.preRotation)
      setRelativelyScale(this.preScale)
    }
  }
}

```



