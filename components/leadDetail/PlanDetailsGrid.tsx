import React from 'react';
import { Row, Col } from 'antd';

interface PlanDetailsGridProps {
  details: any; // raw API response
}

const fields = [
  { label: 'Beds', key: 'beds', span: 6 },
  { label: 'Bath', key: 'baths', span: 6 },
  { label: 'Carpark', key: 'carpark', span: 6 },
  { label: 'Width (m)', key: 'minLandWidth', span: 6 },
  { label: 'Depth (m)', key: 'minLandDepth', span: 6 },
  { label: 'Dwelling', key: 'dwellingArea', span: 6 },
  { label: 'Garage', key: 'garageArea', span: 6 },
  { label: 'Porch', key: 'porchArea', span: 6 },
  { label: 'Alfresco', key: 'alfrescoArea', span: 6 },
  { label: 'Total (sq)', key: 'totalArea', span: 6 },
];

const PlanDetailsGrid: React.FC<PlanDetailsGridProps> = ({ details }) => {
  if (!details) return null;

  // Map raw API fields into consistent format
  const mappedDetails = {
    ...details,
    carpark: details.carpark ?? 0,
    minLandWidth: details.minLandWidth ?? 0,
    minLandDepth: details.minLandDepth ?? 0,
    totalArea: details.totalArea ?? 0,
  };

  return (
    <Row gutter={[12, 12]}>
      {fields.map(f => {
        const value = mappedDetails[f.key] ?? '—';
        return (
          <Col
            key={f.key}
            xs={12} // 2 columns on mobile
            sm={8} // 3 columns on tablet
            md={6} // 4 columns on desktop
            span={f.span}
          >
            <div className="flex flex-col items-center bg-white rounded-lg border border-gray-200 shadow-sm p-3 h-full">
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {f.label}
              </div>
              <div className="text-base font-medium text-gray-800">
                {typeof value === 'number' || value ? value : '—'}
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default PlanDetailsGrid;
