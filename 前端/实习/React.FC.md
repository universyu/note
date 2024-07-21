# React.FC

**tsx框架**

首先定义参数的类型

`interface Props {}`

然后利用`React.FC`和定义好的类型构造组件

`const component: React.FC<Props> = () => {}`



**示例代码**

```tsx
import React, { useRef, CSSProperties } from 'react'
import { Delete } from '@src/assets/icons/Delete'

type ImageInputedComponentProps = {
  style?: React.CSSProperties
  selectedFile: File
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>
  setVaildImg: React.Dispatch<React.SetStateAction<boolean>>
}

const ImageInputed: React.FC<ImageInputedComponentProps> = ({
  style,
  selectedFile,
  setSelectedFile,
  setVaildImg,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const handleFliter = (event: { currentTarget: { style: { opacity: number } } }) => {
    event.currentTarget.style.opacity = 1
    if (imgRef.current) {
      imgRef.current.style.filter = 'blur(5px)'
    }
  }
  const handleCancelFliter = (event: { currentTarget: { style: { opacity: number } } }) => {
    event.currentTarget.style.opacity = 0
    if (imgRef.current) {
      imgRef.current.style.filter = 'none'
    }
  }
  return (
    <div
      style={{
        ...style,
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <img
        src={URL.createObjectURL(selectedFile)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'filter 0.3s ease',
        }}
        alt="prompt-image"
        ref={imgRef}
      />
      <div
        id="delete"
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          backgroundColor: 'rgb(131, 138, 135, 0.2)',
          transition: 'opacity 0.3s ease',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        // @ts-ignore
        onMouseOver={handleFliter}
        // @ts-ignore
        onMouseOut={handleCancelFliter}
        onClick={() => {
          setSelectedFile(null)
          setVaildImg(false)
        }}
      >
        <Delete />
      </div>
    </div>
  )
}

export default ImageInputed

```

