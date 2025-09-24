import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  IconAdjustmentsCog,
  IconCalendarMonth,
  IconChartFunnel,
  IconClockHour3,
  IconLabelImportant,
  IconProgress,
  IconServer2,
  IconSettingsBolt,
  IconTool,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { message } from "antd";
import { Status } from "@lib/constants/enum";
import { getDwellingTypes, getRanges } from "@redux/feature/types/typesThunk";
import Service from "./components/Service";
import LeadSource from "./components/LeadSource";
import WorkflowProcessPage from "./components/WorkflowProcess";
// import Configuration from "./components/Configuration";

const MasterPriceList = dynamic(() => import("./components/MasterPriceList"), {
  ssr: false,
});
const FloorPlan = dynamic(() => import("./components/FloorPlan"), {
  ssr: false,
});
const Facade = dynamic(() => import("./components/Facade"), { ssr: false });
const Package = dynamic(() => import("./components/Package"), { ssr: false });
const RangeAndDwelling = dynamic(
  () => import("./components/RangeAndDwelling"),
  { ssr: false }
);

const TABS = [
  // {
  //   id: "configuration",
  //   label: "Configuration",
  //   icon: IconSettingsBolt,
  //   breadcrumb: "Configuration",
  //   component: Configuration,
  // },
  {
    id: "range-dwelling",
    label: "Types",
    icon: IconChartFunnel,
    breadcrumb: "Types",
    component: RangeAndDwelling,
  },
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
  {
    id: "service",
    label: "Service",
    icon: IconTool,
    breadcrumb: "Service",
    component: Service,
  },
  {
    id: "lead-source",
    label: "Lead Source",
    icon: IconLabelImportant,
    breadcrumb: "Lead Source",
    component: LeadSource,
  },
  {
    id: "workflow-process",
    label: "Workflow Process",
    icon: IconAdjustmentsCog,
    breadcrumb: "Workflow Process",
    component: WorkflowProcessPage,
  },
];

export default function ProjectList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state: any) => state.types);
  const [projectSide, setProjectSide] = React.useState(false);

  useEffect(() => {
    const fetchTypesData = async () => {
      try {
        if (status?.range === Status.IDLE) {
          await dispatch(getRanges()).unwrap();
        }
        if (status?.dwellingType === Status.IDLE) {
          await dispatch(getDwellingTypes()).unwrap();
        }
      } catch (error) {
        message.error(error);
      }
    };
    fetchTypesData();
  }, [dispatch]);

  const tabId = searchParams.get("tab") || TABS[0].id;
  const selectedIndex = TABS.findIndex((tab) => tab.id === tabId);

  const handleTabSelect = (index: number) => {
    const tabId = TABS[index].id;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const breadcrumbItems = [
    { link: "Settings", url: "/settings" },
    { name: TABS[selectedIndex]?.breadcrumb || TABS[0].breadcrumb },
  ];

  return (
    <Tabs
      className="flex"
      selectedIndex={selectedIndex}
      onSelect={handleTabSelect}
      forceRenderTabPanel={true}
    >
      {/* Sidebar */}
      <div
        className={`bg-card-color min-w-[230px] w-[230px] p-4 xl:h-[calc(100svh-148px)] h-full overflow-auto custom-scrollbar lg:static fixed z-[1]
        transition-all duration-300 ${
          projectSide ? "left-0 rtl:right-0 " : "-left-full rtl:-right-full"
        }`}
      >
        <TabList>
          {TABS.map((tab) => {
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

      {/* Content */}
      <div
        className="flex-1 md:p-4 sm:px-3 py-4 xl:h-[calc(100svh-148px)] md:h-[calc(100svh-144px)] sm:h-[calc(100svh-176px)] overflow-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="container-fluid">
          <div className="flex items-center justify-between gap-4">
            <Breadcrumb breadcrumbItem={breadcrumbItems} />
            <button
              onClick={() => setProjectSide((prev) => !prev)}
              className={`hamburger-menu lg:hidden bg-primary p-1 rounded-md text-white ${
                projectSide ? "opened" : ""
              }`}
            >
              {/* hamburger svg */}
              <svg width="20" height="20" viewBox="0 0 100 100">
                <path
                  className="line line1"
                  d="M 20,29.000046 H 80.000231 ..."
                />
                <path className="line line2" d="M 20,50 H 80" />
                <path
                  className="line line3"
                  d="M 20,70.999954 H 80.000231 ..."
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
