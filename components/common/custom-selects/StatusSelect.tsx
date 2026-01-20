import CustomSelect from './CustomSelect';

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const activeInactiveOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const approveOptions = [
  { value: '', label: 'All' },
  { value: 'approved', label: 'Approved' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'modified', label: 'Modified' },
  { value: 'expired', label: 'Expired' },
];
interface StatusSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
  activeInactive?: boolean;
  approveOption?: boolean;
}

const StatusSelect: React.FC<StatusSelectProps> = ({ value, onChange, width, activeInactive = false, approveOption = false }) => {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={approveOption ? approveOptions : activeInactive ? activeInactiveOptions : statusOptions}
      placeholder="Status"
      width={width}
    />
  );
};

export default StatusSelect;
