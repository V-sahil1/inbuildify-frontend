import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  IconCalendarMonth,
  IconClockHour3,
  IconProgress,
  IconServer2,
} from "@tabler/icons-react";
import { getFloorPlanFilters } from "@redux/feature/floorPlan/floorPlanThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
// Dynamically import components with no SSR
const MasterPriceList = dynamic(() => import("./components/MasterPriceList"), {
  ssr: false,
});
const FloorPlan = dynamic(() => import("./components/FloorPlan"), {
  ssr: false,
});
const Facade = dynamic(() => import("./components/Facade"), { ssr: false });
const Package = dynamic(() => import("./components/Package"), { ssr: false });

const TABS = [
  {
    id: "items",
    label: "Master Pricing",
    icon: IconServer2,
    breadcrumb: "Master Pricing",
    component: MasterPriceList,
  },
  {
    id: "floor-plan",
    label: "Floor Plan",
    icon: IconProgress,
    breadcrumb: "Floor Plan",
    component: FloorPlan,
  },
  {
    id: "facade",
    label: "Facade",
    icon: IconClockHour3,
    breadcrumb: "Facade",
    component: Facade,
  },
  {
    id: "package",
    label: "Package",
    icon: IconCalendarMonth,
    breadcrumb: "Package",
    component: Package,
  },
];

export default function ProjectList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [projectSide, setProjectSide] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: any) => state.floorPlan.filters);
  useEffect(() => {
    if (!filters) {
      dispatch(getFloorPlanFilters());
    }
  }, [dispatch, filters]);
  const getActiveTabIndex = useCallback(() => {
    const tabId = searchParams.get("tab") || TABS[0].id;
    return Math.max(
      0,
      TABS.findIndex((tab) => tab.id === tabId)
    );
  }, [searchParams]);

  const [selectedIndex, setSelectedIndex] = useState(getActiveTabIndex());

  const handleTabSelect = (index: number) => {
    if (index === selectedIndex) return; // Prevent unnecessary updates

    setSelectedIndex(index);
    const tabId = TABS[index].id;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const newIndex = getActiveTabIndex();
    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
    }
  }, [searchParams, getActiveTabIndex, selectedIndex]);

  const projectSideToggle = () => {
    setProjectSide(!projectSide);
  };

  const breadcrumbItems = [
    {
      link: "Settings",
      url: "/settings",
    },
    {
      name: TABS[selectedIndex]?.breadcrumb || TABS[0].breadcrumb,
    },
  ];

  return (
    <Tabs
      className="flex"
      selectedIndex={selectedIndex}
      onSelect={handleTabSelect}
      forceRenderTabPanel={true}
    >
      <div
        className={`bg-card-color min-w-[230px] w-[230px] p-4 ms-[2px] mt-[2px] xl:h-[calc(100svh-77px)] md:h-[calc(100svh-73px)] h-[calc(100svh-60px)] overflow-auto custom-scrollbar lg:static fixed z-[1]
 transition-all duration-300 ${
   projectSide
     ? "left-0 rtl:right-0 shadow-shadow-lg"
     : "-left-full rtl:-right-full"
 }`}
      >
        <TabList>
          {TABS.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.id}
                className="flex items-center gap-3 font-semibold py-2 cursor-pointer hover:text-primary focus:outline-0"
                selectedClassName="text-primary"
              >
                <Icon className="w-[20px] h-[20px]" />
                {tab.label}
              </Tab>
            );
          })}
        </TabList>
      </div>
      <div className="flex-1 md:p-4 sm:px-3 py-4 xl:h-[calc(100svh-77px)] lg:h-[calc(100svh-73px)] overflow-auto custom-scrollbar">
        <div className="container-fluid">
          <div className="flex items-center justify-between gap-4">
            <Breadcrumb breadcrumbItem={breadcrumbItems} />
            <button
              onClick={projectSideToggle}
              className={`hamburger-menu lg:hidden bg-primary p-1 rounded-md text-white ${
                projectSide ? "opened" : ""
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 100 100">
                <path
                  className="line line1"
                  d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
                />
                <path className="line line2" d="M 20,50 H 80" />
                <path
                  className="line line3"
                  d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
                />
              </svg>
            </button>
          </div>
          {TABS.map((tab, index) => {
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
