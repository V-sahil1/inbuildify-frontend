import React, { useState, useEffect } from "react";
import { Modal, Tabs, Button, Typography, Spin } from "antd";
import { Plan } from "data/types";
import AvailablePlansTab from "./AvailablePlansTab";
import CustomPlanTab from "./CustomPlanTab";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { fetchFloorPlans } from "@redux/feature/floorPlan/floorPlanThunk";
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
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<Plan | null>(selectedPlan || null);

  // Update local state when selectedPlan prop changes
  useEffect(() => {
    setSelectedFloorPlan(selectedPlan || null);
  }, [selectedPlan]);

  useEffect(() => {
    if (status.floorPlan === Status.IDLE) { 
      dispatch(fetchFloorPlans(undefined)).unwrap()
    }
  }, [dispatch, status, filters])

  const handleSave = () => {
    if (selectedFloorPlan) {
      dispatch(setQuotationPlan(selectedFloorPlan));
      onSave(selectedFloorPlan);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedFloorPlan(null);
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
      footer={
        <>
          <Button key="save" type="primary" hidden={activeTab === "custom"} onClick={handleSave}>
            Save
          </Button>
        </>
      }
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
              label: "Available",
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
              label: "Custom",
              children: (
                <CustomPlanTab onCancel={handleCancel}/>
              ),
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default FloorPlanModal;
