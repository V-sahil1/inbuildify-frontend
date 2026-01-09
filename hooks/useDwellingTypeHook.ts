import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { fetchDwellingType } from '@redux/feature/admin/sales/dwellingType/dwellingTypeThunk';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';

export const useDwellingTypeHook = () => {
  const dispatch = useAppDispatch();
  const { dwellingType, status } = useAppSelector((state: RootState) => state.sales.dwellingType);

  const fetchDwellingTypeData = async () => {
    try {
      await dispatch(fetchDwellingType()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch dwelling type');
    }
  };
  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchDwellingTypeData();
    }
  }, [status.fetch]);

  const dwellingTypeOptions =
    dwellingType &&
    dwellingType.length > 0 &&
    dwellingType.map(type => ({
      label: type.name,
      value: type.dwellingTypeId,
    }));

  return {
    dwellingTypeOptions,
    isLoading: status.fetch === Status.PENDING,
  };
};
