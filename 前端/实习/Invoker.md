# Invoker

#### **结构**

`globalStore`中存了`controller`和`invoker`，其中，`controller`有`invoker`的控制权

```mermaid
graph TB
A[controller] --> B[invoker]
A --> C[renderer]
```

UI存储变量用作`offset`，ThreeJsRenderer存储变量记录实际数据
`command`内部更新UI的变量，并调用controller来调用ThreeJsRenderer的方法

**流程图（以更新缩放为例）**

```mermaid
graph LR
A[UI] --> B["invoker（globalStore）"]
B -->|Command| C[controller]
C --> D[ThreeJsRenderer]
```



#### ThreejsRenderer

提供函数实现模型的更新

 ```tsx
   public moveModel(params: { x?: number; y?: number; z?: number }) {
     const { x, y, z } = params
     if (this.object) {
       if (x !== undefined) this.object.position.x = x
       if (y !== undefined) this.object.position.y = y
       if (z !== undefined) this.offsetZ = z
 
       this.object.updateMatrixWorld()
       this.convexHull.matrix = this.object.matrix.clone()
       if (this.baseModel) {
         this.object.position.z -=
           findMinZ(this.convexHull) - findMaxZ(this.baseConvexHubll) + this.offsetZ
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



#### controller

在这里实现UI变量的更改以及模型的更改

```tsx
  public updateModelPosition = (params: { x?: number; y?: number; z?: number }) => {
    const { positionLimits } = this.store
    const newPosition: number[] = [...this.store.modelPosition]
    const updatePosition = (value: number, index: number) => {
      if (value < positionLimits[index * 2]) {
        newPosition[index] = positionLimits[index * 2]
      } else if (value > positionLimits[index * 2 + 1]) {
        newPosition[index] = positionLimits[index * 2 + 1]
      } else {
        newPosition[index] = value
      }
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case 'x':
            updatePosition(value, 0)
            break
          case 'y':
            updatePosition(value, 1)
            break
          case 'z':
            updatePosition(value, 2)
            break
        }
      }
    })
    this.store.setModelPosition(newPosition)
    this.renderer.moveModel(params)
  }
```



#### 封装command

不要在前端以参数的形式给`Command`传入前后状态，而是在`Command`中直接取得需要的参数。

```tsx
import { ICommand, getController, getEditStore } from './Command'

export class Move implements ICommand {
  prePosition: { x?: number; y?: number; z?: number }
  curPosition: { x?: number; y?: number; z?: number }
  public constructor(params: { x?: number; y?: number; z?: number }) {
    this.prePosition = params

    const modelPosition = getEditStore().modelPosition
    this.curPosition = {}

    if (params.x !== undefined) {
      this.curPosition.x = modelPosition[0]
    }
    if (params.y !== undefined) {
      this.curPosition.y = modelPosition[1]
    }
    if (params.z !== undefined) {
      this.curPosition.z = modelPosition[2]
    }
  }

  execute(): void | Promise<void> {
    const controller = getController()
    if (controller) {
      controller.updateModelPosition(this.curPosition)
    }
  }

  undo(): void | Promise<void> {
    const controller = getController()
    if (controller) {
      controller.updateModelPosition(this.prePosition)
    }
  }
}

```



#### invoker执行command

```tsx
  public async execute<CMD extends ICommand, T extends Array<any>>(
    // @ts-ignore
    type: { new (...T): CMD },
    ...args: T
  ) {
    const cmd = new type(...args)
    await cmd.execute()

    this.undoStack.push(cmd)
    this.redoStack = []
    this.updateStack()
  }
