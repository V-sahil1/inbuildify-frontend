'use client';

import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Radio,
  Typography,
  Upload,
  Table,
} from 'antd';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { initialTypes } from '@/components/table-columns/SupplierTypeColumns';
import InputSwitch from '../common/InputSwitch';
import { IconPlus } from '@tabler/icons-react';
import { useSupplierContactColumns } from '@/components/table-columns/SupplierInfoColumns';

const { Option } = Select;

interface SupplierInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: any) => void;
}

const SupplierInfoDrawer: React.FC<SupplierInfoDrawerProps> = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [supplierTypes, setSupplierTypes] = useState<string[]>(() =>
    Array.from(new Set(initialTypes.map(t => t.name))).filter(Boolean)
  );
  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const { columns, contacts, ContactModal } = useSupplierContactColumns();

  const documentFields = [
    'Work Cover',
    'White Card',
    'PL Insurance',
    'Fork-Lift License',
    'Trade License',
  ];

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        onSubmit?.(values);
        onClose();
      })
      .catch(() => {});
  };

  const handleAddType = () => {
    setAddTypeOpen(true);
  };

  const handleConfirmAddType = (values: { name?: string }) => {
    const trimmed = (values?.name || '').trim();
    if (!trimmed) return;
    setSupplierTypes(prev => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setAddTypeOpen(false);
  };

  const handleCancelAddType = () => {
    setAddTypeOpen(false);
  };

  return (
    <Drawer
      title="Supplier / Tradie Information"
      open={open}
      onClose={handleClose}
      width={900}
      destroyOnClose
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className="custom-scrollbar max-h-full overflow-y-auto">
        <Row gutter={16} className="mb-2">
          <Col span={24}>
            <div className="flex items-center gap-3 mb-2">
              <Typography.Text strong>Supplier Type</Typography.Text>
              <Button size="small" type="primary" onClick={handleAddType}>
                Add Supplier Type
              </Button>
            </div>
            <Form.Item name="supplierTypes">
              <Select
                mode="multiple"
                allowClear
                showSearch
                placeholder="Select supplier type(s)"
                optionFilterProp="children"
              >
                {supplierTypes.map(type => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ABN" name="abn">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Contact Name" name="contactName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Primary Phone" name="primaryPhone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Secondary Phone" name="secondaryPhone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Website" name="website">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Address 1" name="address1">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="City / Suburb" name="city">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="State / Region" name="state">
              <Select allowClear placeholder="Select State">
                <Option value="VIC">Victoria</Option>
                <Option value="NSW">New South Wales</Option>
                <Option value="QLD">Queensland</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Zip / Postal Code" name="postCode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Lead Time" name="leadTime">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Status" name="status" initialValue="active">
              <Radio.Group>
                <Radio value="active">Active</Radio>
                <Radio value="inactive">Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <div className="flex gap-2">
          <Form.Item label="Email" name="email" className="w-[40%]">
            <Input />
          </Form.Item>
          <Form.Item label=" " name="email">
            <Button>
              <IconPlus />
            </Button>
          </Form.Item>
        </div>

        <div className="mt-4 mb-2 font-medium">Manage Contacts</div>
        <Table
          size="small"
          pagination={false}
          rowKey="id"
          dataSource={contacts}
          columns={columns}
        />

        <div className="mt-4 mb-4 font-medium">Manage Documents</div>
        {documentFields
          .reduce<string[][]>((rows, label, index) => {
            if (index % 2 === 0) {
              rows.push([label]);
            } else {
              rows[rows.length - 1].push(label);
            }
            return rows;
          }, [])
          .map((row, rowIndex) => (
            <Row gutter={16} className={rowIndex === 0 ? '' : 'mt-2'} key={row.join('-')}>
              {row.map(label => (
                <Col span={12} key={label}>
                  <div className="flex flex-col gap-1">
                    <Typography.Text>{label}</Typography.Text>
                    <Upload beforeUpload={() => false} maxCount={1}>
                      <Button type="primary" size="small">
                        Upload
                      </Button>
                    </Upload>
                  </div>
                </Col>
              ))}
              {row.length === 1 && (
                <Col span={12}>
                  <div className="flex gap-1 mt-3 flex-col">
                    <InputSwitch name="induction pack recieve" label="induction Pack Recieved" />
                    <Form.Item shouldUpdate noStyle>
                      {() =>
                        form.getFieldValue('induction pack recieve') ? (
                          <div className="flex flex-col gap-1">
                            <Typography.Text>induction Pack</Typography.Text>
                            <Upload beforeUpload={() => false} maxCount={1}>
                              <Button type="primary" size="small">
                                Upload
                              </Button>
                            </Upload>
                          </div>
                        ) : null
                      }
                    </Form.Item>
                  </div>
                </Col>
              )}
            </Row>
          ))}
      </Form>

      <ActionDialogmodel
        title="Create Supplier Type"
        open={addTypeOpen}
        onCancel={handleCancelAddType}
        onSubmit={handleConfirmAddType}
        submitButtonText="Create"
        fields={[
          {
            label: 'Name',
            name: 'name',
            type: 'text' as const,
            placeholder: 'Enter name',
            rules: [{ required: true, message: 'Please enter name' }],
          },
        ]}
      />
      {ContactModal}
    </Drawer>
  );
};

export default SupplierInfoDrawer;
