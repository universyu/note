import { Camera, Object3D, Quaternion, Raycaster, Vector3 } from 'three'

export class TransformControls extends Object3D {
  constructor(
    camera: Camera,
    domElement?: HTMLElement,
    uiConfig?: {
      matHelperOpacity?: number
      colorMappings?: {
        red: number
        green: number
        blue: number
      }
      gzConfig?: {
        translate?: {
          x?: Array<[string, string, [number, number, number]?, [number, number, number]?]>
          y?: Array<[string, string, [number, number, number]?, [number, number, number]?]>
          z?: Array<[string, string, [number, number, number]?, [number, number, number]?]>
          xyz?: boolean
        }
        rotate?: {
          x?: boolean
          y?: boolean
          z?: boolean
          e?: boolean
          xyze?: boolean
        }
        scale?: {
          x?: Array<[string, string, [number, number, number]?, [number, number, number]?]>
          y?: Array<[string, string, [number, number, number]?, [number, number, number]?]>
          z?: Array<[string, string, [number, number, number]?, [number, number, number]?]>
          xy?: boolean
          yz?: boolean
          xz?: boolean
          xyz?: boolean
        }
        pickerScale?: {
          x?: boolean
          y?: boolean
          z?: boolean
          xy?: boolean
          yz?: boolean
          xz?: boolean
          xyz?: boolean
        }
      }
    },
    controlFunction?: {
      /**
       * Translate the model.
       * @param offset Difference from the starting position of the mouse drag.
       * @param positionStart Initial position of the model.
       * @param axis The coordinate axis of transformControls.
       * If it returns true, continue executing the remaining original code in transformControls.
       */
      preTranslate?: (offset: THREE.Vector3, positionStart: THREE.Vector3, axis: string) => boolean
      /**
       * Rotate the model.
       * @param axis The coordinate axis of transformControls.
       */
      rotate?: (axis: string) => void
      /**
       * Scale the model.
       * @param _tempVector Starting position corresponding to the world coordinate.
       * @param _tempVector2 End position corresponding to the world coordinate.
       * @param axis Rotation center axis.
       * If it returns true, continue executing the remaining original code in transformControls.
       */
      preScale?: (_tempVector: THREE.Vector3, _tempVector2: THREE.Vector3, axis: string) => boolean
      /**
       * @param objectPosition Model position.
       * @param offset Difference from the starting position of the mouse drag.
       */
      pointerDown?: (objectPosition: THREE.Vector3, offset: THREE.Vector3) => void
      /**
       * @param objectPosition Model position.
       * @param offset Difference from the starting position of the mouse drag.
       * @param objectRotation Current rotation of the model.
       * @param tempVector2 Ending scale corresponding to the world coordinate.
       */
      pointerUp?: (
        objectPosition: THREE.Vector3,
        offset: THREE.Vector3,
        objectRotation: THREE.Vector3,
        tempVector2: THREE.Vector3
      ) => void
    }
  )

  isTransformControls: boolean
  visible: boolean
  domElement: HTMLElement
  camera: Camera
  object: Object3D | undefined
  enabled: boolean
  axis: string | null
  mode: 'translate' | 'rotate' | 'scale'
  translationSnap: number | null
  rotationSnap: number | null
  scaleSnap: number | null
  space: 'world' | 'local'
  size: number
  dragging: boolean
  showX: boolean
  showY: boolean
  showZ: boolean

  changeEditStates(obj: Record<string, boolean>): void
  attach(object: Object3D): this
  detach(): this
  getMode(): string
  setMode(mode: 'translate' | 'rotate' | 'scale'): void
  setTranslationSnap(translationSnap: number | null): void
  setRotationSnap(rotationSnap: number | null): void
  setScaleSnap(scaleSnap: number | null): void
  setSize(size: number): void
  setSpace(space: 'world' | 'local'): void
  dispose(): void
  getRaycaster(): Raycaster
}

export class TransformControlsGizmo extends Object3D {
  constructor(transformControlsMode: string)

  isTransformControlsGizmo: boolean
  type: 'TransformControlsGizmo'
  gizmo: Record<string, Object3D>
  picker: Record<string, Object3D>
  helper: Record<string, Object3D>
}

export class TransformControlsPlane extends Object3D {
  constructor()

  isTransformControlsPlane: boolean
  type: 'TransformControlsPlane'
  mode: string
  axis: string | null
  space: 'world' | 'local'
  eye: Vector3
  worldPosition: Vector3
  worldQuaternion: Quaternion
  cameraQuaternion: Quaternion
}
