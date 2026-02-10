import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { fetchAllSupplierType } from '@redux/feature/supplier/supplierThunk';
import { message } from 'antd';

export const useSupplierTypeOptions = () => {
  const dispatch = useAppDispatch();
  const { supplierType, status } = useAppSelector(state => state.supplier);

  const fetchSupplierType = async () => {
    try {
      await dispatch(fetchAllSupplierType({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch supplier type');
    }
  };

  useEffect(() => {
    if (status.supplierType.fetch === Status.IDLE) {
      fetchSupplierType();
    }
  }, [status.supplierType.fetch, dispatch]);

  const getOptions = () => {
    return (
      supplierType?.map(type => ({
        value: type.supplierTypeId,
        label: type.name,
      })) || []
    );
  };

  const getActiveOptions = () => {
    return (
      supplierType
        ?.filter(type => type.isActive)
        .map(type => ({
          value: type.supplierTypeId,
          label: type.name,
        })) || []
    );
  };

  return {
    options: getOptions(),
    activeOptions: getActiveOptions(),
    loading: status.supplierType.fetch === Status.PENDING,
  };
};
