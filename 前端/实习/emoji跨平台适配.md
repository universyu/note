# emoji跨平台适配

## 简介

### 背景

在现有的项目中，铭牌（makeMySign）和圣诞项目（christmasOrnamentMaker) 都用到了一份 emoji 表，如下图：

![25](D:\note\前端\实习\src\25.png)

观察上图，我们可以看到有的 emoji “裂开”了。

### 需求

为了让界面简洁且美观，我们的需求是将 emoji 渲染成黑白格式，而且需要修复组合型 emoji 分离的问题，这里参考了 goole 的 notoEmoji 格式 （https://fonts.google.com/noto/specimen/Noto+Emoji）



## emoji渲染方式

### 码点

emoji 使用 Unicode 编码系统，具体包括

1. 基本码点，表示基本的 emoji 符号，如下图 （\u2764）

![24](D:\note\前端\实习\src\24.png)

2. 变体标识符，\uFE0E 表示 `text` ， \uFE0F 表示`emoji`，变体标识符将强制它前面的 `emoji` 码点的渲染方式， 下图从左到右为 (\u2693,\uFE0E) 和 (\u2693,\uFE0F)

   ![26](D:\note\前端\实习\src\26.png)

3. 连接符，\u200D表示“零宽”连接符，用来连接两个 emoji ，所谓“零宽”其实就是把两个 emoji 直接组合成一个 emoji  如下图 （\u2764, \u200D, \u1F525）爱心（\u2764）连接火焰（\u1F525）

![27](D:\note\前端\实习\src\27.png)

### NotoEmoji

上述的“零宽”连接符其实需要用`NotoEmoji`字体才能正确渲染，这里有一个小坑，变体标识符会强制 emoji 的渲染行为，导致“零宽”连接符失效，这一点对后续的应用至关重要



## 适配chrome、firefox、safari

为了将 emoji 渲染成文本格式且实现多 emoji 的组合渲染，考虑两个点：

1. 把变体标识符 \uFE0F 替换成 \uFE0E
2. 去掉“零宽连接符前面的变体标识符，防止连接效果失效



下面提供 `ts` 版本的代码，输入原本的 emoji 返回转换后的结果

```ts
function convertEmojiToText(emoji: string): string {
  // Convert string to array of code points
  const codePoints = Array.from(emoji).map((char) => char.codePointAt(0) ?? 0)
  let convertedCodePoints = []
  for (let i = 0; i < codePoints.length; i++) {
    if (codePoints[i] === 0xfe0f) {
      // 特殊处理，否则会裂开
      if (i < codePoints.length - 1 && codePoints[i + 1] === 0x200d) {
        continue
      }
      codePoints[i] = 0xfe0e
    }
    convertedCodePoints.push(codePoints[i])
  }
  // Convert code points back to string
  return String.fromCodePoint(...convertedCodePoints)
}
```

 

最后，只需要在标签中添加 `css` 样式设置字体就可以了，这里考虑到 `safari`的特殊性，需要为苹果系统额外改字体

```css
fontFamily: '"NotoEmoji", -apple-system, BlinkMacSystemFont'
```

