"use client"
import { useUsersHook } from '@hooks/useUserData';
import { IconPlus } from '@tabler/icons-react';
import { Button, Space, Input, Switch, Upload, Form, Radio, Typography, message, Select } from 'antd';
import { UploadFile } from 'antd/es/upload';
import Image from 'next/image';
import { useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface TemplateColorItemFormProps {
  templateName: string;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}
// todo: add carousel image when image are selected
export const TemplateColorItemForm: React.FC<TemplateColorItemFormProps> = ({
  templateName,
  onCancel,
  onSubmit,
  initialValues = {}
}) => {
  const { users } = useUsersHook();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<UploadFile | undefined>(initialValues.image);
  const [specificationUrl, setSpecificationUrl] = useState<UploadFile | undefined>(initialValues.specificationImage);
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    try {
      // Handle form submission
      onSubmit(values);
      message.success('Item saved successfully');
    } catch (error) {
      console.error('Error saving item:', error);
      message.error('Failed to save item');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields');
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          costType: 'standard',
          highlightNotes: false,
          ...initialValues
        }}
      >
        <Title level={4} className="!mb-2 text-base">
          {templateName}
        </Title>
        <div className="flex items-start gap-4">
          <div className=" rounded-lg overflow-hidden ">
            <Form.Item name="image" className="mb-0">
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader grid grid-cols-2 gap-2"
                maxCount={10}
                // showUploadList={false}
                accept="image/*"
                beforeUpload={() => false}
                multiple
              >
                {imageUrl && imageUrl !== undefined ? (

                  <Image src={imageUrl?.name} alt="item" width={100} height={100} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <IconPlus size={24} className="mx-auto text-gray-400" />
                    <Text type="secondary" className="text-xs mt-1">
                      Upload Document
                    </Text>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>

          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 gap-x-4 mb-3">
              <div>
                <Text strong className="uppercase text-sm">
                  Item Name
                </Text>
                <Form.Item name="itemName" rules={[{ required: true, message: 'Please input item name' }]}>
                  <Input
                    placeholder=""
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </Form.Item>
              </div>

              <div>
                <Text className="text-sm block">Item Code</Text>
                <Form.Item name="itemCode" rules={[{ required: true, message: 'Please input item code' }]}>
                  <Input
                    placeholder=""
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 mb-3">
              <div>
                <Text strong className="uppercase text-sm mr-2">
                  Cost Type
                </Text>
                <Form.Item name="costType" className="mb-0">
                  <Radio.Group options={[
                    { label: 'Standard', value: 'standard' },
                    { label: 'Upgrade', value: 'upgrade' },
                  ]} />
                </Form.Item>
              </div>

              <div>
                <Text className="text-sm block">Unit</Text>
                <Form.Item name="unit" rules={[{ required: true, message: 'Please input unit' }]}>
                  <Input
                    placeholder=""
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 mb-3">
              <div>
                <Text className="text-sm block">Description</Text>
                <Form.Item name="description" rules={[{ required: true, message: 'Please input description' }]}>
                  <TextArea
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </Form.Item>
              </div>

              <div>
                <Text className="text-sm block">Features</Text>
                <Form.Item name="features" rules={[{ required: true, message: 'Please input features' }]}>
                  <TextArea
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 mb-3 justify-between items-center pt-2">
              <div>
                <Space size="middle">
                  <Text className="text-sm">Notes</Text>
                  <Form.Item name="highlightNotes" valuePropName="checked" noStyle>
                    <Switch size="small" />
                  </Form.Item>
                  <Text type="secondary" className="text-sm">
                    Highlight notes on PDF
                  </Text>
                </Space>
                <Form.Item name="notes" rules={[{ required: true, message: 'Please input notes' }]}>
                  <Input
                    placeholder="Enter notes"
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </Form.Item>
              </div>
              <div>
                <Text className="text-sm block">Supplier</Text>
                <Form.Item name="supplier" rules={[{ required: true, message: 'Please input supplier' }]}>
                  {/* <TextArea
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  /> */}
                  <Select
                    placeholder="Select Supplier"
                    options={users.map(user => ({
                      value: user.usersId,
                      label: user.name,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 mb-3">
              <div>
                <Text className="text-sm block">Specification</Text>
                <Form.Item name="specification" rules={[{ required: true, message: 'Please input specification' }]}>
                  <TextArea
                    placeholder=""
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                  />
                </Form.Item>
              </div>
              <div className="rounded-lg overflow-hidden flex-shrink-0">
                <Form.Item name="specificationImage" className="mb-0">
                  <Upload
                    name="specificationImage"
                    listType="picture-card"
                    className="avatar-uploader"
                    maxCount={10}
                    // showUploadList={false}
                    accept="image/* | pdf"
                    beforeUpload={() => false}
                    multiple
                  >
                    {specificationUrl && specificationUrl !== undefined ? (

                      <Image src={specificationUrl?.name} alt="item" width={100} height={100} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2">
                        <IconPlus size={24} className="mx-auto text-gray-400" />
                        <Text type="secondary" className="text-xs mt-1">
                          Upload Document
                        </Text>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="default" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {initialValues.id ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};