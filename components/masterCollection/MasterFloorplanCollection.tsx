import { useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { FloorPlanCard } from './FloorplanCard';
import { Status } from '@lib/constants/enum';
import Loading from '../common/Loading';

export const MasterFloorPlanCollection = ({ filters }) => {
  const { floorPlans,status } = useAppSelector((state: RootState) => state.floorPlan);

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
