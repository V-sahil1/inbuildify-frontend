import React, { useState } from "react";
import { Modal, Tabs, Button, Typography } from "antd";
import { Plan } from "@/pages/leads/data/types";
import { floorPlansData } from "./mockFloorPlans";
import AvailablePlansTab from "./AvailablePlansTab";
import CustomPlanTab from "./CustomPlanTab";

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
  const [activeTab, setActiveTab] = useState<"available" | "custom">(
    "available"
  );
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<any>(null);
  const [customPlanName, setCustomPlanName] = useState("");
  const [customPlanImage, setCustomPlanImage] = useState<any>(null);

  const handleSave = () => {
    if (activeTab === "available" && selectedFloorPlan) {
      const planToSave: Plan = {
        id: selectedFloorPlan.id,
        name: selectedFloorPlan.name,
        bedrooms: selectedFloorPlan.bedrooms,
        bathrooms: selectedFloorPlan.bathrooms,
        garage: selectedFloorPlan.garage,
        area: `${selectedFloorPlan.area} sqm`,
      };
      onSave(planToSave);
    } else if (activeTab === "custom" && customPlanName) {
      const customPlan: Plan = {
        id: `custom-${Date.now()}`,
        name: customPlanName,
        bedrooms: 0,
        bathrooms: 0,
        garage: 0,
        area: "0 sqm",
      };
      onSave(customPlan);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedFloorPlan(null);
    setCustomPlanName("");
    setCustomPlanImage(null);
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="bg-blue-500 text-white px-6 py-4 -mx-6 -mt-4 mb-4">
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
                plans={floorPlansData}
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
              <CustomPlanTab
                customPlanName={customPlanName}
                setCustomPlanName={setCustomPlanName}
                customPlanImage={customPlanImage}
                setCustomPlanImage={setCustomPlanImage}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default FloorPlanModal;
