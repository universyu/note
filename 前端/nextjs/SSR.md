# SSR

### getServerSideProps 

在进入页面或者刷新时会调用`getServerSideProps `，可以获取到变量并作为参数传给页面的组件，在服务器渲染出HTML并发到客户端

#### 示例

```tsx
export const getServerSideProps: GetServerSideProps<PropsType> = async (ctx) => {
  const result = await promises(
    {
      reasonList: API.operationadmin.listReason({ reasonType: 'freeCredits' }),
    },
    {
      reasonList: { reasons: [] },
    }
  )

  return {
    props: {
      reasonList: result.reasonList.reasons,
    },
  }
}
```

