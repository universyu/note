# relief

## 批量获取服务器数据

```ts
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

export async function promises<T extends Record<string, Promise<unknown>>>(
  obj: T,
  defaults: { [P in keyof T]?: Awaited<T[P]> } = {}
): Promise<{ [P in keyof T]: Awaited<T[P]> }> {
  const entities = Object.entries(obj)
  const results = await Promise.allSettled(entities.map(([, p]) => p))

  const ret: any = {}
  entities.forEach(([key], idx) => {
    const settled = results[idx]
    ret[key] = settled.status === 'fulfilled' ? settled.value : defaults[key]
  })

  return ret
}

```

