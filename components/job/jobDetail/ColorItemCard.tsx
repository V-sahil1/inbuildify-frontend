import React, { useState, useEffect } from 'react';
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
  Checkbox,
  Select,
  Radio,
} from 'antd';
// import { SubCategoryItem } from '@redux/feature/color/iColourState';
import Loading from '@/components/common/Loading';

const { Title, Text } = Typography;

interface Props {
  data: any[]; //SubCategoryItem[]
  isGridView: boolean;
  loading: boolean;
  onItemToggle?: (itemId: string, isAdded: boolean) => void;
}

// Extracted card content to avoid duplication
const CardContent = (
  { item, isGridView, addedItems, handleToggleItem }: {
    item: any;
    isGridView: boolean;
    addedItems: Set<string>;
    handleToggleItem: (itemId: string) => void;
  } // item:SubCategoryItem
) => {
  const [unitsValue, setUnitsValue] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [notesValue, setNotesValue] = useState('');
  const [highlightNotes, setHighlightNotes] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [featuresValue, setFeaturesValue] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState({});

  // Handle custom field value changes
  const handleCustomFieldChange = (fieldId, value) => {
    setCustomFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Render custom field based on type
  const renderCustomField = (field) => {
    const fieldValue = customFieldValues[field.colorItemCustomFieldId] || '';

    switch (field.fieldType) {
      case 'checkbox':
        return (
          <Checkbox
            checked={fieldValue}
            onChange={(e) => handleCustomFieldChange(field.colorItemCustomFieldId, e.target.checked)}
          />
        );
      case 'text':
        return (
          <Input
            value={fieldValue}
            onChange={(e) => handleCustomFieldChange(field.colorItemCustomFieldId, e.target.value)}
            placeholder={`Enter ${field.fieldName}`}
            size="small"
          />
        );
      case 'dropdown_list':
        return (
          <Select
            value={fieldValue}
            onChange={(value) => handleCustomFieldChange(field.colorItemCustomFieldId, value)}
            placeholder={`Select ${field.fieldName}`}
            size="small"
            style={{ width: '100%' }}
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
          />
        );
      case 'radio_button':
        return (
          <Radio.Group
            value={fieldValue}
            onChange={(e) => handleCustomFieldChange(field.colorItemCustomFieldId, e.target.value)}
            size="small"
          >
            <Radio value="option1">Option 1</Radio>
            <Radio value="option2">Option 2</Radio>
            <Radio value="option3">Option 3</Radio>
          </Radio.Group>
        );
      default:
        return (
          <Input
            value={fieldValue}
            onChange={(e) => handleCustomFieldChange(field.colorItemCustomFieldId, e.target.value)}
            placeholder={`Enter ${field.fieldName}`}
            size="small"
          />
        );
    }
  };

  return (
    <div className={isGridView ? 'flex flex-col h-full' : 'flex flex-col md:flex-row gap-6 h-full'}>
      {/* Image Carousel */}
      <div className={isGridView ? 'w-full relative' : 'w-full md:w-44 flex-shrink-0 relative h-full'}>
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
        {/* Cost Type Badge */}
        {item?.costType && (
          <div className="absolute bottom-10 right-2 bg-white px-2 py-1 rounded-md shadow-md border border-gray-200">
            <Text className="text-xs font-semibold capitalize">
              {item.costType === 'standard' ? 'Standard' : item.costType === 'upgrade' ? item.cost : item.costType}
            </Text>
          </div>
        )}
      </div>



      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between p-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 flex justify-between flex-wrap gap-4">
            <div>
              <Title level={5}>{item.itemName}</Title>
            </div>
            <div>
              <Text strong>Item Code: </Text>
              <Text className="mt-1">{item?.itemCode}</Text>
            </div>
            {/* Price field - only shown when costType is 'upgrade' */}
            {item?.costType === 'upgrade' && (
              <div>
                <Text strong>Price ($): </Text>
                {item?.cost ? (
                  <Text className="mt-1">{item.cost}</Text>
                ) : (
                  <Input
                    size="small"
                    placeholder="Enter price"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    style={{ width: '80px' }}
                  />
                )}
              </div>
            )}
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
            {/* Cost field - calculated as units * price */}
            {item?.costType === 'upgrade' && (
              <div>
                <Text strong>Cost ($): </Text>
                <Text className="mt-1">
                  {unitsValue && (item?.cost || priceValue)
                    ? (parseFloat(unitsValue) * parseFloat(item?.cost)).toFixed(2)
                    : item.cost
                  }
                </Text>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Button
              type={addedItems.has(item.colorItemId) ? 'default' : 'primary'}
              size="small"
              onClick={() => handleToggleItem(item.colorItemId)}
            >
              {addedItems.has(item.colorItemId) ? 'Remove' : 'Add'}
            </Button>
          </div>
        </div>
        <Divider className="my-2" />
        {/* customfield */}
        <div>
          {item?.customFields && item.customFields.length > 0 && (
            <div className="space-y-2 mt-2">
              {item.customFields.map((field) => (
                <div key={field.colorItemCustomFieldId} className="flex items-center gap-2">
                  <Text strong className="text-sm">
                    {field.fieldName}
                    {field.requiredField && <span className="text-red-500 ml-1">*</span>}
                    :
                  </Text>
                  <div className="flex-1">
                    {renderCustomField(field)}
                  </div>
                </div>
              ))}
            </div>
          )}
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
        <div className="mt-auto pt-4">
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
  );
};

export const ColorItemCard: React.FC<Props> = ({ data, isGridView, loading, onItemToggle }) => {
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Initialize added items from data
  useEffect(() => {
    const initialAddedItems = new Set<string>();
    data.forEach(item => {
      if ((item as any).isAdded) {
        initialAddedItems.add(item.colorItemId);
      }
    });
    setAddedItems(initialAddedItems);
  }, [data]);

  const handleToggleItem = (itemId: string) => {
    const isCurrentlyAdded = addedItems.has(itemId);
    const newAddedItems = new Set(addedItems);

    if (isCurrentlyAdded) {
      newAddedItems.delete(itemId);
    } else {
      newAddedItems.add(itemId);
    }

    setAddedItems(newAddedItems);

    // Notify parent component
    if (onItemToggle) {
      onItemToggle(itemId, !isCurrentlyAdded);
    }
  };

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
                className={`w-full h-full rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative ${addedItems.has(item.colorItemId) ? 'border border-green-500' : ''
                  }`}
                bodyStyle={{ padding: 16, height: '100%' }}
              >
                <CardContent
                  item={item}
                  isGridView={isGridView}
                  addedItems={addedItems}
                  handleToggleItem={handleToggleItem}
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {data.map(item => (
            <Card
              key={item?.colorItemId}
              className={`w-full rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative h-full ${addedItems.has(item.colorItemId) ? 'border-2 border-green-500' : ''
                }`}
              bodyStyle={{ padding: 16 }}
            >
              <CardContent
                item={item}
                isGridView={isGridView}
                addedItems={addedItems}
                handleToggleItem={handleToggleItem}
              />
            </Card>
          ))}
        </Space>
      )}
    </div>
  );
};
