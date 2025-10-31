import { IconX } from '@tabler/icons-react';
import { Drawer, Form, Input, Select, Button, Space } from 'antd';
import { useEffect, useState } from 'react';

interface LeadSourceDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  title: string;
  isABNACNShow?: boolean;
}

const { Option } = Select;

const LeadSourceDetailsDrawer = ({
  isOpen,
  onClose,
  onSave,
  title,
  isABNACNShow = false,
}: LeadSourceDetailsFormProps) => {
  const [form] = Form.useForm();
  const [country, setCountry] = useState('Australia');

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  const handleFinish = (values: any) => {
    onSave(values);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const statesByCountry: { [key: string]: string[] } = {
    Australia: ['Victoria', 'New South Wales', 'Queensland', 'Western Australia'],
    USA: ['California', 'New York', 'Texas'],
    Canada: ['Ontario', 'Quebec', 'British Columbia'],
  };

  return (
    <Drawer
      title={title}
      width="30%"
      onClose={onClose}
      open={isOpen}
      bodyStyle={{ padding: 0 }}
      maskClosable={true}
      closeIcon={
        <div className="text-xl px-2 py-1 flex items-center justify-center rounded hover:text-primary">
          <IconX />
        </div>
      }
      className="!bg-body-color"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="px-6 py-4 bg-body-color"
      >
        <div className="grid grid-cols-2 gap-x-6 text-font-color font-medium">
          <Form.Item
            name="name"
            label={<div>Name</div>}
            rules={[{ required: true, message: '' }]}
            className="mb-4 relative"
          >
            <Input className=" rounded focus:shadow-none focus:border-b-blue-500 pl-1" />
          </Form.Item>
          <Form.Item
            name="email"
            label={<div>Email</div>}
            rules={[
              { required: true, message: '' },
              { type: 'email', message: 'Invalid email format' },
            ]}
            className="mb-4 relative"
          >
            <Input className=" rounded focus:shadow-none focus:border-b-blue-500 pl-1" />
          </Form.Item>

          <Form.Item name="phone" label={<div>Phone</div>} className="col-span-2 mb-4">
            <Input />
          </Form.Item>

          <Form.Item name="address1" label={<div>Address1</div>} className="mb-4">
            <Input />
          </Form.Item>
          <Form.Item name="address2" label={<div>Address2</div>} className="mb-4">
            <Input />
          </Form.Item>

          <Form.Item name="city" label={<div>City / Suburb</div>} className="mb-4">
            <Input />
          </Form.Item>
          <Form.Item name="zip" label={<div>Zip/Postal Code</div>} className="mb-4">
            <Input />
          </Form.Item>

          <Form.Item
            name="country"
            label={<div>Country</div>}
            initialValue="Australia"
            className="mb-4"
          >
            <Select onChange={handleCountryChange}>
              <Option value="Australia">Australia</Option>
              <Option value="USA">USA</Option>
              <Option value="Canada">Canada</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="state"
            label={<div>State / Region</div>}
            initialValue="Victoria"
            className="mb-4"
          >
            <Select value={statesByCountry[country]?.[0] || ''}>
              {statesByCountry[country]?.map(state => (
                <Option key={state} value={state}>
                  {state}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {isABNACNShow && (
            <Form.Item name="abn" label={<div>ABN</div>} className="mb-4">
              <Input />
            </Form.Item>
          )}
          {isABNACNShow && (
            <Form.Item name="acn" label={<div>ACN</div>} className="mb-4">
              <Input />
            </Form.Item>
          )}
        </div>

        <div className="flex justify-end pt-4 mt-6">
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              Save
            </Button>
          </Space>
        </div>
      </Form>
    </Drawer>
  );
};

export default LeadSourceDetailsDrawer;
