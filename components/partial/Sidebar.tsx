import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { menuList } from './SidebarData';
import {
  IconIndentDecrease,
  IconIndentIncrease,
  IconChevronRight,
  IconChevronsDown,
} from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { themeContext } from 'contexts/ThemeContext';
import { Tooltip } from 'antd';

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
  onClick?: () => void;
}

type SidebarMenuItem = MenuDivider | MenuItem;

export default function Sidebar({
  mobileNav,
  setMobileNav,
  toggleMiniSidebar,
  miniSidebar,
}: {
  mobileNav: boolean;
  setMobileNav: (value: boolean) => void;
  toggleMiniSidebar?: () => void;
  miniSidebar?: boolean;
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
  const [expandedMenuKey, setExpandedMenuKey] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    right: number;
  } | null>(null);
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

  const menuToggle = (key: number, event?: React.MouseEvent) => {
    if (miniSidebar) {
      // In mini mode, handle outer menu positioning
      if (expandedMenuKey === key) {
        setExpandedMenuKey(null);
        setMenuPosition(null);
      } else {
        setExpandedMenuKey(key);
        if (event) {
          const rect = (event.target as HTMLElement).getBoundingClientRect();
          setMenuPosition({
            top: rect.bottom,
            left: rect.right,
            right: rect.right,
          });
        }
      }
    } else {
      setMenuActive(menuActive === key ? null : key);
    }
  };

  const closeOuterMenu = () => {
    setExpandedMenuKey(null);
    setMenuPosition(null);
  };

  const menuToggleSub = key => {
    setMenuActiveSub(menuActiveSub === key ? null : key);
  };

  return (
    <>
      <div
        className={`sidebar-header px-1 ${!miniSidebar ? 'mb-6' : ''} flex items-end justify-between gap-2`}
      >
        {!miniSidebar && (
          <h4 className="sidebar-title text-[24px]/[30px] font-medium mb-0">
            <Image
              src={isDarkMode ? '/company-dark.png' : '/company-light.png'}
              alt="logo"
              width={200}
              height={100}
              className="cursor-pointer"
              onClick={() => {
                router.push('/');
              }}
            />
          </h4>
        )}
        <div onClick={toggleMiniSidebar}>
          {miniSidebar ? (
            <IconIndentIncrease
              className={`arrow-icon stroke-[1.5] w-[28px] h-[28px] ms-auto rtl:rotate-180`}
            />
          ) : (
            <IconIndentDecrease
              className={`arrow-icon stroke-[1.5] w-[28px] h-[28px] ms-auto rtl:rotate-180`}
            />
          )}
        </div>
      </div>
      {/* <Search /> */}
      <ul className="sidebar-list px-3 mb-4 main-menu">
        {miniSidebar && (
          <li className="sidebar-listitem py-10">
            <Image
              src={'/logo.webp'}
              alt="logo"
              width={30}
              height={30}
              className="cursor-pointer transition-all"
              onClick={() => {
                router.push('/');
              }}
            />
          </li>
        )}
        {filteredMenuList.map((item: SidebarMenuItem, key: number) => {
          if ('link' in item && item?.children) {
            return (
              <li key={key} className="sidebar-listitem">
                <button
                  onClick={e => menuToggle(key, e)}
                  className={`sidebar-list-button flex items-center gap-10 w-full py-10 transition-all hover:text-secondary ${
                    menuActive === key ? 'text-secondary' : ''
                    }`}
                >
                  <Tooltip title={item.link} placement="right">
                    {'icon' in item &&
                      React.createElement(item.icon, {
                        className: 'stroke-[1.5] w-[22px] h-[22px]',
                      })}
                  </Tooltip>

                  {!miniSidebar && <span className="link">{item.link}</span>}
                  {!miniSidebar &&
                    item?.children &&
                    (menuActive === key ? (
                      <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" />
                    ) : (
                      <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                    ))}
                </button>
                {!miniSidebar && (
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
                              <li key={key} onClick={() => sub.onClick?.()}>
                                {sub.url ? (
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
                                ) : (
                                  <span
                                    className={`py-1 text-[14px]/[20px] cursor-pointer flex relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-24px] rtl:before:right-[-24px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${
                                      pageUrl === sub.url ? 'text-secondary before:!block' : ''
                                      }`}
                                  >
                                    {sub.link}
                                  </span>
                                )}
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
                )}
              </li>
            );
          } else if (item.url) {
            return (
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
                  <Tooltip title={item?.link} placement="right">
                    {item?.icon ? (
                      // @ts-ignore
                      <item.icon className="stroke-[1.5] w-[22px] h-[22px] rtl:rotate-180" />
                    ) : (
                      <IconChevronRight className="stroke-[1.5] w-[22px] h-[22px] rtl:rotate-180" />
                    )}
                  </Tooltip>

                  {!miniSidebar && <span className="link">{item.link}</span>}
                </Link>
              </li>
            );
          } else if ('devider' in item) {
            return (
              <li
                key={key}
                className={`devider py-3 menu-devider uppercase text-[12px]/[15px]${
                  item.color ? ` text-${item.color}` : ''
                  }${item.fontWeight ? ` font-${item.fontWeight}` : ''}`}
              >
                {!miniSidebar && item.devider}
              </li>
            );
          } else {
            return null;
          }
        })}
      </ul>

      {/* Outer Menu for Mini Sidebar */}
      {miniSidebar && expandedMenuKey !== null && menuPosition && (
        <div
          className="fixed bg-card-color border border-border-color rounded-lg shadow-shadow-lg py-2 min-w-[200px] z-50"
          style={{
            top: `${menuPosition.top - 30}px`,
            left: `${menuPosition.right + 20}px`,
          }}
        >
          {/* Arrow indicator at top-left */}
          <div
            className="absolute -left-2 top-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-card-color border-b-[8px] border-b-transparent"
            style={{
              borderRightColor: 'var(--card-color)',
              position: 'absolute',
            }}
          />
          {filteredMenuList.map((item: SidebarMenuItem, key: number) => {
            if ('link' in item && item?.children && key === expandedMenuKey) {
              return item.children.map((res, childKey) => (
                <div key={`${key}-child-${childKey}`}>
                  {res.children ? (
                    <div>
                      <button
                        onClick={() => menuToggleSub(childKey)}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-body-color transition-colors ${
                          menuActiveSub === childKey ? 'bg-body-color' : ''
                          }`}
                      >
                        {res?.icon && (
                          <res.icon className="stroke-[1.5] w-[16px] h-[16px] text-font-color" />
                        )}

                        <span className="text-font-color">{res.link}</span>
                        <div className="ms-auto">
                          {menuActiveSub === childKey ? (
                            <IconChevronsDown className="stroke-[1.5] w-[16px] h-[16px] text-font-color" />
                          ) : (
                            <IconChevronRight className="stroke-[1.5] w-[14px] h-[14px] text-font-color" />
                          )}
                        </div>
                      </button>
                      {menuActiveSub === childKey && (
                        <div className="ml-4">
                          {res.children.map((sub, subKey) => (
                            <button
                              key={subKey}
                              onClick={() => {
                                if (sub.onClick) sub.onClick();
                                if (sub.url) {
                                  router.push(sub.url);
                                }
                                closeOuterMenu();
                              }}
                              className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-body-color transition-colors ${
                                pageUrl === sub.url ? 'bg-body-color' : ''
                                }`}
                            >
                              {sub?.icon && (
                                <sub.icon className="stroke-[1.5] w-[14px] h-[14px] text-font-color" />
                              )}

                              <span className="text-font-color">{sub.link}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      key={`${key}-child-${childKey}`}
                      onClick={() => {
                        if (res.onClick) res.onClick();
                        if (res.url) {
                          router.push(res.url);
                        }
                        closeOuterMenu();
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-body-color transition-colors ${
                        pageUrl === res.url ? 'bg-body-color' : ''
                        }`}
                    >
                      {res?.icon && (
                        <res.icon className="stroke-[1.5] w-[16px] h-[16px] text-font-color" />
                      )}

                      <span className="text-font-color">{res.link}</span>
                    </button>
                  )}
                </div>
              ));
            }
            return null;
          })}
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {miniSidebar && expandedMenuKey !== null && (
        <div className="fixed inset-0 z-40" onClick={closeOuterMenu} />
      )}
    </>
  );
}
