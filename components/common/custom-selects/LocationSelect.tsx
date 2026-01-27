import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import CustomSelect from './CustomSelect';

interface LocationSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
  disabled?: boolean;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ value, onChange, width, disabled }) => {
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });
  return (
    locationOptions.length > 0 && (
      <CustomSelect
        value={value}
        onChange={onChange}
        options={locationOptions}
        placeholder="Location"
        width={width}
        disabled={disabled}
      />
    )
  );
};

export default LocationSelect;
