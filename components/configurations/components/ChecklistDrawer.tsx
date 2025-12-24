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
} from 'antd';
import { IconCheck, IconEdit, IconPlus, IconX, IconTrash } from '@tabler/icons-react';
import { checklistDrawerData } from 'data/configuration/ConfigrationData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { fetchAllType } from '@redux/feature/admin/construction/constructionType/constructionTypeThunk';
import { fetchAllStage } from '@redux/feature/admin/construction/constructionStage/constructionStageThunk';
import {
  createChecklistItem,
  deleteChecklistItem,
  fetchAllChecklistItem,
  updateChecklistItem,
} from '@redux/feature/admin/general/checklistItem/checklistItemThunk';

interface ChecklistDrawerProps {
  open: boolean;
  onClose: () => void;
  record: any | null;
}

const ChecklistDrawer: React.FC<ChecklistDrawerProps> = ({ open, onClose, record }) => {
  const dispatch = useAppDispatch();
  const { type, status: typeStatus } = useAppSelector(
    (state: RootState) => state.construction.constructionType
  );
  const { stage, status: stageStatus } = useAppSelector(
    (state: RootState) => state.construction.constructionStage
  );
  const { checklistItem, status: checklistStatus } = useAppSelector(
    (state: RootState) => state.general.checklistItems
  );
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    constructionType: '',
    stage: '',
  });
  const [data, setData] = useState<any[]>([]);
  const [editingKey, setEditingKey] = useState<string>('');
  const [newItem, setNewItem] = useState(false);
  const typeOption =
    type && type.map((item: any) => ({ label: item.typesName, value: item.constructionTypeId }));
  const stageOption =
    stage && stage.map((item: any) => ({ label: item.stageName, value: item.constructionStage }));
  useEffect(() => {
    if (checklistItem && checklistItem.length > 0) {
      setData(checklistItem);
    }
  }, [checklistItem]);

  useEffect(() => {
    if (type.length > 0 && stage.length > 0) {
      setFilters({
        constructionType: type && type[0].constructionTypeId,
        stage: stage && stage[0].constructionStage,
      });
    }
  }, [type, stage]);
  useEffect(() => {
    async function fetchData() {
      if (typeStatus.fetch === Status.IDLE) {
        await dispatch(fetchAllType()).unwrap();
      }
      if (stageStatus.fetch === Status.IDLE) {
        await dispatch(fetchAllStage()).unwrap();
      }
      if (checklistStatus.fetch === Status.IDLE) {
        await dispatch(fetchAllChecklistItem()).unwrap();
      }
    }
    fetchData();
  }, []);

  const handleChange = (key: string, field: string, value: any) => {
    setData(prev => prev.map(item => (item.key === key ? { ...item, [field]: value } : item)));
  };

  const handleAddNew = () => {
    if (newItem) return;
    const newRow = {
      key: 'new',
      description: '',
      notes: false,
      isRequired: false,
      type: 'Checkbox',
      sort: data.length + 1,
    };
    setData([...data, newRow]);
    setNewItem(true);
    setEditingKey('new');
  };

  const handleEdit = async (record: any) => {
    // const payload = data.filter(item => item.key === record.key)[0];
    // await dispatch(
    //   updateChecklistItem({
    //     data: {
    //       ...payload,
    //       checklistId: record.id,
    //       constructionTypeId: filters.constructionType,
    //       constructionStageId: filters.stage,
    //     },
    //     id: record.id,
    //   })
    // ).unwrap();
    setEditingKey(record.key);
  };

  const handleSave = async (record:any) => {
    console.log('record------',record)
    try{
 if (record.key === 'new') {
      const payload = data.filter(item => item.key === 'new')[0];
      delete payload.key;
      await dispatch(
        createChecklistItem({
          ...payload,
          checklistId: record.checklistId,
          constructionTypeId: filters.constructionType,
          constructionStageId: filters.stage,
        })
      ).unwrap();
    }
    else{
    //   await dispatch(
    //   updateChecklistItem({
    //     data: {
    //       ...record,
    //       checklistId: record.id,
    //       constructionTypeId: filters.constructionType,
    //       constructionStageId: filters.stage,
    //     },
    //     id: record.id,
    //   })
    // ).unwrap();
    }
    }
    catch(error){
      message.error(error || 'failed to save checklistItem')
    }
   
    // if (key === 'new') {
    //   const newKey = Date.now().toString();
    //   const updated = data.map(d => (d.key === 'new' ? { ...d, key: newKey } : d));
    //   setData(updated);
      setNewItem(false);
    // }
    setEditingKey('');
    // message.success('Saved successfully');
  };

  const handleCancel = (key: string) => {
    if (key === 'new') {
      setData(prev => prev.filter(item => item.key !== 'new'));
      setNewItem(false);
    }
    setEditingKey('');
  };

  const handleDelete = async (key: string) => {
    try {
      await dispatch(deleteChecklistItem(key)).unwrap();
    } catch (error) {
      message.error('Failed to delete checklist item');
    }
    setData(prev => prev.filter(item => item.key !== key));
    message.success('Deleted successfully');
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      align: 'left' as const,
      render: (_: any, record: any) => {
        return editingKey === record.key ? (
          <Input
            placeholder="Enter description"
            value={record.description}
            onChange={e => handleChange(record.key, 'description', e.target.value)}
          />
        ) : (
          record.description
        );
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.notes}
          onChange={val => handleChange(record.key, 'notes', val)}
          disabled={editingKey !== record.key}
        />
      ),
    },
    {
      title: 'Required',
      dataIndex: 'isRequired',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.isRequired}
          onChange={val => handleChange(record.key, 'isRequired', val)}
          disabled={editingKey !== record.key}
        />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (_: any, record: any) =>
        editingKey === record.key ? (
          <Select
            style={{ width: '100%' }}
            value={record.type}
            onChange={val => handleChange(record.key, 'type', val)}
            options={[
              { label: 'Checkbox', value: 'checkbox' },
              // { label: 'Text', value: 'Text' },
              { label: 'Dropdown', value: 'dropdown' },
            ]}
          />
        ) : (
          record.type
        ),
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: '10%',
      render: (_: any, record: any) =>
        editingKey === record.key ? (
          <Input
            type="number"
            value={record.sort}
            onChange={e => handleChange(record.key, 'sort', e.target.value)}
          />
        ) : (
          record.sort
        ),
    },
    {
      title: 'Actions',
      width: '12%',
      align: 'center',
      render: (_: any, record: any) => {
        if (editingKey === record.key) {
          return (
            <Space>
              <Button
                type="text"
                icon={<IconCheck style={{ color: 'green' }} />}
                onClick={() => handleSave(record)}
              />
              <Button
                type="text"
                icon={<IconX style={{ color: 'red' }} />}
                onClick={() => handleCancel(record.key)}
              />
            </Space>
          );
        }

        return (
          <Space>
            <Button
              type="text"
              icon={<IconEdit style={{ color: 'blue' }} />}
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Are you sure to delete this item?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.id)}
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
            // this will be removed with api call dynamic data
            options={typeOption}
          />
        </Form.Item>

        <Form.Item label="Stage">
          <Select
            style={{ width: 200 }}
            value={filters.stage}
            onChange={val => setFilters(p => ({ ...p, stage: val }))}
            // this will be removed with api call dynamic data
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
        columns={columns as any}
        dataSource={data}
        pagination={false}
        size="middle"
        rowKey="key"
      />
    </Drawer>
  );
};

export default ChecklistDrawer;
