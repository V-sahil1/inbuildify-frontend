import React from 'react';
import { Card, Typography, Button, Space, Input, Switch, Upload, Form, Radio, Select } from 'antd';
import { IconPlus } from '@tabler/icons-react';
import { useUsersHook } from '@hooks/useUserData';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ColorItem {
  id: string;
  name: string;
  image: string;
  itemCode?: string;
  units?: number;
  suppliers?: string;
  description?: string;
  features?: string;
  isAdded?: boolean;
}

interface TemplateColorItemCardProps {
  templateName: string;
  onEdit: () => void;
  onAddNew: () => void;
  onRemove: (id: string) => void;
  onUpdateItem: (id: string, field: string, value: any) => void;
  items: ColorItem[];
}

export const TemplateColorItemCard: React.FC<TemplateColorItemCardProps> = ({
  templateName,
  onUpdateItem,
  items,
}) => {
  const { users } = useUsersHook();
  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} className="mb-4" bodyStyle={{ padding: '16px' }}>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image || '/images/placeholder.png'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-3 gap-x-4 mb-3">
                <div>
                  <Text strong className="uppercase text-sm">
                    {item.name}
                  </Text>
                  <Text type="secondary" className="block text-xs">
                    {item.suppliers ? (
                      item.suppliers
                    ) : (
                      <Select
                        placeholder="Select Supplier"
                        options={users.map(user => ({
                          value: user.usersId,
                          label: user.name,
                        }))}
                      />
                    )}
                  </Text>
                </div>

                <div>
                  <Text className="text-sm block">Item Code</Text>
                  <Input
                    placeholder=""
                    value={item.itemCode || ''}
                    onChange={e => onUpdateItem(item.id, 'itemCode', e.target.value)}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>

                <div className=" ">
                  <Text className="text-sm block">Units</Text>
                  <Input
                    placeholder=""
                    value={item.units || ''}
                    onChange={e => onUpdateItem(item.id, 'units', e.target.value)}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 mb-3">
                <div>
                  <Text className="text-sm block">Description</Text>
                  <TextArea
                    value={item.description || ''}
                    onChange={e => onUpdateItem(item.id, 'description', e.target.value)}
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>

                <div>
                  <Text className="text-sm block">Features</Text>
                  <TextArea
                    value={item.features || ''}
                    onChange={e => onUpdateItem(item.id, 'features', e.target.value)}
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Space size="middle">
                  <Text className="text-sm">Notes</Text>
                  <Switch size="small" />
                  <Text type="secondary" className="text-sm">
                    Highlight notes on PDF
                  </Text>
                </Space>
              </div>
              <Input className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm" />
            </div>
          </div>
        </Card>
      ))}
      <Card className="mb-4" bodyStyle={{ padding: '16px' }}>
        <Form>
          <Title level={4} className="!mb-2 text-base">
            {templateName}
          </Title>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300">
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false} // Prevent auto upload
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="text-center p-2">
                    <IconPlus size={24} className="mx-auto text-gray-400" />
                    <Text type="secondary" className="text-xs mt-1">
                      Upload Image
                    </Text>
                  </div>
                </Upload>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 gap-x-4 mb-3">
                <div>
                  <Text strong className="uppercase text-sm">
                    Item Name
                  </Text>
                  <Input
                    placeholder=""
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>

                <div>
                  <Text className="text-sm block">Item Code</Text>
                  <Input
                    placeholder=""
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 mb-3">
                <div>
                  <Text strong className="uppercase text-sm mr-2">
                    Cost Type
                  </Text>
                  <Radio.Group>
                    <Radio value="standard">standard</Radio>
                    <Radio value="upgrade">Upgrade</Radio>
                  </Radio.Group>
                </div>

                <div>
                  <Text className="text-sm block">Unit</Text>
                  <Input
                    placeholder=""
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 mb-3">
                <div>
                  <Text className="text-sm block">Description</Text>
                  <TextArea
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>

                <div>
                  <Text className="text-sm block">Features</Text>
                  <TextArea
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 mb-3 justify-between items-center pt-2">
                <div>
                  <Space size="middle">
                    <Text className="text-sm">Notes</Text>
                    <Switch size="small" />
                    <Text type="secondary" className="text-sm">
                      Highlight notes on PDF
                    </Text>
                  </Space>
                  <Input className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm" />
                </div>
                <div>
                  <Text className="text-sm block">Supplier</Text>
                  <TextArea
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 mb-3">
                <div>
                  <Text className="text-sm block">Specification</Text>
                  <TextArea
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </div>
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    className=" h-5 w-5 flex items-center justify-center"
                  >
                    <IconPlus size={24} className="mx-auto text-gray-400" />
                  </Upload>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="primary">Add Item</Button>
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};
