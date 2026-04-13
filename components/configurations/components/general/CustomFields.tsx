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
import TooltipButton from '@/components/common/TooltipButton';
import { createSortOrderValidation } from '@lib/constants/formInputValidations';

const CustomFields: React.FC = () => {
  const { customFieldModule, customField, status, pagination } = useAppSelector(
    (state: RootState) => state.general.customField
  );
  const [currentPage, setCurrentPage] = useState(1);
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
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (status.customFieldModule === Status.IDLE) {
      fetchCustomFieldModule();
    }
    if (customFieldModule) {
      setSelectedSection(customFieldModule[0]?.moduleId || null);
    }
  }, [status.customFieldModule]);

  useEffect(() => {
    if (selectedSection) {
      fetchCustomField();
    }
  }, [selectedSection, currentPage]);

  async function fetchCustomFieldModule() {
    try {
      await dispatch(fetchAllCustomFieldModule()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch customfield module');
    }
  }
  async function fetchCustomField(page: number = currentPage, limit: number = PAGE_SIZE) {
    try {
      const params = {
        module_id: selectedSection,
        page,
        limit,
      };
      await dispatch(fetchAllCustomField(params)).unwrap();
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
      sortOrder: (pagination?.totalRecords ?? 0) + 1,
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
        const { isUpdated, updatedFields } = getUpdatedFields(
          values,
          customField.find(item => item.customFieldId === editingRow.customFieldId)
        );
        if (!isUpdated) {
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
      await dispatch(
        fetchAllCustomField({ module_id: selectedSection, page: currentPage, limit: PAGE_SIZE })
      ).unwrap();
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
            rules={[{ required: true, message: 'Please enter field name' },
            { min: 2, message: "minimum 2 character required" },
            { max: 150, message: "maximum 150 character allowed" },
            {
              pattern: /^(?!\s).*\S(?!\s)$/,
              message: 'Name cannot have spaces at the beginning or end'
            }
            ]}
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
            rules={createSortOrderValidation(
              pagination?.totalRecords ?? 0,
              editingRow && editingRow.customFieldId !== ''
            )}
            style={{ margin: 0 }}
          >
            <Input
              type="number"
              onWheel={e => e.currentTarget.blur()}
              disabled={status.create === Status.PENDING}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              min={1}
              max={(pagination?.totalRecords ?? 0) + (editingRow?.customFieldId === '' ? 1 : 0)}
            />
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
              size="small"
              onClick={handleSave}
              type="text"
              loading={status.create === Status.PENDING}
            />
            <Button
              icon={<IconX size={16} color="red" />}
              size="small"
              onClick={handleCancel}
              type="text"
              disabled={status.create === Status.PENDING}
            />
          </Space>
        ) : (
          <Space>
            <TooltipButton
              title="Edit"
              icon={<IconEdit size={16} />}
              onClick={() => handleEdit(record)}
              type="text"
              size="small"
            />
            <Popconfirm
              title="Are you sure you want to delete this field?"
              onConfirm={() => handleDelete(record.customFieldId)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true, loading: status.create === Status.PENDING }}
            >
              <TooltipButton
                title="Delete"
                icon={<IconTrash color="red" size={16} />}
                type="text"
                disabled={status.create === Status.PENDING}
                size="small"
              />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const dataSource =
    editingRow && !customField.some(r => r.customFieldId === editingRow.customFieldId)
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

      <div>
        <Form form={form} component={false}>
          <Table
            rowKey="customFieldId"
            dataSource={dataSource}
            columns={columns}
            loading={status.fetch === Status.PENDING}
            pagination={{
              current: pagination?.currentPage,
              pageSize: pagination?.limit,
              total: pagination?.totalRecords,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) => (
                <p className="text-font-color">
                  {/* {range[0]}-{range[1]} of {total} items */}
                  {range[0]} of {total} items
                </p>
              ),
              onChange: page => {
                setCurrentPage(page);
              },
            }}
          />
        </Form>
      </div>
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
