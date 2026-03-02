import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchAllLandPackage } from '@redux/feature/land/landThunk';

export const useHLPackageHook = () => {
  const dispatch = useAppDispatch();
  const { package: packages, status } = useAppSelector((state: RootState) => state.land);

  const fetchPackageData = async () => {
    try {
      await dispatch(fetchAllLandPackage({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch client type');
    }
  };

  useEffect(() => {
    if (status.package.fetch === Status.IDLE) {
      fetchPackageData();
    }
  }, [status.package.fetch]);

  const packageOptions =
    packages && packages.length > 0
      ? packages.map(item => ({
          label: item.title,
          value: item.houseLandPackageId,
        }))
      : [];

  return {
    packageOptions,
    isLoading: status.package.fetch === Status.PENDING,
  };
};
