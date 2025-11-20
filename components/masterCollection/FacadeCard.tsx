import { Card, Image, Tag } from 'antd';
const { Meta } = Card;

export const FacadeCard = ({ image, title, dwellingType, costType }) => {
  return (
    <Card cover={<Image alt="facade" src={image[0].url} height={350} />}>
      <Meta
        title={title}
        description={
          <>
            <Tag color="orange">{dwellingType}</Tag>
            <Tag color="purple">{costType}</Tag>
          </>
        }
      />
    </Card>
  );
};
