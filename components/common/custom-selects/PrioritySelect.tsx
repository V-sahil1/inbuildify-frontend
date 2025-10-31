import CustomSelect from './CustomSelect';

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

interface PrioritySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
}

const PrioritySelect: React.FC<PrioritySelectProps> = ({ value, onChange, width = 120 }) => {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={priorityOptions}
      placeholder="Priority"
      width={width}
    />
  );
};

export default PrioritySelect;
