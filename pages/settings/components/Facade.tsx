import { useAppDispatch } from "@hooks/redux";
import { createFacade,deleteFacade,getFacades,updateFacade,} from "@redux/feature/facade/facadeThunk";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@hooks/redux";
import { IFacadeState } from "@redux/feature/facade/IFacadeState";
import Image from "next/image";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { getFloorPlanFilters } from "@redux/feature/floorPlan/floorPlanThunk";
import { facadeFields } from "@/components/formFields/facadeFields";
import { Status } from "@lib/constants/enum";
import { enumToReadable } from "@lib/utils/enumToRedable";
import { Empty, message, Spin } from "antd";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const Facade = () => {
  const dispatch = useAppDispatch();
  const facades = useAppSelector((state) => state.facade.facades);
  const status = useAppSelector((state) => state.facade.status);
  const filters = useAppSelector((state) => state.floorPlan.filters);
  const [editingFacade, setEditingFacade] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [facadeId, setFacadeId] = useState<string | null>(null);
  useEffect(() => {
    const fetchFacadesData = async () => {
      try {
        await dispatch(getFacades(undefined)).unwrap();
      } catch (error) {
        message.error(error || "Failed to fetch Facades");
      }
    };
    const fetchFiltersData = async () => {
      try {
        await dispatch(getFloorPlanFilters()).unwrap();
      } catch (error) {
        message.error(error || "Failed to fetch Floor Plans");
      }
    };
    if (status === Status.IDLE) {
      fetchFacadesData();
    }
    if (!filters) {
      fetchFiltersData();
    }
  }, [dispatch, status, filters]);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  
  const handleCreateFacade = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("dwelling_type", values.dwelling_type);

      if (values?.image?.length > 0 && values.image[0]?.originFileObj) {
        formData.append("image", values.image[0].originFileObj);
    }
      
      formData.append("standard", values.standard || true);
      formData.append("upgrade", values.upgrade || true);
   
    if (isEditing) {
        await dispatch(updateFacade({ data: formData, facadeId: editingFacade.facadeId })).unwrap();
      setIsModalVisible(false);
      message.success("Facade updated successfully");
    } else {
        await dispatch(createFacade(formData)).unwrap();
        setIsModalVisible(false);
        message.success("Facade created successfully");
      }
    } catch (error) {
      message.error(error || "Failed to create Facade");
    } finally {
      setIsEditing(false);
      setIsModalVisible(false);
      setLoading(false);
    }
  };

  const handleEdit = (facade: IFacadeState) => {
    setIsEditing(true);
    const image = facade.image;
    const mappedFacade = {
      facadeId: facade.facadeId,
      name: facade.name,
      dwelling_type: facade.dwellingTypeName,
      logo: facade.image,
      standard: facade.standard ? "TRUE" : "FALSE",
      upgrade: facade.upgrade ? "TRUE" : "FALSE",
    };
    setEditingFacade(mappedFacade);
    setIsModalVisible(true);
  };

  const handleDelete = async (facadeId: string) => {
    try {
      setIsDeleting(true);
      await dispatch(deleteFacade(facadeId)).unwrap();
      setShowDeleteConfirm(true);
      message.success("Facade deleted successfully");
    } catch (error) {
      message.error(error || "Failed to delete Facade");
    } finally {
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  };
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px]/[30px] font-bold text-var(--font-color)">
          Facade Management
        </h2>
        <button
          className="btn large bg-primary cursor-pointer text-white"
          onClick={handleOpenModal}
        >
          Create Facade
        </button>
      </div>
      
      {status == Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>
      ) : facades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facades?.map((facade: IFacadeState) => (
          <div className="card bg-card-color p-4 rounded-xl flex flex-col items-center border border-border-color relative group">
            {/* Hover overlay with blur effect */}
            <div className="absolute inset-0 bg-black-50 bg-opacity-50 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
              <button
                className="p-2 bg-white bg-opacity-80 text-black rounded-full hover:bg-opacity-100 transition-all duration-200"
                onClick={() => handleEdit(facade)}
              >
                <IconEdit />
              </button>
              <button
                className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setFacadeId(facade.facadeId);
                }}
              >
                <IconTrash className="text-red-600" />
              </button>
            </div>

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
                  <span>
                    {enumToReadable(facade?.dwellingTypeName || "N/A")}
                  </span>
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
                  <span>{facade?.createdAt?.split("T")[0]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <Empty description={
            <span className="text-gray-500">No facade found. Create your first facade to get started.</span>
          }
          className="py-12"
        />
      )}
        <CreateFormModal
          title="Facade Plan"
          open={isModalVisible}
        isEditing={isEditing}
        initialValues={editingFacade}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditing(false);
          setEditingFacade(null);
        }}
          onSubmit={handleCreateFacade}
          fields={facadeFields()}
          loading={loading}
        />
      <ConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => handleDelete(facadeId)}
        message="Are you sure you want to delete this facade?"
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        maxWidth="sm"
      />
    </div>
  );
};

export default Facade;
