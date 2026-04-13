'use client';
import { FC, useState } from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import { IconPlus } from '@tabler/icons-react';

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
    <div className="flex w-full items-center justify-between gap-2">
      {/* Tabs Section */}
      <div className="flex max-w-full items-center gap-1 overflow-x-auto whitespace-nowrap rounded-full border border-gray-300 px-1 py-1 sm:gap-2 sm:px-2">
        {tabs.map(tab => (
          <button
            key={tab.type}
            onClick={() => handleTabClick(tab.type)}
            className={`flex shrink-0 gap-2 rounded-full px-2 py-1 text-xs whitespace-nowrap transition sm:px-3 sm:text-sm
              ${
                activeTab === tab.type
                  ? 'bg-[--primary] text-white font-medium'
                  : 'hover:text-[--primary]'
              }
            `}
          >
            {tab.label}
            {isCountShow && (
              <div className="h-fit w-fit rounded-3xl bg-white px-1 text-gray-500">{tab.count}</div>
            )}
          </button>
        ))}
      </div>

      {/* Actions Section */}

      {isActionShow && (
        <div className="flex shrink-0 items-center gap-2">
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
      )}
    </div>
  );
};

export default TimelineActionsBar;
