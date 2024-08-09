# Ref丢失

动态显示的标签（mui的Dialog）中直接为子标签写上ref=... 会导致其current为空，正确做法是写一个子组件，把ref写到组件里面去

这里假设Dialog依赖于downloadReady而显示

`    {downloadReady && <DownLoadReadyCanvas />}`

```tsx
import ThreeJsRenderer from '@src/core/ThreeJsRenderer'
import { useEditorStore } from '@src/stores/editorStore'
import { useGlobalStore } from '@src/stores/globalStore'
import React, { useEffect, useRef } from 'react'
interface CommonProps {}

const DownLoadReadyCanvas: React.FC<CommonProps> = () => {
  const {
    downloadReady,
    baseModelUrls,
    baseId,
    modelPosition,
    modelRotation,
    relativelyScale,
    overallScale,
    baseColor,
  } = useEditorStore()
  const { editorContext } = useGlobalStore()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !downloadReady) {
      return
    }
    const canvas = canvasRef.current
    const renderer = new ThreeJsRenderer({ canvas: canvasRef.current, context: editorContext })

    const initializeRenderer = async () => {
      if (canvas && editorContext.modelUrl) {
        const textureUrl = editorContext.modelTextureUrl

        if (editorContext.modelUrl) {
          await renderer.updateModel(editorContext.modelUrl, textureUrl)
          await renderer.updateBaseModel(baseModelUrls[baseId])
          renderer.updateInitPosition({
            position: modelPosition as [number, number, number],
            rotation: modelRotation as [number, number, number],
            scale: relativelyScale as [number, number, number],
            overallScale: overallScale[0],
            baseColor: baseColor,
          })
        } else {
          console.error('Model url should not be empty!')
        }
      }
    }
    initializeRenderer()
    return () => {
      renderer.dispose()
    }
  }, [])
  return (
    <canvas
      style={{
        width: '100%',
        height: '100%',
      }}
      ref={canvasRef}
    />
  )
}

export default DownLoadReadyCanvas

```

