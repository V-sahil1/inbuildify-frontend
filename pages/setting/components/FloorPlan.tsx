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
import { Status } from "@lib/constants/enum";
import { RootState } from "@redux/feature/store";

const FloorPlan = () => {
  const dispatch = useAppDispatch();
  const floorPlans = useAppSelector(
    (state: RootState) => state.floorPlan.floorPlans
  );
  const status = useAppSelector((state: RootState) => state.floorPlan.status);
  console.log("status", status);
  const filters = useAppSelector((state: RootState) => state.floorPlan.filters);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (status?.floorPlan === Status.IDLE) {
      dispatch(fetchFloorPlans(undefined)).unwrap();
    }
    if (status?.filters === Status.IDLE) {
      dispatch(getFloorPlanFilters()).unwrap();
    }
  }, [dispatch, status, filters]);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  const handleCreateFloorPlan = (values: any) => {
    setIsModalVisible(false);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("range", values.range);
    formData.append("dwelling_type", values.dwelling_type);
    formData.append("beds", values.beds);
    formData.append("bath", values.bath);
    formData.append("car_park", values.car_park);
    formData.append("width_meter", values.width_meter);
    formData.append("depth_meter", values.depth_meter);
    formData.append("dwelling", values.dwelling);
    formData.append("garage", values.garage);
    formData.append("porch", values.porch);
    formData.append("alfresco", values.alfresco);
    formData.append("total_sqft", values.total_sqft);
    formData.append("image", values.image.file.originFileObj);
    dispatch(createFloorPlan(formData))
      .unwrap()
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };
  return (
    <div className="mt-4 ">
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-[24px]/[30px] font-bold text-var(--font-color)">
          Floor Plan Management
        </h2>
        <button
          className="btn large bg-[var(--primary)] cursor-pointer text-white"
          onClick={handleOpenModal}
        >
          Create Floor Plan
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 ">
        {floorPlans?.map((floorPlan: IFloorPlanState) => (
          <div className="card bg-card-color p-4 rounded-xl flex flex-col items-center border border-dashed border-border-color">
            <Image
              src={floorPlan?.image || "/placeholder.png"} // make sure placeholder.png exists in /public
              alt={floorPlan?.name || "Floor Plan"}
              className="mb-6 w-[200px] h-[200px] object-contain"
              width={200}
              height={200}
              unoptimized
            />

            <h5 className="text-[20px]/[24px] font-bold mb-2 text-center">
              {floorPlan?.name}
            </h5>
            <p className="text-font-color-100 mb-4 text-center">
              {floorPlan?.rangeName}
            </p>
            <div className="flex  w-full rounded-lg p-4 overflow- bg-body-color">
              {/* Left Section */}
              <div className="flex-1 space-y-2 sm:pr-4">
                <div className="flex justify-between text-xs sm:text-sm ">
                  <span className="font-medium">Beds :</span>
                  <span>{floorPlan?.beds || "N/A"}</span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium">Bath :</span>
                  <span>{floorPlan?.bath || "N/A"}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm ">
                  <span className="font-medium">Car Park :</span>
                  <span>{floorPlan?.carPark || "N/A"}</span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium">Width M :</span>
                  <span>{floorPlan?.widthMeter || "N/A"}</span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm ">
                  <span className="font-medium">Depth M :</span>
                  <span>{floorPlan?.depthMeter || "N/A"}</span>
                </div>
              </div>

              {/* Vertical Divider */}
              <Divider type="vertical" className="h-auto mx-4" />

              {/* Right Section */}
              <div className="flex-1 space-y-2 sm:pl-4 ">
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">Dwelling :</span>
                  <span className="break-words">
                    {floorPlan?.dwelling || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">Garage :</span>
                  <span className="break-words">
                    {floorPlan?.garage || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">Porch :</span>
                  <span className="break-words">
                    {floorPlan?.porch || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">Alfresco :</span>
                  <span className="break-words">
                    {floorPlan?.alfresco || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between  text-xs sm:text-sm">
                  <span className="font-medium break-words">SQFT :</span>
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
