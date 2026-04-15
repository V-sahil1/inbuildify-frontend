import React, { useState } from 'react';
import {
  Card,
  Space,
  Typography,
  Divider,
  Carousel,
  Image,
  Tag,
  Button,
  Switch,
  Row,
  Col,
  Empty,
  Input,
} from 'antd';
// import { SubCategoryItem } from '@redux/feature/color/iColourState';
import Loading from '@/components/common/Loading';

const { Title, Text } = Typography;

interface Props {
  data: any[]; //SubCategoryItem[]
  isGridView: boolean;
  loading: boolean;
}

// Extracted card content to avoid duplication
const CardContent = (
  { item, isGridView }: { item: any; isGridView: boolean } // item:SubCategoryItem
) => {
  const [unitsValue, setUnitsValue] = useState('');
  const [notesValue, setNotesValue] = useState('');
  const [highlightNotes, setHighlightNotes] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [featuresValue, setFeaturesValue] = useState('');

  return (
    <div className={isGridView ? 'flex flex-col h-full' : 'flex flex-col md:flex-row gap-6 h-full'}>
      {/* Image Carousel */}
      <div className={isGridView ? 'w-full' : 'w-full md:w-44 flex-shrink-0'}>
        <Carousel dots={true}
          arrows={true}
          infinite={false}>
          {item.colorImage.map((img: any) => (
            <div key={img.url} className="overflow-hidden rounded-lg">
              <Image
                src={img.url}
                alt={`${item.name}-${img.url}`}
                width={isGridView ? '100%' : 180}
                height={isGridView ? 180 : 120}
                style={{ objectFit: 'cover', borderRadius: 8 }}
                fallback="/images/placeholder.png"
                preview={true}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between p-2">
        <div>
          <div className="flex justify-between items-start">
            <div className="flex">
              <Title level={5}>{item.itemName}</Title>
            </div>
            <div>
              <Text strong>Item Code: </Text>
              <Text className="mt-1">{item?.itemCode}</Text>
            </div>
            <div className="flex items-center gap-4">
              {/* Units field beside Add button */}
              {item?.units === 'mandatory' && (
                <div className="flex items-center gap-1">
                  <Text strong>Units:</Text>
                  <Input
                    size="small"
                    placeholder="Enter units"
                    value={unitsValue}
                    onChange={(e) => setUnitsValue(e.target.value)}
                    style={{ width: '80px' }}
                  />
                </div>
              )}
              <Button type={((item as any).isAdded ?? false) ? 'default' : 'primary'} size="small">
                {((item as any).isAdded ?? false) ? 'Remove' : 'Add'}
              </Button>
            </div>
          </div>
          <Divider className="my-2" />

          {/* Essential Information */}
          <div className="space-y-2">
            <div>
              <Text strong>Description: </Text>
              {item?.description ? (
                <Text className="text-gray-700">{item?.description}</Text>
              ) : (
                <Input.TextArea
                  placeholder="Enter description..."
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              )}
            </div>

            <div>
              <Text strong>Features: </Text>
              {item?.features ? (
                <Text className="mt-1">{item?.features}</Text>
              ) : (
                <Input.TextArea
                  placeholder="Enter features..."
                  value={featuresValue}
                  onChange={(e) => setFeaturesValue(e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              )}
            </div>
          </div>
          
          {/* Notes Input and Toggle */}
          <div className="mt-auto pt-4 border-t">
            <div className="space-y-3 mt-auto">
              <div>
                <Text strong>Notes: </Text>
                <Input.TextArea
                  placeholder="Enter notes..."
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  size="small"
                  value={highlightNotes}
                  onChange={setHighlightNotes}
                />
                <Text>Highlight notes on PDF</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ColorItemCard: React.FC<Props> = ({ data, isGridView, loading }) => {
  // console.log("data of card", data);
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10 h-96">
        {loading ? (
          <Loading type="primary" />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-gray-500">
                <p className="text-lg font-semibold">No items found</p>
                <p>Try searching for a different item or category.</p>
              </div>
            }
          />
        )}
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center p-10 h-96">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-gray-500">
              <p className="text-lg font-semibold">No items found</p>
              <p>Try searching for a different item or category.</p>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Container */}
      {isGridView ? (
        <Row gutter={[16, 16]} align="stretch">
          {data.map(item => (
            <Col key={item?.colorItemId} xs={24} sm={12} md={12} lg={12}>
              <Card
                className="w-full h-full rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
                bodyStyle={{ padding: 16, height: '100%' }}
              >
                <CardContent item={item} isGridView={isGridView} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {data.map(item => (
            <Card
              key={item?.colorItemId}
              className="w-full rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative h-full"
              bodyStyle={{ padding: 16 }}
            >
              <CardContent item={item} isGridView={isGridView} />
            </Card>
          ))}
        </Space>
      )}
    </div>
  );
};
