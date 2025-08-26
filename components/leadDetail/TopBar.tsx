import React from 'react';
import { Select, Tag } from 'antd';
import { IconListDetails } from '@tabler/icons-react';

interface TopBarProps {
  quotationId: string;
  version: string;
  status: string;
  range: string;
  dwellingType: string;
  onRangeChange: (value: string) => void;
  onDwellingTypeChange: (value: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  quotationId,
  version,
  status,
  range,
  dwellingType,
  onRangeChange,
  onDwellingTypeChange
}) => {
  const rangeOptions = [
    { label: 'Premium', value: 'Premium' },
    { label: 'Standard', value: 'Standard' },
    { label: 'Economy', value: 'Economy' }
  ];

  const dwellingOptions = [
    { label: 'Single Storey', value: 'Single Storey' },
    { label: 'Double Storey', value: 'Double Storey' },
    { label: 'Townhouse', value: 'Townhouse' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'blue';
      case 'Approved': return 'green';
      case 'Sent': return 'orange';
      default: return 'default';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-700">
            Quotation - {quotationId} ({version})
          </span>
          <Tag color={getStatusColor(status)}>{status}</Tag>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Range</span>
            <Select
              value={range}
              onChange={onRangeChange}
              className="w-32"
              size="small"
              options={rangeOptions}
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Dwelling Type</span>
            <Select
              value={dwellingType}
              onChange={onDwellingTypeChange}
              className="w-36"
              size="small"
              options={dwellingOptions}
            />
          </div>
          
          <IconListDetails  className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;