import { useEffect } from 'react';
import { FacadeCard } from './FacadeCard';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { message } from 'antd';
import { getFacades } from '@redux/feature/facade/facadeThunk';
import { Status } from '@lib/constants/enum';
import Loading from '../common/Loading';

export const MasterFacadeCollection = ({ filters }) => {
  const dispatch = useAppDispatch();
  const { facades, status } = useAppSelector(state => state.facade);

  const fetchFacadeData = async () => {
    if (status === Status.PENDING) {
      return;
    }
    try {
      const params = {
        range_id: filters?.range || undefined,
        dwelling_type_id: filters?.dwellingType || undefined,
        name: filters?.search || undefined,
      };
      await dispatch(getFacades(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Facades');
    }
  };
  useEffect(() => {
    fetchFacadeData();
  }, [filters]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {status === Status.PENDING ? (
        <div className="col-span-full flex items-center justify-center py-8">
          <Loading type="primary" />
        </div>
      ) : facades.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No facades found
        </div>
      ) : (
        facades.map(facade => (
          <FacadeCard key={facade.facadeId} facade={facade} />
        ))
      )}
    </div>
  );
};
