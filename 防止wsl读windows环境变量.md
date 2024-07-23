# 防止wsl读windows环境变量

在`/etc/wsl.conf`中加入下面的代码

`[interop]
appendWindowsPath=false`

用vim修改只读文件后，可以`:w !sudo tee %`强制保存