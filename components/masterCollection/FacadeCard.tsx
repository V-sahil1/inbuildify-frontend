import { Card, Image, Tag } from 'antd';
const { Meta } = Card;

export const FacadeCard = ({ facade }) => {
  return (
    <Card cover={<Image alt="facade" src={facade.image} height={350} />}>
      <Meta
        title={<h1 className="text-xl font-semibold">{facade.name}</h1>}
        description={
          <>
            <Tag color="orange">{facade.dwellingtype.name}</Tag>
            <Tag color="purple">
              {facade.costType === 'upgrade' ? facade.cost : facade.costType}
            </Tag>
          </>
        }
      />
    </Card>
  );
};
