# Three.js

### 基本框架

首先安装`threejs`和`vite`

`npm install --save three`  （save 会在 `package.json` 文件的 `dependencies` 字段中添加，没有save就会直接安装而不加依赖）
`npm install --save-dev vite` （save-dev表示只在测试环境下添加此依赖，生产环境不需要）

- 需要有一个`index.html`和一个`main.js`还有一个`public`文件夹

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>My first three.js app</title>
		<style>
			body { margin: 0; }
		</style>
	</head>
	<body>
		<script type="module" src="/main.js"></script>
	</body>
</html>
```

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //控制视角
```

### 基本场景

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
```

### 实例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Model Viewer</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <!-- 引入Three.js库 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <!-- 引入GLTFLoader -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
    <!-- 引入OrbitControls -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script>
        // 创建场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xdddddd);

        // 创建摄像机
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 添加光源
        const hlight = new THREE.AmbientLight(0x404040, 5);
        scene.add(hlight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // 加载3D模型
        const loader = new THREE.GLTFLoader();
        loader.load('scene.gltf', function (gltf) {
            scene.add(gltf.scene);
        }, undefined, function (error) {
            console.error(error);
        });

        // 初始化OrbitControls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);

        // 渲染函数
        function animate() {
            requestAnimationFrame(animate);
            controls.update(); // 使OrbitControls生效
            renderer.render(scene, camera);
        }
        animate();

        // 处理窗口大小变化
        window.addEventListener('resize', function () {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    </script>
</body>
</html>
```

