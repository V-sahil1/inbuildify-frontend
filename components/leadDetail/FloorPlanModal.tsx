import React, { useState, useEffect } from "react";
import { Modal, Tabs, Button, Typography, Spin } from "antd";
import { Plan } from "data/types";
import AvailablePlansTab from "./AvailablePlansTab";
import CustomPlanTab from "./CustomPlanTab";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { fetchFloorPlans, getFloorPlanFilters } from "@redux/feature/floorPlan/floorPlanThunk";
import { setQuotationPlan } from "@redux/feature/quotation/quotationSlice";
import { Status } from '@lib/constants/enum';
import { RootState } from "@redux/feature/store";

const { Title } = Typography;

interface FloorPlanModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (plan: Plan) => void;
  selectedPlan?: Plan;
}

const FloorPlanModal: React.FC<FloorPlanModalProps> = ({
  visible,
  onCancel,
  onSave,
  selectedPlan,
}) => {
  const dispatch = useAppDispatch();
  const {floorPlans, status, filters} = useAppSelector((state: RootState) => state.floorPlan);
  
  const [activeTab, setActiveTab] = useState<"available" | "custom">("available");
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<any>(null);
  const [customPlanName, setCustomPlanName] = useState("");

  useEffect(() => {
    if (status.floorPlan === Status.IDLE) { 
      dispatch(fetchFloorPlans(undefined)).unwrap()
    }
    if (status.filters === Status.IDLE) {
      dispatch(getFloorPlanFilters()).unwrap()
    }
  }, [dispatch, status, filters])

  const handleSave = () => {
    if (activeTab === "available" && selectedFloorPlan) {
      dispatch(setQuotationPlan(selectedFloorPlan));
      onSave(selectedFloorPlan);
    } else if (activeTab === "custom" && customPlanName) {
      // dispatch(setQuotationPlan(customPlan));
      // onSave(customPlan);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedFloorPlan(null);
    setCustomPlanName("");
    onCancel();
  };

  const isLoading = status.floorPlan === Status.PENDING;

  return (
    <Modal
      title={
        <div className="bg-blue-500 text-white">
          <Title level={3} className="text-white mb-0">
            Floor Plan
          </Title>
        </div>
      }
      centered
      open={visible}
      onCancel={handleCancel}
      width={1000}
      footer={[
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
      className="floor-plan-modal"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "available" | "custom")}
          className="custom-tabs"
          items={[
            {
              key: "available",
              label: (
                <span
                  className={`px-4 py-2 rounded ${
                    activeTab === "available"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Available
                </span>
              ),
              children: (
                <AvailablePlansTab
                  plans={floorPlans}
                  selectedPlan={selectedFloorPlan}
                  onSelectPlan={setSelectedFloorPlan}
                />
              ),
            },
            {
              key: "custom",
              label: (
                <span
                  className={`px-4 py-2 rounded ${
                    activeTab === "custom"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Custom
                </span>
              ),
              children: (
                <CustomPlanTab />
              ),
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default FloorPlanModal;
