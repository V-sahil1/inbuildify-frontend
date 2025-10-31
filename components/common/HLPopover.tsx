'use client';

import { useState } from 'react';
import { Popover, Input, List, message } from 'antd';
import { IconSearch } from '@tabler/icons-react';
import { data } from 'data/hlpackageData';

const HouseLandPopover = ({ children }: { children: React.ReactNode }) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPackages = data.filter(pkg =>
    pkg.packages.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover
      content={
        <div className="w-64 h-52">
          <div className="flex items-center bg-gray-100 rounded px-2 py-1 mb-2">
            <IconSearch size={16} className="text-gray-500 mr-1" />
            <Input
              size="small"
              placeholder="Search.."
              onChange={e => setSearchTerm(e.target.value)}
              value={searchTerm}
              className="border-none bg-transparent shadow-none focus:ring-0"
            />
          </div>

          <List
            size="small"
            className="overflow-y-auto"
            dataSource={filteredPackages}
            renderItem={item => (
              <List.Item
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  message.success(`Selected: ${item.packages}`);
                  setOpenPopover(false);
                }}
              >
                {item.packages}
              </List.Item>
            )}
          />
        </div>
      }
      title="House and Land Package"
      trigger="click"
      open={openPopover}
      onOpenChange={setOpenPopover}
      placement="bottom"
    >
      {children}
    </Popover>
  );
};

export default HouseLandPopover;
