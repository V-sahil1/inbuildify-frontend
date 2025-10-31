import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { menuList } from './SidebarData';
import { IconChevronRight, IconChevronsDown } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { themeContext } from 'contexts/ThemeContext';

interface MenuDivider {
  devider?: string;
  color?: string;
  fontWeight?: string;
  link?: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
  roles?: string[];
}

interface MenuItem {
  link?: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
  roles?: string[];
}

type SidebarMenuItem = MenuDivider | MenuItem;

export default function Sidebar({
  setMobileNav,
}: {
  setMobileNav: (value: boolean) => void;
  note: boolean;
  toggleNote: () => void;
  chat: boolean;
  toggleChat: () => void;
}) {
  const pageUrl = useRouter().pathname;
  // const userRole = useSelector((state) => state.auth.user.role);
  const userRole = 'builder';
  const { isDarkMode } = useContext(themeContext);
  const [menuActive, setMenuActive] = useState<number>(0);
  const [menuActiveSub, setMenuActiveSub] = useState<number>(0);
  const router = useRouter();
  const pathname = router.pathname;
  const filteredMenuList = useMemo(() => {
    const hasAccess = (item: any) => !item.roles || item.roles.includes(userRole);

    const newMenuList = menuList(pathname)
      .map(item => {
        if ('devider' in item) return item;
        if (!hasAccess(item)) return null;

        const newItem = { ...item };

        if (newItem.children) {
          const filteredChildren = newItem.children
            .map((child: any) => {
              if (child.children) {
                const subChildren = child.children.filter(hasAccess);
                return subChildren.length ? { ...child, children: subChildren } : null;
              }
              return hasAccess(child) ? child : null;
            })
            .filter(Boolean);

          if (!filteredChildren.length) return null;
          newItem.children = filteredChildren;
        }

        return newItem;
      })
      .filter(Boolean);

    return newMenuList;
  }, [pathname, userRole]);

  const menuToggle = key => {
    setMenuActive(menuActive === key ? null : key);
  };

  const menuToggleSub = key => {
    setMenuActiveSub(menuActiveSub === key ? null : key);
  };

  return (
    <>
      <div className="sidebar-header px-3 mb-6 flex items-center justify-between gap-2">
        <h4 className="sidebar-title text-[24px]/[30px] font-medium mb-0">
          <Image
            src={isDarkMode ? '/company-dark.png' : '/company-light.png'}
            alt="logo"
            width={200}
            height={100}
          />
        </h4>
      </div>
      {/* <Search /> */}
      <ul className="sidebar-list px-3 mb-4 main-menu">
        {filteredMenuList.map((item: SidebarMenuItem, key: number) =>
          'link' in item && item?.children ? (
            <li key={key} className="sidebar-listitem">
              <button
                onClick={() => menuToggle(key)}
                className={`sidebar-list-button flex items-center gap-10 w-full py-10 transition-all hover:text-secondary ${
                  menuActive === key ? 'text-secondary' : ''
                }`}
              >
                {'icon' in item &&
                  React.createElement(item.icon, {
                    className: 'stroke-[1.5] w-[22px] h-[22px]',
                  })}
                <span className="link">{item.link}</span>
                {menuActive === key ? (
                  <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" />
                ) : (
                  <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                )}
              </button>
              <ul
                className={`sidebar-sublist ps-30 relative before:absolute before:h-full before:w-[1px] ltr:before:left-10 rtl:before:right-10 before:top-0 before:bg-secondary ${
                  menuActive === key ? 'block' : 'hidden'
                }`}
              >
                {item.children.map((res, key) =>
                  res.children ? (
                    <li key={key}>
                      <button
                        onClick={() => menuToggleSub(key)}
                        className={`flex items-center gap-10 w-full py-2 text-[14px]/[20px] relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-24px] rtl:before:right-[-24px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${
                          menuActiveSub === key ? 'text-secondary before:!block' : ''
                        }`}
                      >
                        <span>{res.link}</span>
                        {menuActiveSub === key ? (
                          <IconChevronsDown className="stroke-[1.5] w-[20px] h-[20px] ms-auto" />
                        ) : (
                          <IconChevronRight className="stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                        )}
                      </button>
                      <ul
                        className={`ps-30 relative before:absolute before:h-full before:w-[1px] ltr:before:left-10 rtl:before:right-10 before:top-0 before:bg-secondary ${
                          menuActiveSub === key ? 'block' : 'hidden'
                        }`}
                      >
                        {res.children.map((sub, key) => (
                          <li key={key}>
                            <Link
                              href={sub.url}
                              onClick={() => {
                                window.innerWidth < 1200 && setMobileNav(false);
                              }}
                              className={`py-1 text-[14px]/[20px] flex relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-24px] rtl:before:right-[-24px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${
                                pageUrl === sub.url ? 'text-secondary before:!block' : ''
                              }`}
                            >
                              {sub.link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={key}>
                      <Link
                        href={res.url}
                        onClick={() => {
                          window.innerWidth < 1200 && setMobileNav(false);
                        }}
                        className={`py-1 text-[14px]/[20px] flex relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-24px] rtl:before:right-[-24px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${
                          pageUrl === res.url ? 'text-secondary before:!block' : ''
                        }`}
                      >
                        {res.link}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </li>
          ) : item.url ? (
            <li key={key} className="sidebar-listitem">
              <Link
                href={item.url}
                onClick={() => {
                  window.innerWidth < 1200 && setMobileNav(false);
                }}
                className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${
                  pageUrl === item.url ? 'text-secondary' : ''
                }`}
              >
                {item?.icon ? (
                  // @ts-ignore
                  <item.icon className="stroke-[1.5] w-[22px] h-[22px] rtl:rotate-180" />
                ) : (
                  <IconChevronRight className="stroke-[1.5] w-[22px] h-[22px] rtl:rotate-180" />
                )}
                <span className="link">{item.link}</span>
              </Link>
            </li>
          ) : 'devider' in item ? (
            <li
              key={key}
              className={`devider py-3 menu-devider uppercase text-[12px]/[15px]${
                item.color ? ` text-${item.color}` : ''
              }${item.fontWeight ? ` font-${item.fontWeight}` : ''}`}
            >
              {item.devider}
            </li>
          ) : null
        )}
      </ul>
    </>
  );
}
