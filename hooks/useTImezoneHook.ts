import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchTimeZone } from '@redux/feature/common/commonThunk';
import { Status } from '@lib/constants/enum';

export const useTimezoneHook = () => {
  const dispatch = useAppDispatch();
  const { timezone, status } = useAppSelector(state => state.common);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && status.timezoneStatus !== Status.SUCCESS) {
      dispatch(fetchTimeZone());
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized, status.timezoneStatus]);

  const timezoneOptions = useMemo(() => {
    return timezone.map((tz) => ({
      label: tz.displayName,
      value: tz.timezoneId
    }));
  }, [timezone]);

  return {
    timezoneOptions,
    isLoading: status.timezoneStatus === Status.PENDING,
    error: status.timezoneStatus === Status.ERROR ? 'Failed to load timezones' : null
  };
};