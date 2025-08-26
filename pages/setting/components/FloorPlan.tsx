import React, { useEffect, useState } from "react";
import { IFloorPlanState } from "@redux/feature/floorPlan/IFloorPlanState";
import {
  createFloorPlan,
  fetchFloorPlans,
  getFloorPlanFilters,
} from "@redux/feature/floorPlan/floorPlanThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import Image from "next/image";
import { Divider } from "antd";
import { Typography } from "antd";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { floorPlanFields } from "@/components/formFields/floorPlanFields";

const FloorPlan = () => {
  const dispatch = useAppDispatch();
  const floorPlans = useAppSelector((state: any) => state.floorPlan.floorPlans);
  const filters = useAppSelector((state: any) => state.floorPlan.filters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    dispatch(fetchFloorPlans()).then(() => {
      if (!filters) {
        dispatch(getFloorPlanFilters());
      }
    });
  }, [dispatch]);
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  const handleCreateFloorPlan = (values: any) => {
    console.log(values);
    setIsModalVisible(false);
    const response = dispatch(createFloorPlan(values)).unwrap();
    console.log(response);
  };
  return (
    <div className="mt-4 ">
      <div className="flex items-center justify-between mb-4 ">
        <Typography.Title
          level={4}
          style={{ margin: 0, color: "var(--font-color)" }}
        >
          Floor Plan Management
        </Typography.Title>
        <button
          className="btn large bg-[#4c3575] cursor-pointer text-white"
          onClick={handleOpenModal}
        >
          Create Floor Plan
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 ">
        {floorPlans?.map((floorPlan: IFloorPlanState) => (
          <div className="card bg-card-color p-4 rounded-xl flex flex-col items-center border border-dashed border-border-color">
            <Image
              src={floorPlan.image}
              alt={floorPlan.name}
              className="mb-6 w-[200px] h-[200px]"
              unoptimized
              width={200}
              height={200}
            />
            <h5 className="text-[20px]/[24px] font-medium mb-2 text-center">
              {floorPlan.name}
            </h5>
            <p className="text-font-color-100 mb-4 text-center">
              {floorPlan.rangeName}
            </p>
            <div className="flex  w-full rounded-lg p-4 bg-white  overflow-hidden">
              {/* Left Section */}
              <div className="flex-1 space-y-2 sm:pr-4">
                <div className="flex justify-between text-xs sm:text-sm ">
                  <span className="font-medium">Beds:</span>
                  <span>{floorPlan?.beds || "N/A"}</span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium">Bath:</span>
                  <span>{floorPlan?.bath || "N/A"}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm ">
                  <span className="font-medium">Car Park:</span>
                  <span>{floorPlan?.carPark || "N/A"}</span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium">Width M:</span>
                  <span>{floorPlan?.widthMeter || "N/A"}</span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm ">
                  <span className="font-medium">Depth M:</span>
                  <span>{floorPlan?.depthMeter || "N/A"}</span>
                </div>
              </div>

              {/* Vertical Divider */}
              <Divider type="vertical" className="h-auto mx-4" />

              {/* Right Section */}
              <div className="flex-1 space-y-2 sm:pl-4 ">
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">Dwelling:</span>
                  <span className="break-words">
                    {floorPlan?.dwelling || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">Garage:</span>
                  <span className="break-words">
                    {floorPlan?.garage || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">Porch:</span>
                  <span className="break-words">
                    {floorPlan?.porch || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">Alfresco:</span>
                  <span className="break-words">
                    {floorPlan?.alfresco || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">SQFT:</span>
                  <span className="break-words">
                    {floorPlan?.totalSqft || "N/A"}
                  </span>
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
          fields={floorPlanFields()}
        />
      </div>
    </div>
  );
};
export default FloorPlan;
