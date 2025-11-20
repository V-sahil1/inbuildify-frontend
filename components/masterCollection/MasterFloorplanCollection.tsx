import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { RootState } from '@redux/feature/store';
import { message } from 'antd';
import { useEffect } from 'react';
import { FloorPlanCard } from './FloorplanCard';

export const MasterFloorPlanCollection = () => {
  const dispatch = useAppDispatch();
  const {
    floorPlans,
    status,
    filters: floorplanFilters,
  } = useAppSelector((state: RootState) => state.floorPlan);
  const fetchFloorPlansData = async () => {
    try {
      await dispatch(fetchFloorPlans(undefined)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Floor Plans');
    }
  };
  useEffect(() => {
    if (status?.floorPlan === Status.IDLE) {
      fetchFloorPlansData();
    }
  }, [dispatch, status, floorplanFilters]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {floorPlans.map(item => (
        <FloorPlanCard key={item.floorPlanId} floorplan={item} />
      ))}
    </div>
  );
};
