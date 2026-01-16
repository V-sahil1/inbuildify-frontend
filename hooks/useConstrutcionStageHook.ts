import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchAllConstructionStage } from '@redux/feature/admin/construction/constructionStage/constructionStageThunk';

export const useConstructionStageHook = () => {
  const dispatch = useAppDispatch();
  const { stage, status } = useAppSelector(
    (state: RootState) => state.construction.constructionStage
  );

  const fetchConstructionStageData = async () => {
    try {
      await dispatch(fetchAllConstructionStage()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch buiders');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchConstructionStageData();
    }
  }, [status.fetch]);

  const stageOptions =
    stage &&
    stage.length > 0 &&
    stage.map(stage => ({
      label: stage.stageName,
      value: stage.constructionStage,
    }));

  return {
    stageOptions,
    isLoading: status.fetch === Status.PENDING,
  };
};