```





#### UI触发

这里传入发送变化前一个瞬间的值，当下的值可以在发生变化后从全局存储文件中直接获取

```tsx
invoker.execute(Move, {x: 1})
```



#### 完整代码

##### Controller.ts

```ts
import { SCALE_MAX, SCALE_MIN } from '@src/core/EditorConstants'
import { useEditorStore } from '@src/stores/editorStore'
import { BASE_DEFAULT_COLOR } from './EditorConstants'
import { EditorContext } from './EditorContext'
import { Invoker } from './Invoker'
import ThreeJsRenderer from './ThreeJsRenderer'
type Props = {
  context: EditorContext
  canvas: HTMLCanvasElement
  cubeCanvas: HTMLCanvasElement
}

export class Controller {
  public invoker: Invoker
  private renderer: ThreeJsRenderer
  private context: EditorContext

  public constructor({ context, canvas, cubeCanvas }: Props) {
    this.invoker = new Invoker()
    this.context = context
    this.renderer = new ThreeJsRenderer({ canvas, context: this.context, cubeCanvas })

    if (this.context.modelUrl) {
      this.renderer.updateModel(this.context.modelUrl, this.context.modelTextureUrl)
    } else {
      console.error('Model url should not be empty!')
    }
  }

  public dispose() {
    this.renderer.dispose()
    this.store.reset()
  }

  private get store() {
    return useEditorStore.getState()
  }

  private get bodyColor() {
    const { quantizedNum, quantizedInfos } = this.store
    if (!quantizedInfos || quantizedNum === undefined) {
      return []
    }

    const quantizedInfo = quantizedInfos.find((item) => item.colorNum === quantizedNum)
    return quantizedInfo?.bodyColor ?? []
  }

  private get eyeColor() {
    const { quantizedNum, quantizedInfos } = this.store
    if (!quantizedInfos || quantizedNum === undefined) {
      return []
    }

    const quantizedInfo = quantizedInfos.find((item) => item.colorNum === quantizedNum)
    return quantizedInfo?.eyeColor ?? []
  }

  public getCurrentQuantization() {
    if (!this.context.modelTextureUrl || !this.store.quantizedNum) {
      return {
        quantizedNum: 0,
        bodyColor: [],
        eyeColor: [],
        textureUrl: this.context.modelTextureUrl ?? '',
      }
    }

    return {
      textureUrl: this.context.quantizedModelTextureUrl ?? this.context.modelTextureUrl,
      quantizedNum: this.store.quantizedNum,
      bodyColor: this.bodyColor,
      eyeColor: this.eyeColor,
    }
  }

  public updateEyeResources(eyeModelUrls: string[][]) {
    this.context.eyeModelUrls = eyeModelUrls
  }

  public updateEyeModel(index: number) {
    this.context.selectedEyeIndex = index
    if (index >= 0 && index < this.context.eyeModelUrls.length) {
      this.renderer.updateEyeModel(this.context.eyeModelUrls[this.context.selectedEyeIndex])
    } else {
      if (index !== -1) {
        console.error('Invalid eye index!')
      }
      this.renderer.updateEyeModel([])
    }
  }

  public onCanvasResize() {
    this.renderer.onCanvasResize()
  }

  public updateBaseModel(baseUrl: string) {
    this.renderer.updateBaseModel(baseUrl)
  }

  public updateBaseColor(color: string) {
    this.store.setBaseColor(color)
    this.renderer.updateBaseColor(color)
  }

