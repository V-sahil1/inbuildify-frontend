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
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'nextWeek', label: 'Next Week' },
  { value: 'overdue', label: 'Overdue' },
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
        value={selectedFilter}
        onChange={handleChange}
        placeholder="Select date"
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
          <Button
            key="apply"
            type="primary"
            onClick={handleCustomFilter}
            disabled={!customDates}
          >
            Apply
          </Button>,
        ]}
      >
        <RangePicker
          style={{ width: '100%' }}
          onChange={(dates) => setCustomDates(dates as [Dayjs, Dayjs])}
        />
      </Modal>
    </>
  );
};

export default DateFilterDropdown;