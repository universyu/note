# emoji

`emoji`可以由多个码点构成，这些码点有部分可能是老式的，如果要强制让其展示为文本模式（ 黑白色 ） ，需要让每个码点都用`FE0E`

```ts
  const codePoints = Array.from(emoji).map((char) => char.codePointAt(0) ?? 0)
  for (let i = 0; i < codePoints.length; i++) {
    if (codePoints[i] === 0xfe0f) {
      // 特殊处理，否则会裂开
      if (i < codePoints.length - 1 && codePoints[i + 1] === 0x200d) return emoji
      codePoints[i] = 0xfe0e
    }
  }
  return String.fromCodePoint(...codePoints)
```

另外，在`chrome131`中还需要加样式设计

```css
  fontVariantEmoji: 'text'
```

