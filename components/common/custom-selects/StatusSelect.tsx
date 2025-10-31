import CustomSelect from './CustomSelect';

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

interface StatusSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
}

const StatusSelect: React.FC<StatusSelectProps> = ({ value, onChange, width }) => {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={statusOptions}
      placeholder="Status"
      width={width}
    />
  );
};

export default StatusSelect;
