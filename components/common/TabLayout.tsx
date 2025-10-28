"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import Breadcrumb from "@/components/common/Breadcrumb";

interface TabItem {
  id: string;
  label: string | React.ReactNode;
  icon?: React.ElementType;
  breadcrumb?: string;
  component: React.ComponentType<any>;
}

interface TabLayoutProps {
  tabs: TabItem[];
  breadcrumbBase?: { link: string; url: string };
  className?: string;
}

export default function TabLayout({ tabs, breadcrumbBase, className }: TabLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabId = searchParams.get("tab") || tabs[0]?.id;
  const selectedIndex = tabs.findIndex((tab) => tab.id === tabId);

  const handleTabSelect = (index: number) => {
    const selectedTabId = tabs[index].id;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", selectedTabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const breadcrumbItems = [
    ...(breadcrumbBase ? [breadcrumbBase] : []),
    { name: tabs[selectedIndex]?.breadcrumb || tabs[0]?.breadcrumb },
  ];

  return (
    <Tabs
      className={`flex ${className || ""}`}
      selectedIndex={selectedIndex}
      onSelect={handleTabSelect}
      forceRenderTabPanel
    >
      {/* Sidebar */}
      <div
        className={`bg-card-color min-w-[230px] w-[230px] p-4 
        xl:h-[calc(100svh-148px)] h-full overflow-auto custom-scrollbar 
        lg:static fixed z-[1] transition-all duration-300 
        left-0 rtl:right-0`}
      >
        <TabList>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.id}
                className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0"
                selectedClassName="text-primary"
              >
                {tab.icon && <Icon className="w-[20px] h-[20px]" />}
                {tab.label}
              </Tab>
            );
          })}
        </TabList>
      </div>

      <div
        className="flex-1 md:p-4 sm:px-3 py-4 
        xl:h-[calc(100svh-148px)] md:h-[calc(100svh-144px)] sm:h-[calc(100svh-176px)] 
        overflow-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="container-fluid">
         {breadcrumbBase && <div className="flex items-center justify-between gap-4">
            <Breadcrumb breadcrumbItem={breadcrumbItems} />
          </div>}

          {tabs.map((tab, index) => {
            const TabComponent = tab.component;
            return (
              <TabPanel key={tab.id}>
                {selectedIndex === index && <TabComponent />}
              </TabPanel>
            );
          })}
        </div>
      </div>
    </Tabs>
  );
}
