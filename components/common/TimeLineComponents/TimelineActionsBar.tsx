'use client';
import { FC } from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import { IconFilter, IconPlus } from '@tabler/icons-react';

export interface FilterOption {
  type: string;
  label: string;
  count?: number;
}
export interface TimelineActionsBarProps {
  tabs: FilterOption[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  actionItems?: MenuProps['items'];
  onActionSelect?: (key: string) => void;
  isActionShow?: boolean;
  isCountShow?: boolean;
}

const TimelineActionsBar: FC<TimelineActionsBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  actionItems,
  onActionSelect,
  isActionShow = true,
  isCountShow = false,
}) => {
  return (
    <div className="flex justify-between items-center w-full sm:flex-row flex-col">
      {/* Tabs Section */}
      <div className="flex items-center sm:gap-2 border border-gray-300 rounded-full sm:px-2 px-1 py-1 w-fit">
        {tabs.map(tab => (
          <div className="flex">
            <button
              key={tab.type}
              onClick={() => onTabChange(tab.type)}
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
                <div className=" rounded-3xl bg-white text-gray-500 w-fit h-fit px-1">
                  {tab.count}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Actions Section */}
      {isActionShow && (
        <div className="flex items-center gap-2 sm:mt-0 mt-2">
          <button className="text-primary rounded p-1 border-2  border-primary">
            <IconFilter />
          </button>
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
        </div>
      )}
    </div>
  );
};

export default TimelineActionsBar;
