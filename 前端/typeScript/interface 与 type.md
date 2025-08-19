
## 拓展运算

### interface 拓展

```typescript
interface Test{
	a: string
}
interface Test1 extends Test{
	b: string
}
```

### type 拓展

```typescript
type Test = {
	a: string
}
type Test1 = Test & {
	b: string
}
```


### reopen

interface 支持 reopen 且自动合并，多次声明会合并结果