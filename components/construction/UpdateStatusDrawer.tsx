import { Button, Checkbox, Drawer, Input, Radio, Tag } from 'antd';
import TimelineActionsBar from '../common/TimeLineComponents/TimelineActionsBar';
import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';

export function UpdateStatusDrawer({ open, onCancel, checkItems }) {
  type FilterType = 'all' | 'applicable' | 'notApplicable';
  const [activeFilter, setActiveFilter] = useState<{
    type: FilterType;
    label: string;
  }>({ type: 'all', label: 'All' });

  const filterOptions: Array<{
    type: FilterType;
    label: string;
  }> = [
    { type: 'all', label: 'All' },
    { type: 'applicable', label: 'Applicable' },
    { type: 'notApplicable', label: 'Not Applicable' },
  ];
  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
    setActiveFilter(filterOptions.find(f => f.type === selectedType) || activeFilter);
  };
  return (
    <Drawer title="Mark As Applicable / Not Applicable" open={open} onClose={onCancel} size="large">
      <div>
        <div className="flex gap-6 items-center">
          <div>Show Records</div>
          <div>
            {' '}
            <TimelineActionsBar
              tabs={filterOptions.map(f => ({ type: f.type, label: f.label }))}
              activeTab={activeFilter.type}
              onTabChange={handleFilterTabChange}
              isActionShow={false}
              isCountShow={true}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex gap-2 items-center">
            <Checkbox />
            <p>Select All</p>
          </div>
          <div>
            {' '}
            <Input addonBefore={<IconSearch />} placeholder="Search Checklist" />
          </div>
        </div>
        <div className="mt-3">
          {checkItems.map(item => (
            <div className="flex gap-2 border-b-[1px] py-3">
              <Checkbox />
              <p>{item.values.checklist}</p>
              {item.isDefect && <Tag color="orange">Defect</Tag>}
            </div>
          ))}
        </div>
        <div className="mt-3 justify-end flex gap-2">
          <Button>Cancel</Button>
          <Button type="primary">Mark As Applicable</Button>
          <Button type="primary">Mark As Not Applicable</Button>
        </div>
      </div>
    </Drawer>
  );
}
