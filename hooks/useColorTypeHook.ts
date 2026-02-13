import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchColourType } from '@redux/feature/color/colorThunk';

export const useColorTypeHook = () => {
  const dispatch = useAppDispatch();
  const { colorType, status } = useAppSelector((state: RootState) => state.colour);

  const fetchColorTypeData = async () => {
    try {
      await dispatch(fetchColourType()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch color type');
    }
  };

  useEffect(() => {
    if (status.colorType.fetch === Status.IDLE) {
      fetchColorTypeData();
    }
  }, [status.colorType.fetch]);

  const colorTypeOptions =
    colorType && colorType.length > 0
      ? colorType.map(type => ({
          label: type.colorTypeName,
          value: type.colorTypeId,
        }))
      : [];

  return {
    colorTypeOptions,
    colorType,
    isLoading: status.colorType.fetch === Status.PENDING,
  };
};
