# postprocessing

### 处理器

`EffectComposer`管理一系列的渲染过程（pass）

`RenderPass`是特殊的渲染过程，从摄像机的角度渲染整个场景

```ts
    this.composer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)
```



### BloomEffect

让亮度高的物体更亮，制造光晕

```ts
    this.bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, {
      blendFunction: BlendFunction.ADD, //效果与原始场景亮度相加
      kernelSize: KernelSize.MEDIUM,  //控制模糊内核的大小
      radius: 0.5, //控制辉光扩散范围
      luminanceThreshold: 0.3, //超越阈值的会被处理得更亮
      luminanceSmoothing: 0.025, //值越小，边界过度越平滑
      intensity: 0.5, //辉光强度
      resolutionScale: 0.2, //画质
    })
    this.bloomEffect.ignoreBackground = true //忽略背景
    this.bloomEffect.luminancePass.enabled = true //启用阈值校验，只有超越亮度阈值的才处理
```

`this.bloomEffect.selection.add`可以选择需要使用辉光的对象

### vignetteEffect

创建暗角，制造氛围感

```ts
    this.vignetteEffect = new VignetteEffect({
      darkness: 0.42, //设置暗角的暗黑度
    })
```



### FXAA

快速抗锯齿

```ts
    const fxaaEffect = new FXAAEffect()
    //对比度在0.2-0.35之间的试做边缘
    fxaaEffect.minEdgeThreshold = 0.2
    fxaaEffect.maxEdgeThreshold = 0.35
```



### EffectPass

多个效果组合到一个处理阶段中

```ts
    const effectPass = new EffectPass(
      this.camera, //以相机视角渲染
      this.depthOfFieldEffect,
      this.outlineEffect,
      this.bloomEffect,
      fxaaEffect,
      this.vignetteEffect
    )
    this.composer.addPass(effectPass)
```

