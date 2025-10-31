import React from 'react';
import { Input, Select, Button } from 'antd';
import { IconSortAscending2, IconSortDescending2 } from '@tabler/icons-react';
import { QuotationStatus } from 'data/types';
const { Search } = Input;

interface LeadQuotationActionBarProps {
  quotationId?: string;
  status?: QuotationStatus;
  sortOrder?: 'asc' | 'desc';

  onSearch?: (value: string) => void;
  onStatusChange?: (value: QuotationStatus) => void;
  onSortChange?: (order: 'asc' | 'desc') => void;
  onReset?: () => void;
}

const LeadQuotationActionBar: React.FC<LeadQuotationActionBarProps> = ({
  quotationId,
  status = 'all',
  sortOrder = 'desc',
  onSearch,
  onStatusChange,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card-color ">
      {/* Left Section: Search + Status */}
      <div className="flex items-center gap-3">
        {/* Search Quotation ID */}

        <Search placeholder="Search" onSearch={onSearch} enterButton allowClear />

        {/* Filter by Status */}
        <Select
          value={status}
          style={{ width: 160 }}
          onChange={onStatusChange}
          defaultValue="all"
          options={[
            { label: 'All Status', value: 'all' },
            { label: 'Approved', value: 'approved' },
            { label: 'Pending', value: 'pending' },
            { label: 'Rejected', value: 'rejected' },
          ]}
        />
        <Button onClick={onReset} className="text-primary cursor-pointer">
          Reset Filter
        </Button>
      </div>

      {/* Right Section: Sort */}
      <Button
        icon={sortOrder === 'asc' ? <IconSortAscending2 /> : <IconSortDescending2 />}
        onClick={() => onSortChange?.(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        Sort by Created At
      </Button>
    </div>
  );
};

export default LeadQuotationActionBar;
