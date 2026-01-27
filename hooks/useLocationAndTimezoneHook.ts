import { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchTimeZone, fetchLocation } from '@redux/feature/common/commonThunk';
import { Status } from '@lib/constants/enum';

type CommonGeoType = 'timezone' | 'location';

export const useLocationAndTimezoneHook = ({ type }: { type: CommonGeoType | CommonGeoType[] }) => {
  const dispatch = useAppDispatch();

  const { timezone, locations, status } = useAppSelector(state => state.common);

  // normalize: single → array
  const types = useMemo(() => (Array.isArray(type) ? type : [type]), [type]);

  const fetchData = useCallback(async () => {
    try {
      const promises: Promise<unknown>[] = [];

      if (types.includes('timezone') && status.timezoneStatus === Status.IDLE) {
        promises.push(dispatch(fetchTimeZone()).unwrap());
      }

      if (types.includes('location') && status.locationStatus.fetch === Status.IDLE) {
        if (status.locationStatus.fetch === Status.IDLE) {
          promises.push(dispatch(fetchLocation({ status: true })).unwrap());
        }
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    } catch {
      // optional: central error handling
    }
  }, [dispatch, types, status.timezoneStatus, status.locationStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const timezoneOptions = useMemo(
    () =>
      timezone.map(tz => ({
        label: tz.displayName,
        value: tz.timezoneId,
      })),
    [timezone]
  );

  const locationOptions = useMemo(
    () =>
      locations.map(loc => ({
        label: loc.name,
        value: loc.locationId,
      })),
    [locations]
  );

  const isLoading = useMemo(
    () => ({
      timezone: status.timezoneStatus === Status.PENDING,
      location: status.locationStatus.fetch === Status.PENDING,
    }),
    [status.timezoneStatus, status.locationStatus]
  );

  return {
    timezoneOptions: types.includes('timezone') ? timezoneOptions : [],
    locationOptions: types.includes('location') ? locationOptions : [],
    isLoading,
  };
};
