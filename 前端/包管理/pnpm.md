
## 全局存储空间

多个项目使用同一个依赖时，可以链接到同一片存储区域，只安装一份依赖

## 直接依赖硬链接 

直接依赖用硬链接，相当于指针，直接指向全局存储依赖的地址。在 node_modules 里的 .pnpm 里面存储了这些硬链接，而 node_modules 里直接看到的直接依赖是对 node_modules/.pnpm 里硬链接的符号链接

## 间接依赖符号链接

间接依赖本身存储在全局依赖地址，但项目使用间接依赖时使用的是符号链接，相当于快捷方式

## 构建 monorepo 项目

初始化项目
```bash
pnpm init
touch pnpm-workspace.yaml
```
安装包到工作空间，会被添加到全局根目录的 package ，所以子目录都可以调用到这些包
```bash
pnpm add ... -D --workspace-root
```

