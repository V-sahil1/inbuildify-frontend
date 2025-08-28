import React from "react";
import { Row, Col } from "antd";

interface PlanDetailsGridProps {
  details: any; // raw API response
}

const fields = [
  { label: "Beds", key: "beds", span: 6 },
  { label: "Bath", key: "bath", span: 6 },
  { label: "Carpark", key: "carPark", span: 6 },
  { label: "Width (m)", key: "widthMeter", span: 6 },
  { label: "Depth (m)", key: "depthMeter", span: 6 },
  { label: "Dwelling", key: "dwelling", span: 6 },
  { label: "Garage", key: "garage", span: 6 },
  { label: "Porch", key: "porch", span: 6 },
  { label: "Alfresco", key: "alfresco", span: 6 },
  { label: "Total (sq)", key: "totalSqft", span: 6 },
];

const PlanDetailsGrid: React.FC<PlanDetailsGridProps> = ({ details }) => {
  if (!details) return null;

  // Map raw API fields into consistent format
  const mappedDetails = {
    ...details,
    carPark: details.carPark ?? 0,
    widthMeter: details.widthMeter ?? 0,
    depthMeter: details.depthMeter ?? 0,
    totalSqft: details.totalSqft ?? 0,
  };

  return (
    <Row gutter={[12, 12]}>
      {fields.map((f) => {
        const value = mappedDetails[f.key] ?? "—";
        return (
          <Col
            key={f.key}
            xs={12} // 2 columns on mobile
            sm={8}  // 3 columns on tablet
            md={6}  // 4 columns on desktop
            span={f.span}
          >
            <div className="flex flex-col items-center bg-white rounded-lg border border-gray-200 shadow-sm p-3 h-full">
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {f.label}
              </div>
              <div className="text-base font-medium text-gray-800">
                {typeof value === "number" || value ? value : "—"}
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default PlanDetailsGrid;
