'use client';
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Select,
  Table,
  Input,
  Switch,
  Button,
  Space,
  Popconfirm,
  message,
  type TableColumnType,
} from 'antd';
import { IconCheck, IconEdit, IconPlus, IconX, IconTrash } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { fetchAllType } from '@redux/feature/admin/construction/constructionType/constructionTypeThunk';
import { fetchAllConstructionStage } from '@redux/feature/admin/construction/constructionStage/constructionStageThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { checklist, checklistItem } from '@redux/feature/admin/general/checklist/IChecklistState';
import {
  createChecklistItem,
  deleteChecklistItem,
  fetchAllChecklistItem,
  updateChecklistItem,
} from '@redux/feature/admin/general/checklist/checklistThunk';
import { ConstructionType } from '@redux/feature/admin/construction/constructionType/IConstructionTypeState';
import { ConstructionStage } from '@redux/feature/admin/construction/constructionStage/IConstructionStageState';

interface ChecklistDrawerProps {
  open: boolean;
  onClose: () => void;
  record: checklist | null;
}

const ChecklistDrawer: React.FC<ChecklistDrawerProps> = ({ open, onClose, record }) => {
  const dispatch = useAppDispatch();
  const { type, status: typeStatus } = useAppSelector(
    (state: RootState) => state.construction.constructionType
  );
  const { stage, status: stageStatus } = useAppSelector(
    (state: RootState) => state.construction.constructionStage
  );
  const { checklistItem, checklistItemStatus } = useAppSelector(
    (state: RootState) => state.general.checklist
  );
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    constructionType: '',
    stage: '',
  });
  const [data, setData] = useState<checklistItem[]>([]);
  const [editingKey, setEditingKey] = useState<string>('');
  const [newItem, setNewItem] = useState(false);
  const [error, setError] = useState<{
    description: string;
    type: string;
    sortOrder: string;
  } | null>(null);
  const typeOption =
    type &&
    type.map((item: ConstructionType) => ({
      label: item.typesName,
      value: item.constructionTypeId,
    }));
  const stageOption =
    stage &&
    stage.map((item: ConstructionStage) => ({
      label: item.stageName,
      value: item.constructionStage,
    }));

  useEffect(() => {
    fetchData();
    if (checklistItem && checklistItem.length > 0) {
      record && setData(checklistItem.filter(item => item.checklistId === record?.checklistId));
    }
    if (type.length > 0 && stage.length > 0) {
      setFilters({
        constructionType: type && type[0].constructionTypeId,
        stage: stage && stage[0].constructionStage,
      });
    }
  }, [typeStatus.fetch, stageStatus.fetch, record, checklistItem]);

  async function fetchData() {
    if (typeStatus.fetch === Status.IDLE) {
      try {
        await dispatch(fetchAllType({})).unwrap();
      } catch (error) {
        message.error(error || 'failed to fetch type');
      }
    }
    if (stageStatus.fetch === Status.IDLE) {
      try {
        await dispatch(fetchAllConstructionStage()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch stages');
      }
    }
    if (
      checklistItemStatus.fetch === Status.IDLE ||
      (checklistItem &&
        checklistItem.length > 0 &&
        checklistItem[0]?.checklistId !== record?.checklistId)
    ) {
      try {
        record?.checklistId &&
          (await dispatch(fetchAllChecklistItem(record?.checklistId)).unwrap());
      } catch (error) {
        message.error(error || 'Failed to fetch checklist items');
      }
    }
  }
  const validateForm = values => {
    const errors = {
      description: '',
      type: '',
      sortOrder: '',
    };
    let isValid = true;
    if (!values.description?.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }
    if (!values.type) {
      errors.type = 'Type is required';
      isValid = false;
    }
    if (!values.sort || values.sort < 1) {
      errors.sortOrder = 'Sort Order is required and must be greater than 0 ';
      isValid = false;
    }

    setError(errors);
    return isValid;
  };
  const handleChange = (key: string, field: string, value: any) => {
    setData(prev =>
      prev.map(item => (item.checklistItemId === key ? { ...item, [field]: value } : item))
    );
  };

  const handleAddNew = () => {
    setError(null);
    if (newItem) return;
    const newRow = {
      checklistItemId: '',
      description: '',
      notes: false,
      isRequired: false,
      type: 'checkbox' as 'dropdown' | 'checkbox',
      sort: data.length + 1,
      checklistId: record?.checklistId,
      constructionTypeId: filters.constructionType,
      constructionStageId: filters.stage,
    };
    setData([...data, newRow]);
    setNewItem(true);
    setEditingKey('');
  };

  const handleEdit = async (id: string) => {
    setEditingKey(id);
  };

  const handleSave = async (values: checklistItem) => {
    if (!validateForm(values)) return;
    const payload = {
      description: values.description,
      notes: values.notes,
      isRequired: values.isRequired,
      type: values.type,
      sort: values.sort,
      checklistId: record.checklistId,
    };
    try {
      if (editingKey === '') {
        await dispatch(
          createChecklistItem({
            ...payload,
            constructionTypeId: filters.constructionType,
            constructionStageId: filters.stage,
          })
        ).unwrap();
        message.success('Created successfully');
      } else {
        const { isUpdated, updatedFields } = getUpdatedFields(
          payload,
          checklistItem.find(item => item.checklistItemId === editingKey)
        );
        if (!isUpdated) {
          message.info('No changes made');
          return;
        }
        await dispatch(
          updateChecklistItem({
            data: updatedFields,
            id: editingKey,
          })
        ).unwrap();
        message.success('Updated successfully');
      }
      setNewItem(false);
      setEditingKey('');
    } catch (error) {
      message.error(error || 'failed to save checklistItem');
    }
  };

  const handleCancel = (id: string) => {
    if (id === '') {
      setData(prev => prev.filter(item => item.checklistItemId !== ''));
      setNewItem(false);
    }
    setEditingKey('');
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteChecklistItem(id)).unwrap();
    } catch (error) {
      message.error('Failed to delete checklist item');
    }
    setData(prev => prev.filter(item => item.checklistItemId !== id));
    message.success('Deleted successfully');
  };

  const columns: TableColumnType<checklistItem>[] = [
    {
      title: 'Description',
      dataIndex: 'description',
      align: 'left' as const,
      render: (_, record: checklistItem) => {
        return editingKey === record.checklistItemId ? (
          <>
            <Input
              placeholder="Enter description"
              value={record.description}
              onChange={e => handleChange(record.checklistItemId, 'description', e.target.value)}
              disabled={checklistItemStatus.create === Status.PENDING}
            />
            {error?.description && <span className="text-red-500">{error?.description}</span>}
          </>
        ) : (
          record.description
        );
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      align: 'center' as const,
      render: (_, record: checklistItem) => (
        <Switch
          checked={record.notes}
          onChange={val => handleChange(record.checklistItemId, 'notes', val)}
          disabled={checklistItemStatus.create === Status.PENDING}
        />
      ),
    },
    {
      title: 'Required',
      dataIndex: 'isRequired',
      align: 'center' as const,
      render: (_, record: checklistItem) => (
        <Switch
          checked={record.isRequired}
          onChange={val => handleChange(record.checklistItemId, 'isRequired', val)}
          disabled={checklistItemStatus.create === Status.PENDING}
        />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (_, record: checklistItem) =>
        editingKey === record.checklistItemId ? (
          <>
            <Select
              style={{ width: '100%' }}
              value={record.type}
              onChange={val => handleChange(record.checklistItemId, 'type', val)}
              options={[
                { label: 'Checkbox', value: 'checkbox' },
                { label: 'Dropdown', value: 'dropdown' },
              ]}
              disabled={checklistItemStatus.create === Status.PENDING}
            />
            {error?.type && <span className="text-red-500">{error?.type}</span>}
          </>
        ) : (
          record.type
        ),
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: '10%',
      render: (_, record: checklistItem) =>
        editingKey === record.checklistItemId ? (
          <>
            <Input
              type="number"
              value={record.sort}
              onChange={e => handleChange(record.checklistItemId, 'sort', e.target.value)}
              disabled={checklistItemStatus.create === Status.PENDING}
            />
            {error?.sortOrder && <span className="text-red-500">{error?.sortOrder}</span>}
          </>
        ) : (
          record.sort
        ),
    },
    {
      title: 'Actions',
      width: '12%',
      align: 'center',
      render: (_, record: checklistItem) => {
        if (editingKey === record.checklistItemId) {
          return (
            <Space>
              <Button
                type="text"
                icon={<IconCheck style={{ color: 'green' }} />}
                onClick={() => handleSave(record)}
                loading={checklistItemStatus.create === Status.PENDING}
              />
              <Button
                type="text"
                icon={<IconX style={{ color: 'red' }} />}
                onClick={() => handleCancel(record.checklistItemId)}
                disabled={checklistItemStatus.create === Status.PENDING}
              />
            </Space>
          );
        }

        return (
          <Space>
            <Button
              type="text"
              icon={<IconEdit style={{ color: 'blue' }} />}
              onClick={() => handleEdit(record.checklistItemId)}
            />
            <Popconfirm
              title="Are you sure to delete this item?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.checklistItemId)}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" icon={<IconTrash style={{ color: 'red' }} />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Drawer
      title={record ? `Checklist Items - ${record.name}` : 'Checklist Items'}
      placement="right"
      width={'60%'}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="Construction Types">
          <Select
            style={{ width: 200 }}
            value={filters.constructionType}
            onChange={val => setFilters(p => ({ ...p, constructionType: val }))}
            options={typeOption}
          />
        </Form.Item>

        <Form.Item label="Stage">
          <Select
            style={{ width: 200 }}
            value={filters.stage}
            onChange={val => setFilters(p => ({ ...p, stage: val }))}
            options={stageOption}
          />
        </Form.Item>

        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={handleAddNew}
          style={{ marginLeft: 'auto' }}
        >
          New
        </Button>
      </Form>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="middle"
        rowKey="key"
        loading={checklistItemStatus.fetch === Status.PENDING}
      />
    </Drawer>
  );
};

export default ChecklistDrawer;
