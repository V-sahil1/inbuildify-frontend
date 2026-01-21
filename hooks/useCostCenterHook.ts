import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchAllCostCenter } from '@redux/feature/costCenter/costCenterThunk';

export const useCostCenterHook = () => {
  const dispatch = useAppDispatch();
  const { costCenter, status } = useAppSelector((state: RootState) => state.costCenter);

  const fetchCostCenterData = async () => {
    try {
      await dispatch(fetchAllCostCenter()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch cost centers');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchCostCenterData();
    }
  }, [status.fetch]);

  const costCenterOptions =
    costCenter &&
    costCenter.length > 0 &&
    costCenter.map(center => ({
      label: center.name,
      value: center.costCenterId,
    }));

  return {
    costCenterOptions,
    isLoading: status.fetch === Status.PENDING,
  };
};
