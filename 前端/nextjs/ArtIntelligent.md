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



### 根标签占满屏幕

为了防止出现多个body，需要将root设置占满屏幕

```css
:root {
    width: 100vw;
    height: 100vh;
  }
```

设置body占满root

```css
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
```

如果确保页面的高度导致需要做scroll，而且希望让渐变色保留，那么就设置fit，但是这会导致那些高度不够的页面无法正常显示

```css
:root {
    width: 100vw;
    height: fit-content;
    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 0, 0, 0; 
    --background-end-rgb: 90, 24, 154;
  }
  body {
    margin: 0;
    padding: 0;
    height: fit-content;
    width: 100%;
    color: rgb(var(--foreground-rgb));
    background: linear-gradient(
        to top,
        transparent,
        rgb(var(--background-end-rgb))
      )
      rgb(var(--background-start-rgb));
      background-repeat: no-repeat; 
  }
```



### 服务端和客户端冲突

国际化的t只能在服务端使用，而hooks需要在客户端使用，为了两者共存，可以额外写一个组件

`Navbar.tsx`

```tsx
import React from "react";
import { routes, RouteKey } from "../Constants";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { NormalLi, ColorfulButton } from "@/components/common";
import NavbarClient from "@/components/NavbarClient";

type NavbarProps = {
  style?: React.CSSProperties;
};

const Navbar: React.FC<NavbarProps> = ({ style }) => {
  const locale = useLocale();
  const t = useTranslations("common");

  return (
    <NavbarClient topText={t("top")}>
      <ul
        style={{
          display: "flex",
          gap: "5em",
          padding: 0,
          margin: 0,
          listStyleType: "none",
        }}
      >
        {Object.keys(routes).map((routeKey) => {
          const key = routeKey as RouteKey;
          const href = `/${locale}${routes[key]}`;
          return (
            <NormalLi key={routeKey}>
              <Link href={href}>
                <ColorfulButton>{t(routeKey)}</ColorfulButton>
              </Link>
            </NormalLi>
          );
        })}
      </ul>
    </NavbarClient>
  );
};

export default Navbar;
```



`NavbarClient.tsx`

```tsx
'use client';

import React, { useState, useEffect } from "react";
import { ColorfulButton } from "@/components/common";

type NavbarClientProps = {
  topText: string;
  children: React.ReactNode;
};

const NavbarClient: React.FC<NavbarClientProps> = ({ topText, children }) => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      setSticky(scrolled ? true : false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "70em",
        alignItems: "center",
        padding: "1em 5em",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: sticky ? "linear-gradient(to right, rgba(212, 252, 121, 0.2), rgba(150, 230, 161, 0.2))" : "transparent",
        transition: "background 0.3s ease",
      }}
    >
      <div>
        <ColorfulButton onClick={handleScrollToTop}>
          {topText}
        </ColorfulButton>
      </div>
      {children}
    </nav>
  );
};

export default NavbarClient;
```

