import { useAppDispatch } from '@hooks/redux';
import CustomSelect from './CustomSelect';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { CustomSelectOption, CustomSelectProps } from 'types/common.types';
import { getLeadSourcesThunk } from '@redux/feature/lead/leadThunk';
import { LeadSource } from '@redux/feature/lead/ILeadState';
import { enumToReadable } from '@lib/utils/enumToRedable';

const SourceSelect: React.FC<CustomSelectProps> = ({ value, onChange, width }) => {
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(getLeadSourcesThunk()).unwrap();
        setLeadSources(response || []);
      } catch (error) {
        message.error(error instanceof Error ? error.message : 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, [dispatch]);

  const leadSourceOptions = leadSources.reduce((acc, source) => {
    acc.push({
      label: enumToReadable(source?.name),
      value: source?.leadSourceId,
    });
    return acc;
  }, [] as CustomSelectOption[]);

  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={leadSourceOptions}
      placeholder="Source"
      width={width}
      showSearch
      optionFilterProp="label"
      filterOption={(input, option) =>
        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export default SourceSelect;
