import React from 'react';
import { Card } from 'antd';
import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';

interface FloorPlanCardProps {
  plan: IFloorPlanState;
  isSelected: boolean;
  onClick: () => void;
}

const FloorPlanCard: React.FC<FloorPlanCardProps> = ({ plan, isSelected, onClick }) => {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'
      }`}
      styles={{ body: { padding: '8px' } }}
      onClick={onClick}
    >
      <div className="text-center">
        <img
          src={plan?.simpleImage || ''}
          alt={plan?.name || ''}
          loading="lazy"
          className="w-full h-16 object-cover rounded mb-2"
        />
        <div className="text-xs font-medium text-font-color-100">{plan?.name}</div>
      </div>
    </Card>
  );
};

export default FloorPlanCard;
