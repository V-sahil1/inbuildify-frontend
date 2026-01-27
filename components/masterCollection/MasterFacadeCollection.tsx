import { useEffect } from 'react';
import { FacadeCard } from './FacadeCard';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { message } from 'antd';
import { getFacades } from '@redux/feature/facade/facadeThunk';

export const MasterFacadeCollection = ({ filters }) => {
  const dispatch = useAppDispatch();
  const { facades } = useAppSelector(state => state.facade);

  const fetchFacadeData = async () => {
    try {
      const params = {
        range_id: filters?.range,
        dwelling_type_id: filters?.dwellingType,
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
      {facades.map(facade => (
        <FacadeCard key={facade.facadeId} facade={facade} />
      ))}
    </div>
  );
};
