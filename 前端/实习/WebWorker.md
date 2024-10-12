# WebWorker

### 内容安全政策（CSP）

一般情况下，Worker不会继承主页面的CSP，可以在HTTP响应头中设置Worker的CSP

如果在主页面用Blob或者Data创建Worker，那么它会继承主页面的CSP

