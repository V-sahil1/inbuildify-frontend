import { useState } from 'react';
import { Select, DatePicker, Modal, Button } from 'antd';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DateFilterDropdownProps {
  onFilter: (type: string, dates?: [Dayjs, Dayjs]) => void;
  onClear: () => void;
}

const filterOptions = [
  { value: '', label: 'All' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_15_days', label: 'Last 15 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range...' },
];

const DateFilterDropdown: React.FC<DateFilterDropdownProps> = ({ onFilter, onClear }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customDates, setCustomDates] = useState<[Dayjs, Dayjs] | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleChange = (value: string) => {
    if (value === 'custom') {
      setIsModalOpen(true);
    } else {
      setSelectedFilter(value);
      onFilter(value);
    }
  };

  const handleCustomFilter = () => {
    if (customDates) {
      setSelectedFilter('custom');
      onFilter('custom', customDates);
      setIsModalOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedFilter(null);
    onClear();
  };

  return (
    <>
      <Select
        size="middle"
        value={selectedFilter}
        onChange={handleChange}
        allowClear
        placeholder="Select date"
        style={{ width: '100%' }}
      >
        {filterOptions.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>

      <Modal
        title="Select Date Range"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={handleCustomFilter} disabled={!customDates}>
            Apply
          </Button>,
        ]}
      >
        <RangePicker
          style={{ width: '100%' }}
          onChange={dates => setCustomDates(dates as [Dayjs, Dayjs])}
        />
      </Modal>
    </>
  );
};

export default DateFilterDropdown;
