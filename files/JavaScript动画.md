# JavaScript动画

### html的canvas标签

需要设置`id`和宽高，例如`  <canvas id="myCanvas" width="200" height="100"></canvas>`

### JavaScript的动画

获取`canvas`元素以及绘画上下文
```js
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
```

整体实例

```html
	<canvas id="myCanvas" width="200" height="50"></canvas>

    <script>
        
        let canvas = document.getElementById('myCanvas');
        let context = canvas.getContext('2d');
      
        let x = 0; 
        let y = 50; 
        let dx = 2;
      
        function draw() {
          
          context.clearRect(0, 0, canvas.width, canvas.height);
      
          context.fillStyle = '#FF0000';
      
          context.fillRect(x, y, 50, 50);
      
          x += dx;
      
          if (x + 50 > canvas.width || x < 0) {
            dx = -dx;
          }
      
          requestAnimationFrame(draw);
        }
      
        draw();
      </script>
```

