import React from "react";
import { Row, Col } from "antd";

interface Details {
  beds: number;
  bath: number;
  carpark: number;
  width: number;
  depth: number;
  dwelling: number;
  garage: number;
  porch: number;
  alfresco: number;
  totalSqm: number;
}

interface PlanDetailsGridProps {
  details: Details;
}

const fields = [
  { label: "Beds", key: "beds", span: 4 },
  { label: "Bath", key: "bath", span: 4 },
  { label: "Carpark", key: "carpark", span: 4 },
  { label: "Width (m)", key: "width", span: 6 },
  { label: "Depth (m)", key: "depth", span: 6 },
  { label: "Dwelling", key: "dwelling", span: 4 },
  { label: "Garage", key: "garage", span: 4 },
  { label: "Porch", key: "porch", span: 4 },
  { label: "Alfresco", key: "alfresco", span: 6 },
  { label: "Total (sq)", key: "totalSqm", span: 6 },
];

const PlanDetailsGrid: React.FC<PlanDetailsGridProps> = ({ details }) => {
  return (
    <Row gutter={[8, 8]}>
      {fields.map((f) => (
        <Col key={f.key} span={f.span}>
          <div className="bg-blue-400 text-center py-1 px-2 rounded text-xs font-medium">
            {f.label}
          </div>
          <div className="bg-gray-100 text-center py-2 text-sm font-medium">
            {details[f.key as keyof Details] || 0}
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default PlanDetailsGrid;
