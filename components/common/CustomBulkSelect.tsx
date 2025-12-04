import { Select, Tag } from 'antd';
import { useMemo } from 'react';
// onchange is set to required as it is being calling in the form item and the form item managing the onchange and values prop
// when using only without the form item need to handkle the onchnage
// in form item pass as empty function for onchange
export const CustomBulkSelect = ({ value = [], onChange, options, className = '', placeholder = '' }) => {
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
      placeholder={placeholder}
      maxTagCount={2}
      tagRender={props => {
        if (props.value === ALL_VALUE) return null;
        return (
          <Tag closable onClose={props.onClose}>
            {props.label}
          </Tag>
        );
      }}
      options={[dynamicSelectAllOption, ...options]}
      className={className}
    />
  );
};
