import React, { useEffect, useState } from "react";
import {
  createFloorPlan,
  getFloorPlanFilters,
} from "@redux/feature/floorPlan/floorPlanThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Typography } from "antd";
import { fetchPackages } from "@redux/feature/package/packageThunk";
import { Status } from "@lib/constants/enum";

const Package = () => {
  const dispatch = useAppDispatch();
  const packages = useAppSelector((state: any) => state.package.packages);
  const status = useAppSelector((state: any) => state.package.status.packages);
  console.log(packages);
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(fetchPackages()).then(() => {
        // if (!packages) {
        //   dispatch(getFloorPlanFilters());
        // }
      });
    }
  }, [dispatch, status]);
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
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <Typography.Title
          level={4}
          style={{ margin: 0, color: "var(--font-color)" }}
        >
          Package Management
        </Typography.Title>
        <button
          className="btn large bg-[var(--primary)] cursor-pointer text-white"
          onClick={handleOpenModal}
        >
          Create Package
        </button>
      </div>
      </div>
  );
};
export default Package;
