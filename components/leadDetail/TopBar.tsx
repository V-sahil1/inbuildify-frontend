import React, { useEffect } from 'react';
import { Select, Tag } from 'antd';
import { IconListDetails } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getFloorPlanFilters } from '@redux/feature/floorPlan/floorPlanThunk';
import { Status } from '@lib/constants/enum';
import { enumArrayToOptions } from '@lib/utils/enumArrayToOptionsConvert';

interface TopBarProps {
  quotationId: string;
  version: string;
  status: string;
  onRangeChange: (value: string) => void;
  onDwellingTypeChange: (value: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  quotationId,
  version,
  status,
  onRangeChange,
  onDwellingTypeChange
}) => {
  const { filters, status: floorPlanStatus } = useAppSelector((state) => state.floorPlan);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (floorPlanStatus === Status.IDLE) {
      dispatch(getFloorPlanFilters());
    }
  }, [floorPlanStatus, dispatch]);
  const rangeOptions = enumArrayToOptions(filters?.ranges);

  const dwellingOptions = enumArrayToOptions(filters?.dwellingTypes);

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
              value={filters?.ranges[0]}
              onChange={onRangeChange}
              className="w-32"
              size="small"
              options={rangeOptions}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Dwelling Type</span>
            <Select
              value={filters?.dwellingTypes[0]}
              onChange={onDwellingTypeChange}
              className="w-36"
              size="small"
              options={dwellingOptions}
            />
          </div>

          <IconListDetails className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;