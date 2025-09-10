import React from "react";
import { Card, Space, Typography, Divider, Carousel, Image, Tag, Button, Switch, Row, Col, Empty } from "antd";
import { ColorItem } from "data/types";
import { IconGrid3x3, IconList } from "@tabler/icons-react";

const { Title, Text } = Typography;

interface Props {
  data: ColorItem[];
  isGridView: boolean;
}

// Extracted card content to avoid duplication
const CardContent = ({ item, isGridView }: { item: ColorItem; isGridView: boolean }) => (
  <>
    {/* Top-right button */}
    <div className="absolute top-4 right-4">
      <Button
        type={(item as any).isAdded ?? false ? "default" : "primary"}
        size="small"
      >
        {((item as any).isAdded ?? false) ? "Remove" : "Add"}
      </Button>
    </div>

    <div className={isGridView ? "flex flex-col h-full" : "flex flex-col md:flex-row gap-6 h-full"}>
      {/* Image Carousel */}
      <div className={isGridView ? "w-full" : "w-full md:w-44 flex-shrink-0"}>
        <Carousel dots={true} arrows={isGridView} infinite={false}>
          {item.images.map((img, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg">
              <Image
                src={img}
                alt={`${item.itemName}-${idx}`}
                width={isGridView ? "100%" : 180}
                height={isGridView ? 180 : 120}
                style={{ objectFit: "cover", borderRadius: 8 }}
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
          <Title level={5}>{item.itemName}</Title>
          <Text type="secondary">{item.itemCode}</Text>
          <Divider className="my-2" />
          <Text className="text-gray-700">{item.itemDescription}</Text>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <Text strong>Features: </Text>
              {item.itemFeatures?.split(",").map((feature, idx) => (
                <Tag color="blue" key={idx}>
                  {feature.trim()}
                </Tag>
              ))}
            </div>

            {item.itemSupplier && (
              <div>
                <Text strong>Supplier: </Text>
                <Text>{item.itemSupplier}</Text>
              </div>
            )}
          </div>

          {/* Notes toggle */}
          <div className="mt-2 flex items-center gap-2">
            <Text strong>Notes: </Text>
            <Switch size="small" />
            <Text>Highlight notes on PDF</Text>
          </div>
        </div>
      </div>
    </div>
  </>
);

export const ColorItemCard: React.FC<Props> = ({ data, isGridView }) => {
  console.log("🚀 ~ ColorItemCard ~ data:", data)
  // Conditional rendering for the "No items found" message
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
          {data.map((item) => (
            <Col key={item.key} xs={24} sm={12} md={12} lg={12}>
              <Card
                className="w-full h-full rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
                bodyStyle={{ padding: 16 }}
              >
                <CardContent item={item} isGridView={isGridView} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {data.map((item) => (
            <Card
              key={item.key}
              className="w-full rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
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