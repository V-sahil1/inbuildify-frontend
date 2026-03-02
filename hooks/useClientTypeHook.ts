import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchAllClientType } from '@redux/feature/admin/sales/clientType/clientTypeThunk';

export const useClientTypeHook = () => {
  const dispatch = useAppDispatch();
  const { clientType, status } = useAppSelector((state: RootState) => state.sales.clientType);

  const fetchClientTypeData = async () => {
    try {
      await dispatch(fetchAllClientType({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch client type');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchClientTypeData();
    }
  }, [status.fetch]);

  const clientTypeOptions =
    clientType && clientType.length > 0
      ? clientType.map(type => ({
          label: type.clientType,
          value: type.clientTypeId,
        }))
      : [];

  return {
    clientTypeOptions,
    isLoading: status.fetch === Status.PENDING,
  };
};
