import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { fetchAllBuiders } from '@redux/feature/common/commonThunk';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';

export const useBuildersHook = () => {
  const dispatch = useAppDispatch();
  const { builders, status } = useAppSelector((state: RootState) => state.common);

  const fetchBuilderData = async () => {
    try {
      await dispatch(fetchAllBuiders()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch buiders');
    }
  };

  useEffect(() => {
    if (status.builder === Status.IDLE) {
      fetchBuilderData();
    }
  }, [status.builder]);

  const builderOptions =
    builders &&
    builders.length > 0 &&
    builders.map(builder => ({
      label: builder.name,
      value: builder.builderId,
    }));

  return {
    builderOptions,
    isLoading: status.builder === Status.PENDING,
  };
};
