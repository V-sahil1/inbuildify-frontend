import React, { useEffect, useState } from "react";
import { IFloorPlanState } from "@redux/feature/floorPlan/IFloorPlanState";
import {
  createFloorPlan,
  deleteFloorPlan,
  fetchFloorPlans,
  getFloorPlanFilters,
  updateFloorPlan,
} from "@redux/feature/floorPlan/floorPlanThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import Image from "next/image";
import { Divider, Empty, Spin, message } from "antd";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { floorPlanFields } from "@/components/formFields/floorPlanFields";
import { Status } from "@lib/constants/enum";
import { RootState } from "@redux/feature/store";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const FloorPlan = () => {
  const dispatch = useAppDispatch();
  const floorPlans = useAppSelector(
    (state: RootState) => state.floorPlan.floorPlans
  );
  const [editingFloorPlan, setEditingFloorPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const status = useAppSelector((state: RootState) => state.floorPlan.status);
  const filters = useAppSelector((state: RootState) => state.floorPlan.filters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [floorPlanId, setFloorPlanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFloorPlansData = async () => {
      try {
        await dispatch(fetchFloorPlans(undefined)).unwrap();
      } catch (error) {
        message.error(error || "Failed to fetch Floor Plans");
      }
    };
    const fetchFiltersData = async () => {
      try {
        await dispatch(getFloorPlanFilters()).unwrap();
      } catch (error) {
        message.error(error || "Failed to fetch Floor Plan Filters");
      }
    };
    if (status?.floorPlan === Status.IDLE) {
      fetchFloorPlansData();
    }
    if (status?.filters === Status.IDLE) {
      fetchFiltersData();
    }
  }, [dispatch, status, filters]);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateFloorPlan = async (values: any) => {
    try {
      setLoading(true);
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
    if (values?.image?.length > 0) {
      formData.append("image", values?.image[0]?.originFileObj);
      }
      if (isEditing) {
        const response = await dispatch(
          updateFloorPlan({
            data: formData,
            floorPlanId: editingFloorPlan.floorPlanId,
          })
        ).unwrap();
        setIsModalVisible(false);
        message.success("Floor Plan updated successfully");
      } else {
      await dispatch(createFloorPlan(formData)).unwrap();
      setIsModalVisible(false);
      message.success("Floor Plan created successfully");
    }
    } catch (error) {
      message.error(error || "Failed to create Floor Plan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (floorPlan: IFloorPlanState) => {
    console.log(floorPlan);
    setIsEditing(true);
    const mappedFloorPlan = {
      floorPlanId: floorPlan.floorPlanId,
      name: floorPlan.name,
      logo: floorPlan.image,
      range: floorPlan.rangeName,
      dwelling_type: floorPlan.dwellingTypeName,
      beds: floorPlan.beds,
      bath: floorPlan.bath,
      car_park: floorPlan.carPark,
      width_meter: floorPlan.widthMeter,
      depth_meter: floorPlan.depthMeter,
      dwelling: floorPlan.dwelling,
      garage: floorPlan.garage,
      porch: floorPlan.porch,
      alfresco: floorPlan.alfresco,
      total_sqft: floorPlan.totalSqft,
    };
    setEditingFloorPlan(mappedFloorPlan);
    setIsModalVisible(true);
  };

  const handleDelete = async (floorPlanId: string) => {
    try {
      setIsDeleting(true);
      await dispatch(deleteFloorPlan(floorPlanId)).unwrap();
      message.success("Floor Plan deleted successfully");
    } catch (error) {
      message.error(error || "Failed to delete Floor Plan");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
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
      {status.floorPlan == Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>
      ) : floorPlans.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2  gap-4 ">
        {floorPlans?.map((floorPlan: IFloorPlanState) => (
          <div
            key={floorPlan.floorPlanId}
            className="card bg-card-color p-4 rounded-xl flex flex-col items-center border border-border-color relative group"
          >
            {/* Hover overlay with blur effect */}
            <div className="absolute inset-0 bg-black-50 bg-opacity-50 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
              <button
                className="p-2 bg-white bg-opacity-80 text-black rounded-full hover:bg-opacity-100 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(floorPlan);
                }}
              >
                <IconEdit />
              </button>
              <button
                className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                  setFloorPlanId(floorPlan.floorPlanId);
                }}
              >
                <IconTrash className="text-red-600" />
              </button>
            </div>
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
              <div className="flex-1 space-y-2 ">
                <div className="flex justify-between text-md  md:text-sm ">
                  <span>Beds :</span>
                  <span>{floorPlan?.beds || "N/A"}</span>
                </div>
                <div className="flex justify-between text-md  md:text-sm ">
                  <span>Bath :</span>
                  <span>{floorPlan?.bath || "N/A"}</span>
                </div>
                <div className="flex justify-between text-md  md:text-sm ">
                  <span>Car Park :</span>
                  <span>{floorPlan?.carPark || "N/A"}</span>
                </div>
                <div className="flex justify-between text-md  md:text-sm ">
                  <span>Width M :</span>
                  <span>{floorPlan?.widthMeter || "N/A"}</span>
                </div>
                <div className="flex justify-between text-md   md:text-sm ">
                  <span>Depth M :</span>
                  <span>{floorPlan?.depthMeter || "N/A"}</span>
                </div>
              </div>

              {/* Vertical Divider */}
              <Divider type="vertical" className="h-auto mx-4" />

              {/* Right Section */}
              <div className="flex-1 space-y-2 ">
                <div className="flex justify-between text-md  md:text-sm">
                  <span>Dwelling :</span>
                  <span>
                    {floorPlan?.dwelling || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-md  md:text-sm">
                  <span>Garage :</span>
                  <span>
                    {floorPlan?.garage || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-md  md:text-sm">
                  <span>Porch :</span>
                  <span>
                    {floorPlan?.porch || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-md  md:text-sm">
                  <span>Alfresco :</span>
                  <span>
                    {floorPlan?.alfresco || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-md  md:text-sm">
                  <span>SQFT :</span>
                  <span>
                    {floorPlan?.totalSqft || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <Empty
          description={
            <span className="text-gray-500">
              No floor plan found. Create your first floor plan to get started.
            </span>
          }
          className="py-12"
        />
      )}
        <CreateFormModal
          title="Floor Plan"
          open={isModalVisible}
        isEditing={isEditing}
        initialValues={editingFloorPlan}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditing(false);
          setEditingFloorPlan(null);
        }}
        onSubmit={handleCreateFloorPlan}
        fields={floorPlanFields()}
        loading={loading}
      />

      <ConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => handleDelete(floorPlanId)}
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
export default FloorPlan;
