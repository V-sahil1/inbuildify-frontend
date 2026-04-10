'use client';
import { FC, useState } from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import { IconFilter, IconPlus } from '@tabler/icons-react';

export interface FilterOption {
  type: string;
  label: string;
  count?: number;
}

export interface TimelineActionsBarProps {
  tabs: FilterOption[];
  defaultActiveTab?: string;
  onTabChange?: (tab: string) => void;
  actionItems?: MenuProps['items'];
  onActionSelect?: (key: string) => void;
  isActionShow?: boolean;
  isCountShow?: boolean;
}

const TimelineActionsBar: FC<TimelineActionsBarProps> = ({
  tabs,
  defaultActiveTab = tabs[0]?.type,
  onTabChange,
  actionItems,
  onActionSelect,
  isActionShow = true,
  isCountShow = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const handleTabClick = (tabType: string) => {
    setActiveTab(tabType);
    onTabChange?.(tabType);
  };

  return (
    <div className="flex justify-between items-center w-full sm:flex-row flex-col">
      {/* Tabs Section */}
      <div className="flex items-center sm:gap-2 border border-gray-300 rounded-full sm:px-2 px-1 py-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.type}
            onClick={() => handleTabClick(tab.type)}
            className={`px-2 sm:px-3 py-1 sm:text-sm text-xs rounded-full transition flex gap-2
              ${
                activeTab === tab.type
                  ? 'bg-[--primary] text-white font-medium'
                  : 'hover:text-[--primary]'
              }
            `}
          >
            {tab.label}
            {isCountShow && (
              <div className="rounded-3xl bg-white text-gray-500 w-fit h-fit px-1">{tab.count}</div>
            )}
          </button>
        ))}
      </div>

      {/* Actions Section */}

      <div className="flex items-center gap-2 sm:mt-0 mt-2">
        {/* <button className="text-primary rounded p-1 border-2 border-primary">
          <IconFilter />
        </button> */}
        {activeTab === 'All' ? (
          <Dropdown
            menu={{
              items: actionItems,
              onClick: ({ key }) => onActionSelect?.(key),
            }}
            placement="bottomRight"
          >
            <Button type="primary" icon={<IconPlus />}>
              Action
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" icon={<IconPlus />} onClick={() => onActionSelect(activeTab)}>
            Add {activeTab}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimelineActionsBar;
