import CustomSelect from './CustomSelect';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';

interface DwellingTypeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
  disabled?: boolean;
}

const DwellingTypeSelect: React.FC<DwellingTypeSelectProps> = ({
  value,
  onChange,
  width,
  disabled,
}) => {
  const { dwellingTypeOptions } = useDwellingAndRangeHook({ type: 'dwellingType' });
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={dwellingTypeOptions}
      placeholder="Dwelling Type"
      width={width}
      disabled={disabled}
    />
  );
};

export default DwellingTypeSelect;
