import CustomSelect from './CustomSelect';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';

interface RangeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
  disabled?: boolean;
}

const RangeSelect: React.FC<RangeSelectProps> = ({ value, onChange, width, disabled }) => {
  const { rangeOptions } = useDwellingAndRangeHook({ type: 'range' });
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={rangeOptions}
      placeholder="Range"
      width={width}
      disabled={disabled}
    />
  );
};

export default RangeSelect;
