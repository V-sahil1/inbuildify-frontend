import React from "react";
import { Button, Typography } from "antd";
import FloorPlanCard from "./FloorPlanCard";
import PlanDetailsGrid from "./PlanDetailsGrid";

const { Title } = Typography;

interface AvailablePlansTabProps {
  plans: any[];
  selectedPlan: any;
  onSelectPlan: (plan: any) => void;
}

const AvailablePlansTab: React.FC<AvailablePlansTabProps> = ({
  plans,
  selectedPlan,
  onSelectPlan,
}) => {
  return (
    <div className="flex h-96">
      {/* Left side - Floor plan grid */}
      <div className="flex-1 pr-4">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {plans.map((plan) => (
            <FloorPlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan?.id === plan.id}
              onClick={() => onSelectPlan(plan)}
            />
          ))}
        </div>

        <div className="text-center">
          <Button type="link" className="text-blue-500">
            Click here to add floorplan
          </Button>
        </div>

        {/* Floor Plan Details */}
        {selectedPlan && (
          <div className="mt-6">
            <Title level={5} className="text-gray-600 mb-4">
              Floor Plan Details
            </Title>
            <PlanDetailsGrid details={selectedPlan.details} />
          </div>
        )}
      </div>

      {/* Right side - Selected floor plan image */}
      {selectedPlan && (
        <div className="pl-4 border-l border-gray-200">
          <div className="text-center mb-4">
            <Title level={4} className="text-gray-700">
              {selectedPlan.name}
            </Title>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <img
              src={selectedPlan.detailImage}
              alt={selectedPlan.name}
              className="w-full h-64 object-cover rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailablePlansTab;
