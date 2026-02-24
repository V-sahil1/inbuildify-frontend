import { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchDwellingType } from '@redux/feature/admin/sales/dwellingType/dwellingTypeThunk';
import { fetchRange } from '@redux/feature/admin/sales/range/rangeThunk';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';

type SalesCommonType = 'dwellingType' | 'range';

export const useDwellingAndRangeHook = ({
  type,
}: {
  type: SalesCommonType | SalesCommonType[];
}) => {
  const dispatch = useAppDispatch();

  const { dwellingType, status: dwellingStatus } = useAppSelector(
    (state) => state.sales.dwellingType
  );

  const { range, status: rangeStatus } = useAppSelector(
    (state) => state.sales.range
  );

  const types = useMemo(
    () => (Array.isArray(type) ? type : [type]),
    [type]
  );

  const fetchData = useCallback(async () => {
    try {
      const promises: Promise<unknown>[] = [];

      if (types.includes('dwellingType')) {
        promises.push(dispatch(fetchDwellingType()).unwrap());
      }

      if (types.includes('range')) {
        promises.push(dispatch(fetchRange()).unwrap());
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    } catch (error) {
      message.error(error || 'Failed to fetch sales data');
    }
  }, [dispatch, types]);

  useEffect(() => {
    const needsFetch =
      (types.includes('dwellingType') &&
        dwellingStatus.fetch === Status.IDLE) ||
      (types.includes('range') &&
        rangeStatus.fetch === Status.IDLE);

    if (needsFetch) {
      fetchData();
    }
  }, [
    fetchData,
    types,
    dwellingStatus.fetch,
    rangeStatus.fetch,
  ]);

  const dwellingTypeOptions = useMemo(
    () =>
      dwellingType.filter(d => d.isActive)?.map(d => ({
        label: d.name,
        value: d.dwellingTypeId,
      })),
    [dwellingType]
  );

  const rangeOptions = useMemo(
    () =>
      range.filter(r => r.isActive)?.map(r => ({
        label: r.name,
        value: r.rangeId,
      })),
    [range]
  );

  const isLoading = useMemo(
    () => ({
      dwellingType: dwellingStatus.fetch === Status.PENDING,
      range: rangeStatus.fetch === Status.PENDING,
    }),
    [dwellingStatus.fetch, rangeStatus.fetch]
  );

  return {
    dwellingTypeOptions: types.includes('dwellingType')
      ? dwellingTypeOptions
      : [],
    rangeOptions: types.includes('range') ? rangeOptions : [],
    isLoading,
  };
};

export default useDwellingAndRangeHook;
