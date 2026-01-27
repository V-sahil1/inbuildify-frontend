import { IconBath, IconBed, IconCar, IconX } from '@tabler/icons-react';
import { Card, Image, Tag } from 'antd';
const { Meta } = Card;
export const FloorPlanCard = ({ floorplan }) => {
  return (
    <Card
      hoverable
      cover={<Image draggable={false} alt="floorplan" src={floorplan.simpleImage} height={350} />}
    >
      <Meta
        title={floorplan.name}
        description={
          <>
            <div className="flex justify-between">
              <Tag color="orange">{floorplan.dwellingTypeName}</Tag>
              <p>Total Sq: {floorplan.totalArea}</p>
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex justify-between gap-3">
                <span className="flex items-center gap-2">
                  <IconCar size={15} className="text-blue" /> {floorplan.carpark}
                </span>
                <span className="flex items-center gap-2">
                  <IconBath size={15} className="text-blue" /> {floorplan.baths}
                </span>
                <span className="flex items-center gap-2">
                  <IconBed size={15} className="text-blue" /> {floorplan.beds}
                </span>
              </div>
              <span className="flex items-center">
                {floorplan.minLandWidth} <IconX size={10} /> {floorplan.minLandDepth}
              </span>
            </div>
          </>
        }
      />
    </Card>
  );
};
