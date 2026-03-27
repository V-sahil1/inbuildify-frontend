import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { RootState } from '@redux/feature/store';
import { message } from 'antd';
import { useEffect } from 'react';
import { FloorPlanCard } from './FloorplanCard';
import { Status } from '@lib/constants/enum';
import Loading from '../common/Loading';

export const MasterFloorPlanCollection = ({ filters }) => {
  const dispatch = useAppDispatch();
  const { floorPlans, status } = useAppSelector((state: RootState) => state.floorPlan);
  const fetchFloorPlansData = async () => {
    if (status.floorPlan.fetch === Status.PENDING) {
      return;
    }
    try {
      const params = {
        range_id: filters?.range,
        dwelling_type_id: filters?.dwellingType,
        name: filters?.search || undefined,
      };
      await dispatch(fetchFloorPlans(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Floor Plans');
    }
  };
  useEffect(() => {
    fetchFloorPlansData();
  }, [filters]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {status.floorPlan.fetch === Status.PENDING ? (
        <div className="col-span-full flex items-center justify-center py-8">
          <Loading type="primary" />
        </div>
      ) : floorPlans.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No floor plans found
        </div>
      ) : (
        floorPlans.map(item => (
          <FloorPlanCard key={item.floorPlanId} floorplan={item} />
        ))
      )}
    </div>
  );
};
