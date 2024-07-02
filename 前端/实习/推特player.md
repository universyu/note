# 推特player

### 预览视频

**无论是视频还是3D模型，只要全塞入一个html即可**

index.html代码如下

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="twitter:card" content="player" />
    <meta name="twitter:site" content="@TwitterDev" />
    <meta name="twitter:title" content="Sample Player Card" />
    <meta name="twitter:description"
      content="This is a sample video. When you implement, make sure all links are secure." />
    <meta name="twitter:image" content="https://test4.countingstars.cc/1.jpg" />
    <meta name="twitter:player" content="https://test4.countingstars.cc/test.html" />
    <meta name="twitter:player:width" content="480" />
    <meta name="twitter:player:height" content="480" />

  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

视频、图片、test.html都放在public里面，其中test.html的代码如下

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Video</title>
    <style>
        video {
            width: 100%;
            max-width: 600px;
            height: auto;
        }
    </style>
</head>
<body>

    <video controls muted>
        <source src="/mov_bbb.mp4" type="video/mp4">
        您的浏览器不支持视频标签。
    </video>
</body>
</html>
```



