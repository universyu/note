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

### 

