'use client';
import { CustomSelectOption, CustomSelectProps } from 'types/common.types';
import CustomSelect from './CustomSelect';

const ratingOptions: CustomSelectOption[] = [
  { value: 'hot', label: 'Hot' },
  { value: 'warm', label: 'Warm' },
  { value: 'cold', label: 'Cold' },
];

const RatingSelect = ({ value, onChange, width }: CustomSelectProps) => {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={ratingOptions}
      placeholder="Rating"
      width={width}
    />
  );
};

export default RatingSelect;
