import React from "react";
import { Card } from "antd";

interface FloorPlanCardProps {
  plan: any;
  isSelected: boolean;
  onClick: () => void;
}

const FloorPlanCard: React.FC<FloorPlanCardProps> = ({
  plan,
  isSelected,
  onClick,
}) => {
  return (
    <Card
      key={plan.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-2 border-blue-500 bg-blue-50"
          : "border border-gray-200"
      }`}
      bodyStyle={{ padding: "8px" }}
      onClick={onClick}
    >
      <div className="text-center">
        <img
          src={plan.image}
          alt={plan.name}
          className="w-full h-16 object-cover rounded mb-2"
        />
        <div className="text-xs font-medium text-gray-700">{plan.name}</div>
      </div>
    </Card>
  );
};

export default FloorPlanCard;
