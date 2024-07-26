# Invoker

**结构**

`globalStore`中存了`controller`和`invoker`，其中，`controller`有`invoker`的控制权

```mermaid
graph TB
A[controller] --> B[invoker]
A --> C[renderer]
```





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
   public scaleModel(scales: number[]) {
     if (this.object) {
       this.object.scale.set(scales[0], scales[1], scales[2])
     }
   }
 ```



#### controller

调用renderer的函数

```tsx
  public updateModelScale(scales: number[]) {
    this.renderer.scaleModel(scales)
  }
```



#### 封装command

```tsx
import { ICommand, getController } from './Command'
import { useEditorStore } from '@src/stores/editorStore'

export class ChangeModelScale implements ICommand {
  preScale: number[]
  curScale: number[]
  time: number

  public constructor(pre: number[], cur: number[]) {
    this.preScale = pre
    this.curScale = cur
    this.time = Date.now()
  }

  execute(): void | Promise<void> {
    const controller = getController()
    const { setRelativelyScale } = useEditorStore.getState()

    if (controller) {
      controller.updateModelScale(this.curScale)
      setRelativelyScale(this.curScale)
    }
  }

  undo(): void | Promise<void> {
    const controller = getController()
    const { setRelativelyScale } = useEditorStore.getState()

    if (controller) {
      controller.updateModelScale(this.preScale)
      setRelativelyScale(this.preScale)
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

```tsx
  const handleChangeScale = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const preScale = [...relativelyScale]
    const newScale = [...preScale]
    newScale[index] = parseFloat(e.target.value)
    invoker!.execute(ChangeModelScale, preScale, newScale)
  }
```





#### 完整代码

##### Controller.ts

```ts
import { useEditorStore } from '@src/stores/editorStore'
import { Invoker } from './Invoker'
import ThreeJsRenderer from './ThreeJsRenderer'
import { EditorContext } from './EditorContext'
import * as THREE from 'three'

type Props = {
  context: EditorContext
  canvas: HTMLCanvasElement
}

export class Controller {
  public invoker: Invoker
  private renderer: ThreeJsRenderer
  private context: EditorContext

  public constructor({ context, canvas }: Props) {
    this.invoker = new Invoker()
    this.context = context
    this.renderer = new ThreeJsRenderer(canvas, this.context)

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

  public updateModelPosition(newPosition: THREE.Vector3) {
    this.renderer.updateModelPosition(newPosition)
  }

  public updateModelRotation(newRotation: number[]) {
    this.renderer.rotateModel(newRotation)
  }

  public updateModelScale(scales: number[]) {
    this.renderer.scaleModel(scales)
  }
  public resetModel() {
    this.renderer.resetModel()
  }
}

```



##### Command.ts

```ts
import { useGlobalStore } from '@src/stores/globalStore'
import { Controller } from '../Controller'
export interface ICommand {
  time: number
  execute(): void | Promise<void>
  undo(): void | Promise<void>
}

export function getController(): Controller | undefined {
  const { controller } = useGlobalStore.getState()
  return controller
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
  }

  public async execute<CMD extends ICommand, T extends Array<any>>(
    // @ts-ignore
    type: { new (...T): CMD },
    ...args: T
  ) {
    const cmd = new type(...args)
    await cmd.execute()

    if (
      this.undoStack.length === 0 ||
      this.undoStack[this.undoStack.length - 1].time + 500 <= cmd.time
    ) {
      this.undoStack.push(cmd)
    }

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



