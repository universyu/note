# wasm异步调用

## 胶水代码

首先获取`wasm`和对应的胶水代码

## ts注解

为胶水代码补充`.d.ts`文件，至少需要注解出用于加载`wasm`的函数以及实际调用的内容

```ts
// 定义 WebAssembly 内存接口
interface WebAssemblyMemory {
  buffer: ArrayBuffer
}

// 定义 Relief 模块接口
export interface ReliefModule {
  // 内存相关
  HEAPF32: Float32Array
  HEAPU32: Uint32Array
  memory: WebAssemblyMemory

  // 核心内存管理函数
  _free: (ptr: number) => void
  _malloc: (size: number) => number

  // Relief 特定函数
  _depth_relief_mesh: (
    width: number,
    thick: number,
    back_thick: number,
    padding: number,
    use_enhance: number,
    use_mask: number,
    use_support: number,
    use_simplification: number,
    simp_ratio: number,
    rows: number,
    cols: number,
    rgb_data: number,
    data_length: number
  ) => number

  // 网格数据访问函数
  _get_triangle_count: (meshDataPtr: number) => number
  _get_vertex_count: (meshDataPtr: number) => number
  _get_vertices: (meshDataPtr: number) => number
  _delete_vertices: (verticesPtr: number) => void
  _get_indices: (meshDataPtr: number) => number
  _delete_indices: (indicesPtr: number) => void

  // 其他辅助函数
  _keep_validator_alive: (ptr: number) => void
  _free_string: (ptr: number) => void
  _check_validation_echo: (ptr: number) => void
  _get_validator_result: () => number
  _get_matrix_buffer: (ptr: number) => number
  _get_matrix_rows: (ptr: number) => number
  _get_matrix_cols: (ptr: number) => number
  _free_matrix: (ptr: number) => void
  _create_depth_void: () => number
  _empty_cimg: () => number
  _get_normals: (ptr: number) => number
  _delete_normals: (ptr: number) => void
  _delete_depth: (ptr: number) => void

  // 工具函数
  cwrap: (name: string, returnType: string | null, argTypes?: string[]) => Function
  UTF8ToString: (ptr: number, maxBytesToRead?: number) => string
}

// 模块初始化选项接口
interface ReliefModuleOptions {
  wasmPath?: string
  print?: (text: string) => void
  printErr?: (text: string) => void
  locateFile?: (path: string, scriptDirectory: string) => string
  [key: string]: any
}

// 模块生成器函数声明
declare function reliefGenerator(options?: ReliefModuleOptions): Promise<ReliefModule>

export default reliefGenerator

```



## 加载器

这里负责加载`wasm`并把主要的处理函数暴露出去

