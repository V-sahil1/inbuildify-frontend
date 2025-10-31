import { Status } from '@lib/constants/enum';
import { getCountriesThunk } from '@redux/feature/location/locationThunk';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';

export const useCountryHook = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const countries = useAppSelector(state => state.location?.countries || []);
  const status = useAppSelector(state => state.location?.status || Status.IDLE);

  const isLoading = status === Status.PENDING;
  const isError = status === Status.ERROR;
  const isSuccess = status === Status.SUCCESS;

  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getCountriesThunk())
        .unwrap()
        .catch(err => {
          setError(err);
        });
    }
  }, [status, dispatch]);

  return {
    countries,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};
