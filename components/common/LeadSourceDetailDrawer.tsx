import { useCountryHook } from '@hooks/useCountryHook';
import { useStateHook } from '@hooks/useStateHook';
import { abnRules, acnNumberRules, nameRules, optionalNameRules, optionalNotesRule, optionalPhoneRule, optionalZipCodeRules, phoneRules } from '@lib/constants/formInputValidations';
import { BusinessContact } from '@redux/feature/lead/ILeadState';
import { IconX } from '@tabler/icons-react';
import { Drawer, Form, Input, Select, Button, Space } from 'antd';
import { useEffect } from 'react';
interface LeadSourceDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: BusinessContact) => void;
  title: string;
  isABNACNShow?: boolean;
  isEditing?: boolean;
  initialValue?: BusinessContact;
}
const LeadSourceDetailsDrawer = ({
  isOpen,
  onClose,
  onSave,
  title,
  isABNACNShow = false,
  isEditing = false,
  initialValue,
}: LeadSourceDetailsFormProps) => {
  const [form] = Form.useForm();
  const { countryOptions } = useCountryHook();
  const { stateOptions } = useStateHook();

  const handleFinish = (values: BusinessContact) => {
    onSave(values);
    form.resetFields();
  };

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(initialValue);
    }
  }, [isEditing]);

  return (
    <Drawer
      title={title}
      size="large"
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
            rules={[{ required: true, message: '' }, ...nameRules]}
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

          <Form.Item name="phone" label={<div>Phone</div>} className="col-span-2 mb-4" rules={optionalPhoneRule}>
            <Input
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item name="address1" label={<div>Address1</div>} className="mb-4" rules={optionalNotesRule}>
            <Input />
          </Form.Item>
          <Form.Item name="address2" label={<div>Address2</div>} className="mb-4" rules={optionalNotesRule}>
            <Input />
          </Form.Item>

          <Form.Item name="city" label={<div>City / Suburb</div>} className="mb-4" rules={optionalNameRules}>
            <Input />
          </Form.Item>
          <Form.Item name="zipCode" label={<div>Zip/Postal Code</div>} className="mb-4" rules={optionalZipCodeRules}>
            <Input
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item name="countryId" label={<div>Country</div>} className="mb-4">
            <Select options={countryOptions} placeholder="Select country" />
          </Form.Item>
          <Form.Item name="stateId" label={<div>State / Region</div>} className="mb-4">
            <Select options={stateOptions} placeholder="Select state" />
          </Form.Item>

          {isABNACNShow && (
            <Form.Item name="abnNumber" label={<div>ABN</div>} className="mb-4" rules={abnRules}>
              <Input
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          )}
          {isABNACNShow && (
            <Form.Item name="acnNumber" label={<div>ACN</div>} className="mb-4" rules={acnNumberRules}>
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
