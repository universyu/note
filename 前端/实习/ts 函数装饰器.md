# ts 函数装饰器

下面的程序将 `api` 封装成会 `loading` 的版本

```ts
type ApiFunction<T> = (...args: any[]) => Promise<T>

export function apiWithLoading<T>(
  apiFunc: ApiFunction<T>,
  setLoading: (loading: boolean) => void
): ApiFunction<T> {
  return async (...args: any[]): Promise<T> => {
    try {
      setLoading(true)
      const result = await apiFunc(...args)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }
}

```