  public updateModelPosition = (params: { x?: number; y?: number; z?: number }) => {
    const { positionLimits } = this.store
    const newPosition: number[] = [...this.store.modelPosition]
    const updatePosition = (value: number, index: number) => {
      if (value < positionLimits[index * 2]) {
        newPosition[index] = positionLimits[index * 2]
      } else if (value > positionLimits[index * 2 + 1]) {
        newPosition[index] = positionLimits[index * 2 + 1]
      } else {
        newPosition[index] = value
      }
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case 'x':
            updatePosition(value, 0)
            break
          case 'y':
            updatePosition(value, 1)
            break
          case 'z':
            updatePosition(value, 2)
            break
        }
      }
    })
    this.store.setModelPosition(newPosition)
    this.renderer.moveModel(params)
  }

  public updateModelRotation = (params: { x?: number; y?: number; z?: number }) => {
    const newRotation: number[] = [...this.store.modelRotation]

    const updateRotation = (value: number, index: number) => {
      newRotation[index] = value
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case 'x':
            updateRotation(value, 0)
            break
          case 'y':
            updateRotation(value, 1)
            break
          case 'z':
            updateRotation(value, 2)
            break
        }
      }
    })

    this.store.setModelRotation(newRotation)
    this.renderer.rotateModel(params)
  }

  public updateModelScale = (params: { x?: number; y?: number; z?: number }) => {
    const newScale: number[] = [...this.store.relativelyScale]

    const updateScale = (value: number, index: number) => {
      if (value > SCALE_MAX) {
        newScale[index] = SCALE_MAX
      } else if (value < SCALE_MIN) {
        newScale[index] = SCALE_MIN
      } else {
        newScale[index] = value
      }
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case 'x':
            updateScale(value, 0)
            break
          case 'y':
            updateScale(value, 1)
            break
          case 'z':
            updateScale(value, 2)
            break
        }
      }
    })

    this.store.setRelativelyScale(newScale)
    this.renderer.scaleModel(params)
  }

  public resetModel = () => {
    this.store.setModelPosition(new Array(3).fill(parseFloat(this.store.subjectInits[0])))
    this.store.setModelRotation(new Array(3).fill(parseFloat(this.store.subjectInits[1])))
    this.store.setRelativelyScale(new Array(3).fill(parseFloat(this.store.subjectInits[2])))
    this.store.setOverallScale(new Array(1).fill(parseFloat(this.store.overallInits[0])))
    this.store.setBaseColor(BASE_DEFAULT_COLOR)
    this.renderer.resetModel()
  }
  public resetUndo = (
    prePosition: number[],
    preRotation: number[],
    preScale: number[],
    preScaleOverall: number[],
    preBaseColor: string
  ) => {
    this.store.setModelPosition(prePosition)
    this.store.setModelRotation(preRotation)
    this.store.setRelativelyScale(preScale)
    this.store.setOverallScale(preScaleOverall)
    this.store.setBaseColor(preBaseColor)
    this.renderer.resetUndo(prePosition, preRotation, preScale, preScaleOverall, preBaseColor)
  }
  public lockedScale = (scale: number) => {
    this.store.setOverallScale([scale])
    this.renderer.lockedScale(scale)
  }
  public lockedcaleModel = (scales: number[]) => {
    this.store.setRelativelyScale(scales)
    this.renderer.lockedScaleModel(scales)
  }
  public updateCameraAngle(azimuthal: number, polar: number) {
    this.renderer.updateCameraAngle(azimuthal, polar)
  }

  public clearCameraCubeMesh() {
    this.renderer.clearCameraCubeMesh()
  }

  public updatePokemonTexture(textureUrl: string) {
    this.context.updateTextureUrl(textureUrl)
    this.renderer.updatePokemonTexture(textureUrl)
  }

  public updateEyeColor(colorList: string[]) {
    this.renderer.updateEyeColor(colorList)
  }

  public updatePaletteInfos({
    originColorKey,
    options,
  }: {
    originColorKey: string
    options?: Partial<FilamentInfo>
  }) {
    this.store.updateFilamentInfo(originColorKey, { ...options })
    this.updateTextureColor(this.store.filamentList)
  }

  public deletePalette({ colorKey, newColorKey }: { colorKey: string; newColorKey: string }) {
    this.store.updateFilamentInfo(colorKey, { deleted: true, sourceKey: newColorKey })
    this.updateTextureColor()
  }

  private async updateTextureColor(filamentList = this.store.filamentList) {
    const textureUrl = await this.context.updateTextureColor(filamentList)
    if (textureUrl) {
      this.renderer.updatePokemonTexture(textureUrl)
    }
  }

  public updateQuantization({
    bodyColor,
    quantizedNum,
    originFilamentColorList,
    textureUrl,
  }: {
    bodyColor: string[]
    quantizedNum: number
    originFilamentColorList?: FilamentInfo[]
    textureUrl: string
  }) {
    const { setFilamentColorList, setQuantizedNum } = this.store
    setFilamentColorList(
      originFilamentColorList ??
        bodyColor.map((v) => {
          return {
            key: v,
            color: v,
          }
        })
    )
    setQuantizedNum(quantizedNum)
    this.context.updateTextureUrl(textureUrl)
    this.updateTextureColor()
  }
}

