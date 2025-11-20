import { facadeData } from 'data/facadeData';
import { FacadeCard } from './FacadeCard';
export const MasterFacadeCollection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {facadeData.map(facade => (
        <FacadeCard
          key={facade.id}
          title={facade.name}
          dwellingType={facade.dwelling_type}
          image={facade.image}
          costType={facade.costType}
        />
      ))}
    </div>
  );
};
