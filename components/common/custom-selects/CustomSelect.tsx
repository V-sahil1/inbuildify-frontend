// components/common/custom-selects/CustomSelect.tsx
import { Select, SelectProps } from 'antd';
import { IconChevronDown } from '@tabler/icons-react';

interface CustomSelectProps extends SelectProps {
  options: Array<{ value: string; label: string }>;
  width?: number | string;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  options, 
  width = '100%',
  placeholder = 'Select...',
  ...restProps 
}) => {
  return (
    <Select
      {...restProps}
      style={{ width }}
      className="custom-select"
      suffixIcon={<IconChevronDown size={14} />}
      placeholder={placeholder}
      popupClassName="custom-select-dropdown"
    >
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default CustomSelect;