import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllSuppliers } from '@redux/feature/supplier/supplierThunk';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';

export const useSupplierHook = () => {
  const dispatch = useAppDispatch();
  const { suppliers, status } = useAppSelector(state => state.supplier);

  const fetchSuppliers = async () => {
    try {
      await dispatch(fetchAllSuppliers()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch supplier');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchSuppliers();
    }
  }, [status.fetch]);

  const supplierOptions = useMemo(() => {
    if (!suppliers || suppliers.length === 0) {
      return [];
    }
    return suppliers.map(group => ({
      label: group.companyName,
      value: group.supplierId,
    }));
  }, [suppliers]);

  return {
    supplierOptions,
  };
};
