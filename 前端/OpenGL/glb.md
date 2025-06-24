
## animation 帧选择



## morph animation 

通过调节 meshes 下 primitives 的 targets 对应的 weights 实现表情等细节动画

## buffers、bufferviews、accessors

原始数据存在 bin 文件中，buffers 显示了总长度和 uri ， bufferViews 指定 buffer 中的一段，可以用不同的 bufferViews 表示 bin 中的不同对象。accessors 指定从 bufferviews 中取什么格式的数据以及取出数据的数量，调用时全都是写 accessors 的索引。


示例 bin 的 json 版
```json
{
  "white_positions": [
    [5.0, 5.0, 0.0],
    [3.536, 8.536, 0.0],
    [0.0, 10.0, 0.0],
    [-3.536, 8.536, 0.0],
    [-5.0, 5.0, 0.0],
    [-3.536, 1.464, 0.0],
    [0.0, 0.0, 0.0],
    [3.536, 1.464, 0.0]
  ],
  "black_positions": [
    [-1.5, 6, 0],
    [-1.4, 6, 0],
    [-1.3, 6, 0],
    [1.5, 6, 0],
    [1.4, 6, 0],
    [1.3, 6, 0]
  ],
  "smile_positions": [
    [-1, 4, 0],
    [-0.5, 4, 0],
    [0.5, 4, 0],
    [1, 4, 0]
  ],
  "black_morph1": [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0]
  ],
  "black_morph2": [
    [0, 0, 0],
    [0, -1, 0],
    [0, -1, 0],
    [0, 0, 0]
  ],
  "white_line_indices": [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 0],
  "animation_input": [0, 1, 2, 3],
  "animation_output": [
    [0, 0],
    [1, 0],
    [0, 0],
    [0, 1]
  ]
}
```

示例 gltf 
```gltf
{
  "asset": { "version": "2.0" },
  "buffers": [{ "uri": "demo.bin", "byteLength": 392 }],
  "bufferViews": [
    { "buffer": 0, "byteOffset": 0, "byteLength": 96 },
    { "buffer": 0, "byteOffset": 96, "byteLength": 72 },
    { "buffer": 0, "byteOffset": 168, "byteLength": 48 },
    { "buffer": 0, "byteOffset": 216, "byteLength": 48 },
    { "buffer": 0, "byteOffset": 264, "byteLength": 48 },
    { "buffer": 0, "byteOffset": 312, "byteLength": 32 },
    { "buffer": 0, "byteOffset": 344, "byteLength": 16 },
    { "buffer": 0, "byteOffset": 360, "byteLength": 32 }
  ],
  "accessors": [
    {
      "bufferView": 0,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 8,
      "type": "VEC3"
    },
    {
      "bufferView": 1,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 3,
      "type": "VEC3"
    },
    {
      "bufferView": 1,
      "byteOffset": 36,
      "componentType": 5126,
      "count": 3,
      "type": "VEC3"
    },
    {
      "bufferView": 2,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 4,
      "type": "VEC3"
    },
    {
      "bufferView": 3,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 4,
      "type": "VEC3"
    },
    {
      "bufferView": 4,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 4,
      "type": "VEC3"
    },
    {
      "bufferView": 5,
      "byteOffset": 0,
      "componentType": 5123,
      "count": 16,
      "type": "SCALAR"
    },
    {
      "bufferView": 6,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 4,
      "type": "SCALAR"
    },
    {
      "bufferView": 7,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 4,
      "type": "VEC2"
    }
  ],
  "materials": [
    {
      "pbrMetallicRoughness": {
        "baseColorFactor": [1, 1, 1, 1],
        "metallicFactor": 0,
        "roughnessFactor": 1
      }
    },
    {
      "pbrMetallicRoughness": {
        "baseColorFactor": [0, 0, 0, 1],
        "metallicFactor": 0,
        "roughnessFactor": 1
      }
    }
  ],
  "meshes": [
    {
      "primitives": [
        {
          "attributes": { "POSITION": 0 },
          "indices": 6,
          "mode": 1,
          "material": 0
        }
      ]
    },
    {
      "primitives": [
        {
          "attributes": { "POSITION": 1 },
          "mode": 3,
          "material": 1
        },
        {
          "attributes": { "POSITION": 2 },
          "mode": 3,
          "material": 1
        },
        {
          "attributes": { "POSITION": 3 },
          "targets": [{ "POSITION": 4 }, { "POSITION": 5 }],
          "mode": 3,
          "material": 1
        }
      ]
    }
  ],
  "nodes": [{ "mesh": 0 }, { "mesh": 1 }],
  "scenes": [{ "nodes": [0, 1] }],
  "scene": 0,
  "animations": [
    {
      "samplers": [
        {
          "input": 7,
          "output": 8,
          "interpolation": "LINEAR"
        }
      ],
      "channels": [
        {
          "sampler": 0,
          "target": { "node": 1, "path": "weights" }
        }
      ]
    }
  ]
}

```


## materials

### metallicRoughnessTexture

用蓝色通道和绿色通道分别包含 metallic 和 roughness 信息，把 metallicFactore 和 roughnessFactor 分别和这些信息相乘得到最终的 metallic 和 roughness

### texture 结构

包含 source 和 sampler， sampler 决定 min、max filter 和 s、t wrap 

## 骨骼动画

mesh 存 skin 作为子节点，保留起始 inverseBindMatrices ，可以把 mesh 的点从本地转到 joints 空间，每帧动画每个 joint 得到一个全局矩阵 globalJointTransform ，这个矩阵已经算上了 mesh 的transform，jointMatrix = inverse(globalMeshTransform) * globalJointTransform * inverseBindMatrix
最后的动画效果需要用权重做加权平均。