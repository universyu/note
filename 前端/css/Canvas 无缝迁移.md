
利用 id 查父级，挂载一个不展示的容器到顶层屏蔽 canvas ，有合法父级就迁移 canvas

```typescript
  if (canvasParentId && threeDeeCanvasWrapperRef.current) {
    const targetElement = document.getElementById(canvasParentId)
    if (targetElement) {
      targetElement.appendChild(threeDeeCanvasWrapperRef.current)
    }
  }

```

```tsx
      <div style={{ display: 'none' }}>
        <div ref={threeDeeCanvasWrapperRef}>
          {canvasParentId && (
            <ThreeDeePreviewCanvas
              style={{
                borderRadius:
                  canvasParentId === PORTAL_TARGET_ID.THREE_DEE_PREVIEW_TAB ? '8px' : '0px',
              }}
            />
          )}
        </div>
      </div>
```


这里 canvas 用的 absolute 而且合法父级都有写 relative 所以中间层 css 直接绕过