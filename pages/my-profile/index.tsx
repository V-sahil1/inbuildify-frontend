import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import WelcomeHeader from "@/components/common/WelcomeHeader";
import { profile_av } from "/public/images";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { profileFields } from "@/components/formFields/profileFields";
import { IconEdit } from "@tabler/icons-react";
import { updateUserThunk } from "@redux/feature/auth/authThunk";
import { message } from "antd";

export default function MyProfile() {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const breadcrumbItem = [
    {
      name: "App",
    },
    {
      name: "My Contact",
    },
  ];

  const mappedUser = {
    ...user,
    image: user?.logo,
    abn_number: user?.abnNumber,
    license_number: user?.licenseNumber,
    phone: user?.phoneNumber,
    firm_name: user?.firmName,
  };
  const handleUpdateProfile = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firm_name", values.firmName);
      formData.append("slogan", values.slogan);
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("license_number", values.license_number);
      formData.append("abn_number", values.abn_number);
      if (values?.logo?.length > 0 && values.logo[0]?.originFileObj) {
        formData.append("image", values.logo[0].originFileObj);
      }
      const response = await dispatch(updateUserThunk(formData)).unwrap();
      message.success(response.message);
      setIsEditModalOpen(false);
    } catch (error) {
      message.error(error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:px-6 sm:px-3 pt-4">
      <div className="container-fluid">
        <Breadcrumb breadcrumbItem={breadcrumbItem} />
        <WelcomeHeader />
        <div className="card bg-card-color rounded-xl border border-border-color">
          <div className="md:p-6 p-4 relative">
            <IconEdit
              size={24}
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setIsEditModalOpen(true)}
            />
            <div className="flex md:items-start items-center md:gap-8 gap-4 md:flex-row flex-col">
              <Image
                src={user?.logo || profile_av}
                alt="user profile"
                width="160"
                height="160"
                className="sm:w-[160px] sm:h-[160px] sm:min-w-[160px] w-[100px] h-[100px] min-w-[100px] object-cover rounded-xl"
              />

              <div className="hidden md:block w-px bg-gray-300 mx-6" />

              <div className="md:text-start text-center">
                <h2 className="text-[24px]/[30px] font-light flex gap-2 items-center md:justify-start justify-center">
                  Builder Details
                </h2>
                <p className="mb-1 text-[24px]/[30px] font-light flex gap-2 items-center md:justify-start justify-center">
                  Firm Name: {user?.firmName}
                </p>
                <p className="mb-3">Slogan: {user?.slogan}</p>
                <p className="mb-3">License Number: {user?.licenseNumber}</p>
                <p className="mb-3">ABN Number: {user?.abnNumber}</p>
              </div>

              <div className="hidden md:block w-px bg-gray-300 mx-6" />

              <div className="flex flex-col gap-2">
                <h2 className="text-[24px]/[30px] font-light flex gap-2 items-center md:justify-start justify-center">
                  Personal Details
                </h2>
                <p>Name: {user?.name}</p>
                <p>Email: {user?.email}</p>
                <p>Phone Number: {user?.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <CreateFormModal
          title="Contractor"
          open={isEditModalOpen}
          loading={loading}
          initialValues={mappedUser}
          isEditing={true}
          onCancel={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateProfile}
          fields={profileFields()}
        />
      )}
    </div>
  );
}
