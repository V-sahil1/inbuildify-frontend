import { Status } from '@lib/constants/enum';
import { getCountriesThunk } from '@redux/feature/location/locationThunk';
import { useEffect, useState, useMemo } from 'react';
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
      const fetchCountries = async () => {
        try {
          await dispatch(getCountriesThunk()).unwrap();
        } catch (err) {
          setError(err as string);
        }
      };
      fetchCountries();
    }
  }, [status, dispatch]);

  const countryOptions = useMemo(() => {
    return countries.map(country => ({
      label: country.name,
      value: country.countryId
    }));
  }, [countries]);

  return {
    countryOptions,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};
