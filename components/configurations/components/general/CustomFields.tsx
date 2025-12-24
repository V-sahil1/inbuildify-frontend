'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Table, Space, Form, Popconfirm, Card, message } from 'antd';
import { IconEdit, IconTrash, IconCheck, IconX, IconList } from '@tabler/icons-react';
import { fieldTypeOptions } from 'data/configuration/ConfigrationData';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
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

const CustomFields: React.FC = () => {
  const { customFieldModule, customField, status } = useAppSelector(
    (state: RootState) => state.general.customField
  );
  const [selectedSection, setSelectedSection] = useState<string | null>();
  const [editingRow, setEditingRow] = useState<CustomField | null>(null);
  const [listOptionsrecord, setListOptionsrecord] = useState<any | null>(null);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const customFieldModuleOptions =
    customFieldModule &&
    customFieldModule.map(item => ({
      label: item.name,
      value: item.moduleId,
    }));
  useEffect(() => {
    if (customFieldModule) {
      setSelectedSection(customFieldModule[0]?.moduleId || null);
    }
  }, [customFieldModule]);
  useEffect(() => {
    async function fetchCustomFieldModule() {
      await dispatch(fetchAllCustomFieldModule()).unwrap();
      // setSelectedSection((customFieldModule && customFieldModule[0]?.moduleId) || null);
    }
    if (status.customFieldModule === Status.IDLE) {
      fetchCustomFieldModule();
    }

    async function fetchCustomField() {
      await dispatch(fetchAllCustomField()).unwrap();
    }
    if (status.fetch === Status.IDLE) {
      fetchCustomField();
    }
  }, []);

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

  const handleOpenListOptions = (record: any) => {
    setListOptionsrecord(record);
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingRow && editingRow.customFieldId !== '') {
        await dispatch(
          updateCustomField({ customFieldId: editingRow.customFieldId, data: { ...values } })
        ).unwrap();
        message.success('CustomField updated Successfully');
      } else {
        await dispatch(createCustomField({ ...values, moduleId: selectedSection })).unwrap();
        message.success('CustomField created Successfully');
      }
      setEditingRow(null);
      form.resetFields();
    } catch (err) {
      message.error(err);
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

  const handleEdit = (record: any) => {
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
      render: (_: any, record: any) =>
        editingRow?.customFieldId === record.customFieldId ? (
          <Form.Item
            name="fieldName"
            rules={[{ required: true, message: '' }]}
            style={{ margin: 0 }}
          >
            <Input />
          </Form.Item>
        ) : (
          record.fieldName
        ),
    },
    {
      title: 'Field Type',
      dataIndex: 'fieldType',
      render: (_: any, record: any) =>
        editingRow?.customFieldId === record.customFieldId ? (
          <Form.Item
            name="fieldType"
            rules={[{ required: true, message: '' }]}
            style={{ margin: 0 }}
          >
            <Select options={fieldTypeOptions} placeholder="Please select" className="w-full" />
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
      render: (_: any, record: any) =>
        editingRow?.customFieldId === record.customFieldId ? (
          <Form.Item
            name="sortOrder"
            rules={[{ required: true, message: '' }]}
            style={{ margin: 0 }}
          >
            <Input type="number" />
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
      render: (_: any, record: any) =>
        editingRow?.customFieldId === record.customFieldId ? (
          <Space>
            <Button
              icon={<IconCheck size={16} />}
              type="primary"
              size="small"
              onClick={handleSave}
            />
            <Button icon={<IconX size={16} />} danger size="small" onClick={handleCancel} />
          </Space>
        ) : (
          <Space>
            <Button icon={<IconEdit size={16} />} size="small" onClick={() => handleEdit(record)} />
            <Popconfirm
              title="Delete this field?"
              onConfirm={() => handleDelete(record.customFieldId)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button icon={<IconTrash size={16} />} danger size="small" />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const filterData = customField && customField.filter(field => field.moduleId === selectedSection);
  const dataSource =
    editingRow && !filterData.some(r => r.customFieldId === editingRow.customFieldId)
      ? [editingRow, ...filterData]
      : filterData;

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
          />
        </Form>
      </Card>

      <ActionDialogmodel
        open={listOptionsrecord}
        onCancel={() => setListOptionsrecord(null)}
        onSubmit={() => setListOptionsrecord(null)}
        title="List Options"
        fields={[
          {
            label: 'List Options',
            name: 'listOptions',
            type: 'text',
            extra: 'here the list of content will come in tabular format',
          },
        ]}
      />
    </div>
  );
};

export default CustomFields;
