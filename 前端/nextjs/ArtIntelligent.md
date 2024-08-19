### ArtIntelligent

### next-intl

只能用在服务端组件

```tsx
import { useTranslations } from "next-intl";
export default function CreatePage() {
  const t = useTranslations('common');
  return (
    <>
       {t('create')}
    </>
  );
}
```



### Link

在服务端和客户端都可以用

需要利用`useLocale`来同步国际化

```tsx
import React from "react";
import { routes } from "../Constants";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { NormalLi } from "@/components/common";
type NavbarProps = {
  style?: React.CSSProperties;
};

const Navbar: React.FC<NavbarProps> = ({ style }) => {
  const locale = useLocale();
  const t = useTranslations("common");
  return (
    <nav>
      <ul>
        {routes.map((route) => {
          const href = `/${locale}/${route}`;
          return (
            <NormalLi key={route}>
              <Link href={href}>
                {t(route)}
              </Link>
            </NormalLi>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;

```

