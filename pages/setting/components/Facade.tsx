import { useAppDispatch } from '@hooks/redux';
import { createFacade, getFacades } from '@redux/feature/facade/facadeThunk';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@hooks/redux';
import { IFacadeState } from '@redux/feature/facade/IFacadeState';
import Image from 'next/image';
import { CreateFormModal } from '@/components/common/Models/CreateFormModel';
import { getFloorPlanFilters } from '@redux/feature/floorPlan/floorPlanThunk';
import { facadeFields } from '@/components/formFields/facadeFields';
import { Status } from '@lib/constants/enum';
import { enumToReadable } from '@lib/utils/enumToRedable';

const Facade = () => {
  const dispatch = useAppDispatch();
  const facades = useAppSelector((state) => state.facade.facades);
  const status = useAppSelector((state) => state.facade.status);
  const filters = useAppSelector((state) => state.floorPlan.filters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getFacades(undefined)).unwrap();
    }

    if (!filters) {
      dispatch(getFloorPlanFilters()).unwrap();
    }
  }, [dispatch, status, filters]);
  
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  const handleCreateFloorPlan = (values: any) => {
    setIsModalVisible(false);
    dispatch(createFacade(values)).unwrap();
  };
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px]/[30px] font-bold text-var(--font-color)">Facade Management</h2>
        <button className="btn large bg-primary cursor-pointer text-white" onClick={handleOpenModal}>
          Create Facade
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facades?.map((facade: IFacadeState) => (
          <div className="card bg-card-color p-4 rounded-xl flex flex-col items-center border border-dashed border-border-color">
            <Image
              src={facade.image}
              alt={facade.name}
              className="mb-4 w-[200px] h-[200px]"
              unoptimized
              width={200}
              height={200}
            />
            
            <div className="flex  w-full rounded-lg p-4 overflow-hidden shadow-sm bg-body-color">
              {/* Left Section */}
              <div className="flex-1 space-y-2 pr-4">
                <h5 className="text-[20px]/[24px] font-bold mb-4 text-center">
                  {facade.name}
                </h5>
                <div className="flex justify-between">
                  <span className="font-medium">Dwelling Type :</span>
                  <span>{enumToReadable(facade?.dwellingTypeName || "N/A")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Upgradable :</span>
                  <span>{facade?.upgrade ? "yes" : "no"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Standard :</span>
                  <span>{facade?.standard ? "yes" : "no"}</span>
                </div>
                <div className="flex justify-between gap-5">
                  <span className="font-medium">Created At :</span>
                  <span>{facade?.createdAt?.split('T')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <CreateFormModal
          title="Floor Plan"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleCreateFloorPlan}
          fields={facadeFields()}
        />
      </div>
    </div>
  );
};

export default Facade;
