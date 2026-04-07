import { Select, Tag } from 'antd';
import { useMemo } from 'react';
import NoDataMessage from './NoDataMessage';
// onchange is set to required as it is being calling in the form item and the form item managing the onchange and values prop
// when using only without the form item need to handkle the onchnage
// in form item pass as empty function for onchange
export const CustomBulkSelect = ({
  value = [],
  onChange,
  options,
  className = '',
  placeholder = '',
  notFoundContent = null,
  noDataLabel = '',
  noDataLink = '',
}) => {
  const ALL_VALUE = 'All';
  const allValues = useMemo(() => options.map(o => o.value), [options]);
  const isAllSelected = value?.length === allValues.length;
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

  const defaultNotFoundContent =
    noDataLabel && noDataLink ? <NoDataMessage label={noDataLabel} link={noDataLink} /> : null;

  const selectOptions = options.length > 0 ? [dynamicSelectAllOption, ...options] : options;

  return (
    <Select
      mode="multiple"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      maxTagCount={2}
      filterOption={(input, option) =>
        (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
      }
      tagRender={props => {
        if (props.value === ALL_VALUE) return null;
        const isTruncatedTag = props.label?.toString().includes('+');

        return (
          <Tag
            closable
            onClose={() => {
              if (isTruncatedTag) {
                const maxTagCount = 2;
                const visibleItems = value.slice(0, maxTagCount);
                onChange(visibleItems);
              } else {
                props.onClose();
              }
            }}
          >
            {props.label}
          </Tag>
        );
      }}
      options={selectOptions}
      className={className}
      notFoundContent={notFoundContent || defaultNotFoundContent}
    />
  );
};
