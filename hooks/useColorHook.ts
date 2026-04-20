import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchAllColour } from '@redux/feature/color/colorThunk';

export const useColorHook = () => {
  const dispatch = useAppDispatch();
  const { color, status } = useAppSelector((state: RootState) => state.colour);

  const fetchColorData = async () => {
    try {
      await dispatch(fetchAllColour()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch color data');
    }
  };

  useEffect(() => {
    if (status.color.fetch === Status.IDLE) {
      fetchColorData();
    }
  }, [status.color.fetch]);

  const colorMasterOptions =
    color && color.length > 0
      ? color.map(c => ({
          label: c.colorName,
          value: c.colorId,
        }))
      : [];

  return {
    colorMasterOptions,
    color,
    isLoading: status.color.fetch === Status.PENDING,
  };
};
