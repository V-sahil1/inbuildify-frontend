import { Status } from '@lib/constants/enum';
import { FacadeCard } from './FacadeCard';
import { useAppSelector } from '@hooks/redux';
import Loading from '../common/Loading';

export const MasterFacadeCollection = ({ filters }) => {
  const { facades,status } = useAppSelector(state => state.facade);

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
