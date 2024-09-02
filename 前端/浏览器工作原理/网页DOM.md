# 网页DOM

渲染进程中的HTML解析器将html解析成DOM，并非等到整份html加载完才开始解析，而是网络进程获取到html的多少内容，就解析多少

### 转换流程

html字节流通过分词器转为标签token和文本token，压入token栈。开头会默认先压入Document，后面遇到标签开始的token就建立DOM节点并将token压入栈，遇到文本token就建立DOM节点，遇到标签结束的token就检查栈顶是否为标签开始的token，是的话就让其出栈

### JavaScript影响DOM

#### 1、script标签

遇到script标签就停止解析过程，执行完了JavaScript再继续解析

