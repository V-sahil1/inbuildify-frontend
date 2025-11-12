import CustomSelect from './CustomSelect';

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const activeInactiveOptions = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

interface StatusSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
  activeInactive?: boolean;
}

const StatusSelect: React.FC<StatusSelectProps> = ({ value, onChange, width, activeInactive = false }) => {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={activeInactive ? activeInactiveOptions : statusOptions}
      placeholder="Status"
      width={width}
    />
  );
};

export default StatusSelect;
