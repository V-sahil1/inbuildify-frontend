import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { topMenu } from "./SidebarData";

export default function TopMenuBar() {
  const router = useRouter();
  const pageUrl = router.pathname;

  const activeMenu = useMemo(() => {
    const pagePath = pageUrl?.split("/")?.[1];
    const path = pagePath ? `/${pagePath}` : "/";
    const menu = topMenu.find((item) => item.path.startsWith(path));
    return menu;
  }, [pageUrl]);

  return (
    <nav className="w-full flex items-center px-4 z-10">
      <ul className="flex gap-4">
        {topMenu.map((menu) => (
          <li key={menu.title}>
            <button
              className={`sidebar-list-button flex items-center gap-10 w-full px-4 py-2 transition-all hover:text-secondary ${
                activeMenu?.path === menu.path ? "text-secondary" : ""
              }`}
              onClick={() => {
                router.replace(menu.path);
              }}
            >
              {menu.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
