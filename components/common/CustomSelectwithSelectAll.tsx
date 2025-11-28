import { Select, Tag } from 'antd';
import { useMemo } from 'react';

export const CustomSelectWithAutoSelectAll = ({ value = [], onChange, options }) => {
  const ALL_VALUE = 'All';
  const allValues = useMemo(() => options.map(o => o.value), [options]);
  const isAllSelected = value.length === allValues.length;
  const displayValue = value;
  const handleChange = selectedValues => {
    if (selectedValues.includes(ALL_VALUE)) {
      if (isAllSelected) {
        onChange([]);
      } else {
        onChange(allValues);
      }
      return;
    }
    onChange(selectedValues);
  };

  const dynamicSelectAllOption = isAllSelected
    ? { label: 'Unselect All', value: ALL_VALUE }
    : { label: 'Select All', value: ALL_VALUE };

  return (
    <Select
      mode="multiple"
      value={displayValue}
      onChange={handleChange}
      tagRender={props => {
        if (props.value === ALL_VALUE) return null;
        return (
          <Tag closable onClose={props.onClose}>
            {props.label}
          </Tag>
        );
      }}
      options={[dynamicSelectAllOption, ...options]}
    />
  );
};
