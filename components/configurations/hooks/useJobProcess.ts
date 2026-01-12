import { useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import {
  fetchJobProcessFunctionality,
  fetchJobProcessStages,
} from '@redux/feature/admin/job/jobProcess/jobProcessThunk';

export const useJobProcess = () => {
  const dispatch = useAppDispatch();

  const {
    jobProcessFunctionality = [],
    status,
  } = useAppSelector(state => state.job.jobProcess);

  const fetchJobProcessFunctionalityData = useCallback(async () => {
    try {
      await dispatch(fetchJobProcessFunctionality()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch job process functionality');
    }
  }, [dispatch]);

  const fetchJobProcessStageData = useCallback(async () => {
    try {
      await dispatch(fetchJobProcessStages()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch job process stage');
    }
  }, [dispatch]);

  useEffect(() => {
    if (status.fetchFunctionality === Status.IDLE) {
      fetchJobProcessFunctionalityData();
    }
    if (status.stage.fetch === Status.IDLE) {
      fetchJobProcessStageData();
    }
  }, [
    status.fetchFunctionality,
    status.stage.fetch,
    fetchJobProcessFunctionalityData,
    fetchJobProcessStageData,
  ]);

  const jobProcessFunctionalityOptions = useMemo(
    () =>
      jobProcessFunctionality.map(item => ({
        value: String(item.functionalityId),
        label: item.name,
      })),
    [jobProcessFunctionality]
  );

  return { jobProcessFunctionalityOptions };
};
