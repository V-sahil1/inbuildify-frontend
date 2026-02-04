import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchAllType } from '@redux/feature/admin/construction/constructionType/constructionTypeThunk';

export const useConstructionTypeHook = () => {
  const dispatch = useAppDispatch();
  const { type, status } = useAppSelector(
    (state: RootState) => state.construction.constructionType
  );

  const fetchConstructionTypeData = async () => {
    try {
      await dispatch(fetchAllType()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch buiders');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchConstructionTypeData();
    }
  }, [status.fetch]);

  const typeOptions =
    type &&
    type.length > 0 &&
    type.map(type => ({
      label: type.typesName,
      value: type.constructionTypeId,
    }));

  return {
    typeOptions,
    isLoading: status.fetch === Status.PENDING,
  };
};