```



##### Command.ts

```ts
import { useGlobalStore } from '@src/stores/globalStore'
import { Controller } from '../Controller'
import { useEditorStore } from '@src/stores/editorStore'
export interface ICommand {
  execute(): void | Promise<void>
  undo(): void | Promise<void>
}

export function getController(): Controller | undefined {
  const { controller } = useGlobalStore.getState()
  return controller
}

export function getEditStore() {
  return useEditorStore.getState()
}

```



##### Invoker.ts

```ts
import { useEditorStore } from '@src/stores/editorStore'
import { ICommand } from './commands/Command'

export class Invoker {
  undoStack: ICommand[] = []
  redoStack: ICommand[] = []

  public constructor() {}

  public async executeCmd(cmd: ICommand) {
    await cmd.execute()
    this.undoStack.push(cmd)
    this.redoStack = []
    this.updateStack()
  }

  public async batchExecute<CMD extends ICommand, T extends Array<any>>(
    // @ts-ignore
    type: { new (...T): CMD },
    selectedIndexes: number[],
    ...args: T
  ) {
    const cmd = new type(selectedIndexes, ...args)
    await cmd.execute()

    this.undoStack.push(cmd)
    this.redoStack = []
    this.updateStack()
  }

  public redo(): Promise<ICommand> | undefined {
    if (this.redoStack.length === 0) {
      return
    }

    const toRedo = this.redoStack.pop() as ICommand
    const res = toRedo.execute()
    const handleRes = () => {
      this.undoStack.push(toRedo)
      this.updateStack()
    }

    if (res instanceof Promise) {
      return new Promise<ICommand>((resolve) => {
        res.then(() => {
          handleRes()
          resolve({ ...toRedo })
        })
      })
    } else {
      handleRes()
      return new Promise<ICommand>((resolve) => resolve({ ...toRedo }))
    }
  }

  public undo(): Promise<ICommand> | undefined {
    if (this.undoStack.length === 0) {
      return
    }
    const toUndo = this.undoStack.pop() as ICommand
    const res = toUndo?.undo()
    const handleRes = () => {
      this.redoStack.push(toUndo)
      this.updateStack()
    }
    if (res instanceof Promise) {
      return new Promise<ICommand>((resolve) => {
        res.then(() => {
          handleRes()
          resolve({ ...toUndo })
        })
      })
    } else {
      handleRes()
      return new Promise<ICommand>((resolve) => resolve({ ...toUndo }))
    }
  }

  public updateStack() {
    useEditorStore.getState().updateStack(this.undoStack.length, this.redoStack.length)
    const { setUndoDisabled, setRedoDisabled } = useEditorStore.getState()
    setUndoDisabled(this.undoStack.length === 0)
    setRedoDisabled(this.redoStack.length === 0)
  }

  public async execute<CMD extends ICommand, T extends Array<any>>(
    // @ts-ignore
    type: { new (...T): CMD },
    ...args: T
  ) {
    const cmd = new type(...args)
    await cmd.execute()
    this.undoStack.push(cmd)
    this.redoStack = []
    this.updateStack()
  }

  private async genericChangeCommand<COMMAND extends ICommand, T extends any[]>(
    type: new (...constructorArgs: T) => COMMAND,
    ...constructorArgs: T
  ) {
    const cmd = new type(...constructorArgs)
    await cmd.execute()
    this.undoStack.push(cmd)
    this.redoStack = []
    this.updateStack()
  }
}

```



