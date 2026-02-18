import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchColourGroups } from '@redux/feature/color/colorThunk';

export const useColorGroupHook = () => {
  const dispatch = useAppDispatch();
  const { colorGroup, status } = useAppSelector((state: RootState) => state.colour);

  const fetchColorGroupData = async () => {
    try {
      await dispatch(fetchColourGroups()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch color group');
    }
  };

  useEffect(() => {
    if (status.group.fetch === Status.IDLE) {
      fetchColorGroupData();
    }
  }, [status.group.fetch]);

  const colorGroupOptions =
    colorGroup && colorGroup.length > 0
      ? colorGroup.map(type => ({
          label: type.name,
          value: type.colorGroupId,
        }))
      : [];

  return {
    colorGroupOptions,
    colorGroup,
    isLoading: status.group.fetch === Status.PENDING,
  };
};
