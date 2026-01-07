import { Status } from '@lib/constants/enum';
import { getStatesByCountryIdThunk } from '@redux/feature/location/locationThunk';
import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';

export const useStateHook = (countryId?: string) => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const states = useAppSelector(state => state.location?.states || []);
  const status = useAppSelector(state => state.location?.status || Status.IDLE);

  const isLoading = status === Status.PENDING;
  const isError = status === Status.ERROR;
  const isSuccess = status === Status.SUCCESS;

  useEffect(() => {
    const fetchStates = async () => {
      try {
        await dispatch(getStatesByCountryIdThunk(countryId || null)).unwrap();
      } catch (err) {
        setError(err as string);
      }
    };
    fetchStates();
  }, [countryId, dispatch]);

  const stateOptions = useMemo(() => {
    return states.map(state => ({
      label: state.name,
      value: state.stateId,
    }));
  }, [states]);

  return {
    states,
    stateOptions,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};
