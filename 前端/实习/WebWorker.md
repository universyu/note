# WebWorker

## 内容安全政策（CSP）

一般情况下，Worker不会继承主页面的CSP，可以在HTTP响应头中设置Worker的CSP

如果在主页面用Blob或者Data创建Worker，那么它会继承主页面的CSP





## worker 池

```ts
type WorkerTask<TInput, TOutput> = {
  input: TInput
  resolve: (output: TOutput) => void
  reject: (error: Error) => void
}

type WorkerInstance<TInput, TOutput> = {
  worker: Worker
  busy: boolean
  currentTask?: WorkerTask<TInput, TOutput>
}

export class WorkerPool<TInput, TOutput> {
  private workers: WorkerInstance<TInput, TOutput>[]
  private taskQueue: WorkerTask<TInput, TOutput>[] = []

  constructor(workerConstructor: new () => Worker, workerCount: number = 2) {
    this.workers = Array.from({ length: workerCount }, () => ({
      worker: new workerConstructor(),
      busy: false,
    }))
    this.workers.forEach((workerInstance) => {
      workerInstance.worker.onmessage = (event) => this.handleWorkerMessage(workerInstance, event)
      workerInstance.worker.onerror = (event) => this.handleWorkerError(workerInstance, event)
    })
  }

  private async handleWorkerMessage(
    workerInstance: WorkerInstance<TInput, TOutput>,
    event: MessageEvent
  ) {
    workerInstance.currentTask?.resolve(event.data.result)
    workerInstance.busy = false
    workerInstance.currentTask = undefined
    // 多出闲置 worker 就尝试执行任务队列
    this.processNextTask()
  }

  private handleWorkerError(workerInstance: WorkerInstance<TInput, TOutput>, event: ErrorEvent) {
    workerInstance.currentTask?.reject(event.error)
    workerInstance.busy = false
    workerInstance.currentTask = undefined
    // 任务处理失败则尝试处理下一个任务
    this.processNextTask()
  }

  private processNextTask() {
    if (this.taskQueue.length === 0) return

    const availableWorker = this.workers.find((w) => !w.busy)
    if (!availableWorker) return
    // 防 build 报错
    const task = this.taskQueue.shift()!
    availableWorker.busy = true
    availableWorker.currentTask = task
    availableWorker.worker.postMessage(task.input)
  }

  public execute(input: TInput): Promise<TOutput> {
    return new Promise<TOutput>((resolve, reject) => {
      this.taskQueue.push({ input, resolve, reject })
      this.processNextTask()
    })
  }

  public terminate() {
    this.workers.forEach(({ worker }) => worker.terminate())
    this.workers = []
    this.taskQueue = []
  }
}

```





## 传递规则

### 只可以传递可序列化数据

带有函数，原型链继承或内部循环引用的无法序列化

