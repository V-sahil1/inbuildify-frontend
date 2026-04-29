import { Status } from '@lib/constants/enum';
import { getCountriesThunk } from '@redux/feature/location/locationThunk';
import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';

export const useCountryHook = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const countries = useAppSelector(state => state.location?.countries || []);
  const status = useAppSelector(state => state.location?.countryStatus || Status.IDLE);

  const isLoading = status === Status.PENDING;
  const isError = status === Status.ERROR;
  const isSuccess = status === Status.SUCCESS;
  const fetchCountries = async () => {
    try {
      await dispatch(getCountriesThunk()).unwrap();
    } catch (err) {
      setError(err as string);
    }
  };
  useEffect(() => {
    if (status === Status.IDLE) {
      fetchCountries();
    }
  }, [status, dispatch]);

  const countryOptions = useMemo(() => {
    return countries.map(country => ({
      label: country.name.charAt(0).toUpperCase() + country.name.slice(1),
      value: country.countryId,
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
