import React from 'react';
import { Modal, Form, Input, Switch, Button, message, Radio } from 'antd';

interface StructuralEngineerFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
  title?: string;
  loading?: boolean;
}

const StructuralEngineerFormModal: React.FC<StructuralEngineerFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={title || 'New Structural Engineer'}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {initialValues ? 'Update' : 'Save'}
        </Button>,
      ]}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || {
          isActive: true,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder="Enter structural engineer name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input 
            placeholder="Enter email address" 
            disabled={!!initialValues} // Disable when editing (initialValues exist)
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: 'Please enter phone number' },
            { pattern: /^[0-9+\-\s()]+$/, message: 'Only numbers, +, -, (, ) and spaces allowed' }
          ]}
        >
          <Input 
            placeholder="Enter phone number" 
            onKeyPress={(e) => {
              // Allow only numbers, +, -, (, ), space, and backspace
              const char = String.fromCharCode(e.which);
              if (!/[0-9+\-\s()]/.test(char)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Radio.Group>
            <Radio value={true}>Active</Radio>
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StructuralEngineerFormModal;
