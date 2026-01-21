import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchComplianceType } from '@redux/feature/common/commonThunk';

export const useComplianceTypeHook = () => {
  const dispatch = useAppDispatch();
  const { complianceType, status } = useAppSelector((state: RootState) => state.common);

  const fetchComplianceTypeData = async () => {
    try {
      await dispatch(fetchComplianceType()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch compliance types');
    }
  };

  useEffect(() => {
    if (status.complianceTypeStatus === Status.IDLE) {
      fetchComplianceTypeData();
    }
  }, [status.complianceTypeStatus]);

  const complianceTypeOptions =
    complianceType &&
    complianceType.length > 0 &&
    complianceType.map(type => ({
      label: type.name,
      value: type.complianceTypeId,
    }));

  return {
    complianceTypeOptions,
    isLoading: status.complianceTypeStatus === Status.PENDING,
  };
};
