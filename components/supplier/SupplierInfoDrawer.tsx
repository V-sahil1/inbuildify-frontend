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
  Tag,
  message,
} from 'antd';
import InputSwitch from '../common/InputSwitch';
import { IconPlus } from '@tabler/icons-react';
import { useSupplierContactColumns } from '@/components/table-columns/SupplierInfoColumns';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { PackageGroupField } from '../package/PackageGroupField';
import { Supplier } from '@redux/feature/supplier/ISupplierState';
import {
  createSupplierType,
  fetchAllSupplierType,
  updateSupplierType,
} from '@redux/feature/supplier/supplierThunk';
import { Status } from '@lib/constants/enum';
import { useStateHook } from '@hooks/useStateHook';

interface SupplierInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: Supplier) => void;
  initialValues?: Supplier;
  isEditing?: boolean;
}

const SupplierInfoDrawer: React.FC<SupplierInfoDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEditing,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { suppliers, supplierType, status } = useAppSelector(state => state.supplier);
  const { columns, contacts, ContactModal } = useSupplierContactColumns(
    isEditing,
    initialValues?.supplierId
  );
  const [emailInput, setEmailInput] = useState('');
  const [emailTags, setEmailTags] = useState<string[]>([]);
  const inductionPackReceived = Form.useWatch('inductionPackReceived', form);
  const { stateOptions } = useStateHook();
  const documentFields = [
    { label: 'Work Cover', name: 'workCoverUrl' },
    { label: 'White Card', name: 'whiteCardUrl' },
    { label: 'PL Insurance', name: 'plInsuranceUrl' },
    { label: 'Fork-Lift License', name: 'forkLiftLicenseUrl' },
    { label: 'Trade License', name: 'tradeLicenseUrl' },
  ];
  useEffect(() => {
    if (status.supplierType.fetch === Status.IDLE) {
      fetchSupplierType();
    }
  }, [status.supplierType.fetch]);

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(initialValues || {});
    }
    if (initialValues?.emails) {
      setEmailTags(initialValues.emails);
    }
  }, [isEditing, initialValues]);

  const fetchSupplierType = async () => {
    try {
      await dispatch(fetchAllSupplierType({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch supplier type');
    }
  };

  const createSupplierTypeData = async (values, selectedType) => {
    try {
      if (!!selectedType) {
        await dispatch(
          updateSupplierType({ data: values, supplierTypeId: selectedType.supplierTypeId })
        ).unwrap();
        message.success('Supplier type updated successfully');
      } else {
        await dispatch(createSupplierType(values)).unwrap();
        message.success('Supplier type created successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to save Supplier type');
    }
  };

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && !emailTags.includes(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const newEmails = [...emailTags, email];
      setEmailTags(newEmails);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const newEmails = emailTags.filter(email => email !== emailToRemove);
    setEmailTags(newEmails);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    if (isEditing) {
      onSubmit?.({ ...values, emails: emailTags });
    } else {
      onSubmit?.({ ...values, emails: emailTags, contacts });
    }
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
      <Form
        form={form}
        layout="vertical"
        className="custom-scrollbar max-h-full overflow-y-auto"
        initialValues={initialValues || null}
      >
        <Row gutter={16} className="mb-2">
          <Col span={24}>
            <Form.Item name="supplierTypeId" label="Supplier Type">
              <PackageGroupField
                form={form}
                formName="supplierTypeId"
                label="Supplier Type"
                fields={[{ label: 'Supplier Type', name: 'name', type: 'text' }]}
                onSubmit={createSupplierTypeData}
                data={supplierType?.map(item => ({
                  ...item,
                  name: item.name,
                  id: item.supplierTypeId,
                }))}
              />
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
            <Form.Item label="Address 1" name="addressLine1">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="City / Suburb" name="city">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="State / Region" name="stateId">
              <Select allowClear placeholder="Select State" options={stateOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Zip / Postal Code" name="zipCode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Lead Time" name="leadTime">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Status" name="status" initialValue={true}>
              <Radio.Group
                options={[
                  { label: 'Active', value: true },
                  { label: 'Inactive', value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex flex-col gap-2">
          <Typography.Text strong>Email Addresses</Typography.Text>

          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              onPressEnter={handleAddEmail}
              className="w-[40%]"
            />

            <Button type="primary" onClick={handleAddEmail} icon={<IconPlus />} />
          </div>
          {emailTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {emailTags.map(email => (
                <Tag key={email} closable onClose={() => handleRemoveEmail(email)} className="mb-1">
                  {email}
                </Tag>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 mb-2 font-medium">Manage Contacts</div>
        <Table
          size="small"
          pagination={false}
          rowKey="id"
          dataSource={
            isEditing
              ? suppliers.find(s => s.supplierId === initialValues?.supplierId)?.contacts
              : contacts
          }
          columns={columns}
        />

        <div className="mt-4 mb-4 font-medium">Manage Documents</div>
        <Row gutter={16}>
          {documentFields.map((row, rowIndex) => (
            <Col span={12} key={row.label}>
              <div className="flex gap-1">
                <Form.Item
                  name={row.name}
                  label={row.label}
                  getValueFromEvent={e => {
                    if (e && e.fileList) {
                      return e.fileList;
                    }
                    return [];
                  }}
                >
                  <Upload beforeUpload={() => false} maxCount={1}>
                    <Button type="primary" size="small">
                      Upload
                    </Button>
                  </Upload>
                </Form.Item>
              </div>
            </Col>
          ))}

          <Col span={12}>
            <div className="flex flex-col gap-1 mt-3">
              <InputSwitch name="inductionPackReceived" label="induction Pack Recieved" />
              {inductionPackReceived && (
                <Form.Item
                  name="inductionPackUrl"
                  label="induction Pack"
                  getValueFromEvent={e => {
                    if (e && e.fileList) {
                      return e.fileList;
                    }
                    return [];
                  }}
                >
                  <Upload beforeUpload={() => false} maxCount={1}>
                    <Button type="primary" size="small">
                      Upload
                    </Button>
                  </Upload>
                </Form.Item>
              )}
            </div>
          </Col>
        </Row>
      </Form>
      {ContactModal}
    </Drawer>
  );
};

export default SupplierInfoDrawer;
