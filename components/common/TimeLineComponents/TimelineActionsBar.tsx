"use client";
import { FC } from "react";
import { Button, Dropdown, MenuProps } from "antd";
import { IconFilter2, IconPlus } from "@tabler/icons-react";

export interface TimelineActionsBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  actionItems: MenuProps["items"];
  onActionSelect?: (key: string) => void;
}

const TimelineActionsBar: FC<TimelineActionsBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  actionItems,
  onActionSelect,
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      {/* Tabs Section */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-full px-2 py-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-3 py-1 text-sm rounded-full transition 
              ${activeTab === tab
                ? "bg-[--primary] text-[--font-color-contrast] font-medium"
                : "hover:text-[--primary]"
              }
              `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-2">
        <Button
          icon={<IconFilter2 />}
          className="border-gray-300"
        />
        <Dropdown
          menu={{
            items: actionItems,
            onClick: ({ key }) => onActionSelect?.(key),
          }}
          placement="bottomRight"
        >
          <Button
            type="primary"
            icon={<IconPlus />}
          >
            Action
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default TimelineActionsBar;
