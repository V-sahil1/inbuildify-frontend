import React, { useState } from 'react';
import { Form, Input, Button, Space, Tabs, Typography, Divider, Card, Row, Col, Select } from 'antd';
import { 
  IconPlus,
  IconUser,
  IconMail,
  IconPhone,
  IconX,
  IconMapPin,
  IconBuilding,
  IconHome2,
  IconAddressBook
} from '@tabler/icons-react';
import type { TabsProps } from 'antd';
import { LeadDetails } from '@/pages/leads/data/types';
import dayjs from 'dayjs';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Primary' | 'Secondary';
}

interface LeadDetailsFormProps {
  initialValues: LeadDetails & { contacts?: Contact[] };
  onSave: (values: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const { Option } = Select;

const LeadDetailsForm: React.FC<LeadDetailsFormProps> = ({
  initialValues,
  onSave,
  onCancel,
  isSubmitting = false,
}) => {
  const [form] = Form.useForm();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(initialValues.contacts || []);
  
  // Set initial form values
  const [formValues, setFormValues] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    address: initialValues.address || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    zipCode: initialValues.zipCode || '',
    country: initialValues.country || 'Australia',
    source: initialValues.source || '',
    status: initialValues.status || 'New',
    notes: initialValues.notes || '',
    contacts: initialValues.contacts || []
  });

  const handleAddContact = () => {
    setShowContactForm(true);
  };

  const handleCancelContact = () => {
    setShowContactForm(false);
  };

  const handleSaveContact = (contact: Contact) => {
    const updatedContacts = [...contacts, { ...contact, id: Date.now().toString() }];
    setContacts(updatedContacts);
    setFormValues(prev => ({ ...prev, contacts: updatedContacts }));
    setShowContactForm(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...values, contacts });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleFormChange = (changedValues: any, allValues: any) => {
    setFormValues(prev => ({ ...prev, ...allValues }));
  };

  const renderMainForm = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={formValues}
      onValuesChange={handleFormChange}
      className="space-y-4"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input prefix={<IconUser size={16} />} placeholder="Full Name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input prefix={<IconMail size={16} />} placeholder="Email Address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="phone" label="Phone">
            <Input prefix={<IconPhone size={16} />} placeholder="Phone Number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="status" label="Status" initialValue="New">
            <Select>
              <Option value="New">New</Option>
              <Option value="Contacted">Contacted</Option>
              <Option value="Qualified">Qualified</Option>
              <Option value="Lost">Lost</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="address" label="Address">
        <Input.TextArea rows={2} placeholder="Street Address" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="city" label="City">
            <Input placeholder="City" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="state" label="State/Province">
            <Input placeholder="State/Province" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="zipCode" label="ZIP/Postal Code">
            <Input placeholder="ZIP/Postal Code" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="source" label="Lead Source">
        <Select placeholder="Select source">
          <Option value="Website">Website</Option>
          <Option value="Referral">Referral</Option>
          <Option value="Social Media">Social Media</Option>
          <Option value="Advertisement">Advertisement</Option>
        </Select>
      </Form.Item>

      <Form.Item name="notes" label="Notes">
        <Input.TextArea rows={3} placeholder="Additional notes" />
      </Form.Item>

      <div className="flex justify-between items-center">
        <Button type="primary" onClick={handleAddContact} icon={<IconPlus size={16} />}>
          Add New
        </Button>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit} loading={isSubmitting}>
            Save Changes
          </Button>
        </Space>
      </div>
    </Form>
  );

  const renderContactForm = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography.Title level={4} className="m-0">Add New Contact</Typography.Title>
        <Button type="text" icon={<IconX />} onClick={handleCancelContact} />
      </div>
      
      <Form
        layout="vertical"
        onFinish={handleSaveContact}
        initialValues={{ type: 'Secondary' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input prefix={<IconUser size={16} />} placeholder="Full Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input prefix={<IconMail size={16} />} placeholder="Email Address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone" label="Phone">
              <Input prefix={<IconPhone size={16} />} placeholder="Phone Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="type" label="Contact Type">
              <Select>
                <Option value="Primary">Primary</Option>
                <Option value="Secondary">Secondary</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end space-x-2 mt-6">
          <Button onClick={handleCancelContact}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save Contact
          </Button>
        </div>
      </Form>
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg">
      {showContactForm ? renderContactForm() : renderMainForm()}
    </div>
  );
};

export default LeadDetailsForm;