```ts
import reliefGenerator, { ReliefModule } from './relief'

type Resolve = (value: ReliefModule | PromiseLike<ReliefModule>) => void
export type ReliefOptions = {
  width: number
  thick: number
}
let _relief: ReliefModule | undefined
let _resolves: Resolve[] = []
let _importStarted = false

const RELIEF_WASM_PATH = './relief.wasm'

const defaultOptions = {
  back_thick: 1,
  padding: 1,
  use_enhance: 0,
  use_mask: 0,
  use_support: 0,
  use_simplification: 0,
  simp_ratio: 0.1,
}

export class ReliefWrapper {
  static async core(): Promise<ReliefModule> {
    if (_relief) {
      return _relief
    }

    return new Promise<ReliefModule>(async (resolve, reject) => {
      if (_importStarted) {
        _resolves.push(resolve)
        return
      }
      _importStarted = true

      const onError = () => {
        const message = 'failed to load Relief library'
        reject(new Error(message))
      }

      try {
        const response = await fetch(RELIEF_WASM_PATH, { method: 'HEAD' })
        if (!response.ok) {
          onError()
          return
        }

        const relief: ReliefModule = await reliefGenerator({
          locateFile: () => RELIEF_WASM_PATH,
        })
        _relief = relief

        resolve(relief)
        if (_resolves.length > 0) {
          for (const _resolve of _resolves) {
            _resolve(relief)
          }
          _resolves.length = 0
        }
      } catch (e) {
        console.error(e)
        onError()
      }
    })
  }

  // Have to ensure the core is loaded before calling this
  static syncCore(): ReliefModule | undefined {
    return _relief
  }

  static async processRelief(
    imgData: { width: number; height: number; pixels: Uint8ClampedArray },
    options: ReliefOptions
  ) {
    const core = ReliefWrapper.syncCore()
    if (!core) {
      console.error('Relief core not loaded')
      return undefined
    }
    try {
      const { width, height, pixels } = imgData
      const imageFloatArray = new Float32Array(width * height * 4)
      for (let i = 0, j = 0; j < width * height; i += 4, j++) {
        imageFloatArray[j] = pixels[i]
        imageFloatArray[j + width * height] = pixels[i + 1]
        imageFloatArray[j + width * height * 2] = pixels[i + 2]
        imageFloatArray[j + width * height * 3] = pixels[i + 3]
      }
      // Allocate memory for image data
      const wasmData = core._malloc(imageFloatArray.length * 4)
      core.HEAPF32.set(imageFloatArray, wasmData / 4)
      const meshData = core._depth_relief_mesh(
        options.width,
        options.thick,
        defaultOptions.back_thick,
        defaultOptions.padding,
        defaultOptions.use_enhance,
        defaultOptions.use_mask,
        defaultOptions.use_support,
        defaultOptions.use_simplification,
        defaultOptions.simp_ratio,
        height,
        width,
        wasmData,
        imageFloatArray.length
      )

      // Free input data memory
      core._free(wasmData)

      const faceCount = core._get_triangle_count(meshData) * 3
      const vertexCount = core._get_vertex_count(meshData) * 3
      const verticesPtr = core._get_vertices(meshData)
      const verticesArray = Array.from(
        new Float32Array(core.HEAPF32.buffer, verticesPtr, vertexCount)
      )
      core._delete_vertices(verticesPtr)

      const indicesPtr = core._get_indices(meshData)
      const indicesArray = Array.from(new Uint32Array(core.HEAPU32.buffer, indicesPtr, faceCount))

      core._delete_indices(indicesPtr)

      return {
        vertices: new Float32Array(verticesArray),
        indices: new Uint32Array(indicesArray),
      }
    } catch (e) {
      console.error('Relief operation failed', e)
      return undefined
    }
  }
}

```



## worker

这里实现异步调用`c++`里提供的方法

```ts
import { ReliefOptions, ReliefWrapper } from './reliefCore'
type WorkerMessage = {
  imgData: {
    width: number
    height: number
    pixels: Uint8ClampedArray
  }
  options: ReliefOptions
}

ReliefWrapper.core()

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { imgData, options } = event.data
  try {
    await ReliefWrapper.core()
    const result = await ReliefWrapper.processRelief(imgData, options)
    self.postMessage({ success: true, result })
  } catch (error) {
    console.error('Error in worker:', error)
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

```

## worker调用器

这里负责对输入输出做格式化处理

```ts
import * as THREE from 'three'
import ReliefWorker from './ReliefWorker?worker&inline'
import { ReliefOptions } from './reliefCore'
interface WorkerResponse {
  success: boolean
  result?: { vertices: Float32Array; indices: Uint32Array } | undefined
  error?: string
}
class AsyncRelief {
  private worker: Worker
  private resolve?: (value: THREE.Mesh) => void
  private reject?: (reason?: any) => void
  constructor() {
    this.worker = new ReliefWorker()
    this.worker.onmessage = this.handleWorkerMessage.bind(this)
  }
  private handleWorkerMessage(event: MessageEvent<WorkerResponse>) {
    const { success, result, error } = event.data
    if (!success) {
      console.warn(error)
      this.reject?.(error)
      return
    }
    if (!result) {
      console.warn('No result from worker')
      this.reject?.('No result from worker')
      return
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(result.vertices, 3))
    geometry.setIndex(Array.from(result.indices))
    geometry.computeVertexNormals()
    const material = new THREE.MeshPhongMaterial({
      color: 0x808080,
      side: THREE.DoubleSide,
      flatShading: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    this.resolve?.(mesh)
  }
  async process(imageSrc: string, options: ReliefOptions): Promise<THREE.Mesh> {
    const imgElement = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image()
      img.src = imageSrc
      img.onload = () => resolve(img)
    })
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return new Promise<THREE.Mesh>((resolve, reject) => {
        reject('No context')
      })
    }
    canvas.width = imgElement.naturalWidth
    canvas.height = imgElement.naturalHeight
    ctx.drawImage(imgElement, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    const imgData = {
      width: canvas.width,
      height: canvas.height,
      pixels,
    }
    return new Promise<THREE.Mesh>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      this.worker.postMessage({ imgData, options })
    })
  }
  public terminate() {
    this.worker.terminate()
  }
}

export default AsyncRelief

```

