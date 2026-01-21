import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchAllConstructionOption } from '@redux/feature/admin/construction/constructionOption/constructionOptionThunk';

export const useConstructionOptionHook = () => {
  const dispatch = useAppDispatch();
  const { constructionOption, status } = useAppSelector(
    (state: RootState) => state.construction.constructionOption
  );

  const fetchConstructionOptionData = async () => {
    try {
      await dispatch(fetchAllConstructionOption()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch construction options');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchConstructionOptionData();
    }
  }, [status.fetch]);

  const constructionOptions =
    constructionOption &&
    constructionOption.length > 0 &&
    constructionOption.map(option => ({
      label: option.optionName,
      value: option.constructionOptionId,
    }));

  return {
    constructionOptions,
    isLoading: status.fetch === Status.PENDING,
  };
};
