'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Table, Space, Form, Popconfirm, Card, message, Modal } from 'antd';
import { IconEdit, IconTrash, IconCheck, IconX, IconList } from '@tabler/icons-react';
import { fieldTypeOptions } from 'data/configuration/ConfigrationData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import {
  createCustomField,
  deleteCustomField,
  fetchAllCustomField,
  fetchAllCustomFieldModule,
  updateCustomField,
} from '@redux/feature/admin/general/customField/customFieldThunk';
import { Status } from '@lib/constants/enum';
import { CustomField } from '@redux/feature/admin/general/customField/ICustomFieldState';
import { GeneralCustomFieldListModal } from '@/components/common/Models/GeneralCustomFieldListModal';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const CustomFields: React.FC = () => {
  const { customFieldModule, customField, status } = useAppSelector(
    (state: RootState) => state.general.customField
  );
  const [selectedSection, setSelectedSection] = useState<string | null>();
  const [editingRow, setEditingRow] = useState<CustomField | null>(null);
  const [listOptionsrecord, setListOptionsrecord] = useState<CustomField | null>(null);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const customFieldModuleOptions =
    customFieldModule &&
    customFieldModule.map(item => ({
      label: item.name,
      value: item.moduleId,
    }));

  useEffect(() => {
    if (status.customFieldModule === Status.IDLE) {
      fetchCustomFieldModule();
    }
  }, [status.customFieldModule]);

  useEffect(() => {
    if (customFieldModule) {
      setSelectedSection(customFieldModule[0]?.moduleId || null);
    }
  }, [customFieldModule]);

  useEffect(() => {
    if (selectedSection && status.fetch === Status.IDLE) {
      fetchCustomField();
    }
  }, [selectedSection, status.fetch]);

  useEffect(() => {
    if (selectedSection) {
      fetchCustomField();
    }
  }, [selectedSection]);

  async function fetchCustomFieldModule() {
    try {
      await dispatch(fetchAllCustomFieldModule()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch customfield module');
    }
  }
  async function fetchCustomField() {
    try {
      await dispatch(fetchAllCustomField({ moduleId: selectedSection || undefined })).unwrap();
    } catch (error) {
      message.error('Failed to fetch customfield');
    }
  }

  const handleAdd = () => {
    const newRow: CustomField = {
      customFieldId: '',
      moduleId: selectedSection || '',
      fieldName: '',
      fieldType: undefined,
      sortOrder: null,
      isActive: true,
    };
    setEditingRow(newRow);
    form.setFieldsValue(newRow);
  };

  const handleOpenListOptions = (record: CustomField) => {
    setListOptionsrecord(record);
  };
  const handleSave = async () => {
    const values = await form.validateFields();
    try {
      if (editingRow && editingRow.customFieldId !== '') {
        const updatedFields = getUpdatedFields(
          values,
          customField.find(item => item.customFieldId === editingRow.customFieldId)
        );
        if (Object.keys(updatedFields).length === 0) {
          message.info('No changes detected');
          return;
        }
        await dispatch(
          updateCustomField({ customFieldId: editingRow.customFieldId, data: updatedFields })
        ).unwrap();
        message.success('CustomField updated Successfully');
      } else {
        await dispatch(createCustomField({ ...values, moduleId: selectedSection })).unwrap();
        message.success('CustomField created Successfully');
      }
      setEditingRow(null);
      form.resetFields();
    } catch (err) {
      message.error(err || 'Failed to save customfield');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCustomField(id)).unwrap();
      message.success('CustomField deleted Successfully');
    } catch (error) {
      message.error(error);
    }
  };

  const handleEdit = (record: CustomField) => {
    setEditingRow(record);
    form.setFieldsValue(record);
  };

  const handleCancel = () => {
    setEditingRow(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fieldName',
      render: (_, record: CustomField) =>
        editingRow?.customFieldId === record.customFieldId ? (
          <Form.Item
            name="fieldName"
            rules={[{ required: true, message: 'Please enter field name' }]}
            style={{ margin: 0 }}
          >
            <Input disabled={status.create === Status.PENDING} />
          </Form.Item>
        ) : (
          record.fieldName
        ),
    },
    {
      title: 'Field Type',
      dataIndex: 'fieldType',
      render: (_, record: CustomField) =>
        editingRow?.customFieldId === record.customFieldId ? (
          <Form.Item
            name="fieldType"
            rules={[{ required: true, message: 'Please select field type' }]}
            style={{ margin: 0 }}
          >
            <Select
              options={fieldTypeOptions}
              placeholder="Please select"
              className="w-full"
              disabled={status.create === Status.PENDING}
            />
          </Form.Item>
        ) : (
          <div className="flex items-center gap-1">
            {record.fieldType === 'list' && (
              <IconList
                size={14}
                className="cursor-pointer"
                onClick={() => handleOpenListOptions(record)}
              />
            )}
            {fieldTypeOptions.find(opt => opt.value === record.fieldType)?.label ?? '-'}
          </div>
        ),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      width: 120,
      render: (_, record: CustomField) =>
        editingRow?.customFieldId === record.customFieldId ? (
          <Form.Item
            name="sortOrder"
            rules={[{ required: true, message: 'Please enter sort order' }]}
            style={{ margin: 0 }}
          >
            <Input type="number" disabled={status.create === Status.PENDING} />
          </Form.Item>
        ) : (
          record.sortOrder
        ),
    },
    {
      title: (
        <Button type="primary" onClick={handleAdd} disabled={!!editingRow}>
          New
        </Button>
      ),
      width: 100,
      render: (_, record: CustomField) =>
        editingRow?.customFieldId === record.customFieldId ? (
          <Space>
            <Button
              icon={<IconCheck size={16} />}
              type="primary"
              size="small"
              onClick={handleSave}
              loading={status.create === Status.PENDING}
            />
            <Button
              icon={<IconX size={16} />}
              danger
              size="small"
              onClick={handleCancel}
              disabled={status.create === Status.PENDING}
            />
          </Space>
        ) : (
          <Space>
            <Button icon={<IconEdit size={16} />} size="small" onClick={() => handleEdit(record)} />
            <Popconfirm
              title="Delete this field?"
              onConfirm={() => handleDelete(record.customFieldId)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true, loading: status.create === Status.PENDING }}
            >
              <Button
                icon={<IconTrash size={16} />}
                danger
                size="small"
                disabled={status.create === Status.PENDING}
              />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const dataSource = editingRow && !customField.some(r => r.customFieldId === editingRow.customFieldId)
    ? [editingRow, ...customField]
    : customField;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 w-full">
          <Select
            value={selectedSection}
            onChange={setSelectedSection}
            options={customFieldModuleOptions}
            className="w-full"
          />
        </div>
      </div>

      <Card>
        <Form form={form} component={false}>
          <Table
            rowKey="customFieldId"
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            loading={status.fetch === Status.PENDING}
          />
        </Form>
      </Card>
      {listOptionsrecord && (
        <GeneralCustomFieldListModal
          open={!!listOptionsrecord}
          onCancel={() => setListOptionsrecord(null)}
          id={listOptionsrecord.customFieldId}
        />
      )}
    </div>
  );
};

export default CustomFields;
