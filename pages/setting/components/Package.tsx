import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Empty, Spin } from "antd";
import { createPackage, fetchPackages } from "@redux/feature/package/packageThunk";
import { Status } from "@lib/constants/enum";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { packageFields } from "@/components/formFields/packageFields";
import { RootState } from "@redux/feature/store";
import { PackageItem } from "@/components/package/PackageItem";

const Package = () => {
  const dispatch = useAppDispatch();
  const packages = useAppSelector((state: RootState) => state.package.packages);
  const getAllStatus = useAppSelector((state: RootState) => state.package.status.packages);
  const createStatus = useAppSelector((state: RootState) => state.package.status.create);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (getAllStatus === Status.IDLE) {
      dispatch(fetchPackages(undefined)).unwrap();
    }
  }, [dispatch, getAllStatus]);
  
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCreatePackage = async (values: any) => {
    try {
      await dispatch(createPackage(values)).unwrap();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

  const renderContent = () => {
    if (getAllStatus === Status.PENDING || getAllStatus === Status.IDLE) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      );
    }

    if (!packages || packages.length === 0) {
      return (
        <Empty 
          description={
            <span className="text-gray-500">No packages found. Create your first package to get started.</span>
          }
          className="py-12"
        />
      );
    }

    return (
      <div className="space-y-4">
        {packages?.map((pkg) => (
          <PackageItem key={pkg.packageId} pkg={pkg} />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px]/[30px] font-bold text-var(--font-color)">Package Management</h2>
        <button
          className="btn large bg-[var(--primary)] cursor-pointer text-white"
          onClick={handleOpenModal}
          disabled={getAllStatus === Status.PENDING}
        >
          Create Package
        </button>
      </div>
      
      {renderContent()}
      
      <CreateFormModal
        title="Create New Package"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleCreatePackage}
        fields={packageFields()}
        loading={createStatus === Status.PENDING}
      />
    </div>
  );
};
export default Package;
