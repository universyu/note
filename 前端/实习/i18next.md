# i18next

导入

```tsx
import enJson from '@src/assets/locales/en.json'
import zhJson from '@src/assets/locales/zh.json'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
```

初始化

```tsx
  i18n.use(initReactI18next).init({
    resources: {
      en: { ...enJson },
      zh: { ...zhJson },
    },
    lng: lang,
  })
```

使用（里面的组件需要有一个参数lang）

```tsx
    <I18nextProvider i18n={i18n}>
			...
    </I18nextProvider>
```

