import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllSuppliers } from '@redux/feature/supplier/supplierThunk';

export const useSupplierHook = () => {
  const dispatch = useAppDispatch();
  const { suppliers } = useAppSelector(state => state.supplier);

  const fetchSuppliers = async () => {
    try {
      await dispatch(fetchAllSuppliers()).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const supplierOptions = useMemo(() => {
    if (!suppliers || suppliers.length === 0) {
      return [];
    }
    return suppliers
      .map((group) => ({
        label: group.companyName,
        value: group.supplierId,
      }));
  }, []);

  return {
    supplierOptions
  };
};
