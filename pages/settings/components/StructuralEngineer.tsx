'use client';

import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tooltip, message, Switch, Form } from 'antd';
import { IconPencil, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { createStructuralThunk, getStructuralThunk, updateStructuralThunk } from '@redux/feature/structuralengg/structuralEnggThunk';

interface StructuralEngineerType {
  structureEngineerId: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  isNew?: boolean;
}

const StructuralEngineerPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { status, structuralengg } = useAppSelector((state: RootState) => state.structural);
  const [editingRow, setEditingRow] = useState<StructuralEngineerType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: StructuralEngineerType | null;
  }>({
    open: false,
    type: null,
    row: null,
  });

  useEffect(() => {
    fetchStructuralEngineers();
  }, []);

  const fetchStructuralEngineers = async () => {
    try {
      await dispatch(getStructuralThunk()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch structural engineers');
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!isModalOpen.row) return;
    try {
      await dispatch(updateStructuralThunk({
        id: isModalOpen.row.structureEngineerId,
        payload: {
          name: isModalOpen.row.name,
          email: isModalOpen.row.email,
          phone: isModalOpen.row.phone,
          isActive: false
        }
      })).unwrap();
      message.success('Item deactivated');
      setIsModalOpen({ open: false, type: null, row: null });
      fetchStructuralEngineers();
    } catch (error) {
      message.error(error || 'Failed to deactivate item');
    }
  };

  const handleActivateConfirm = async () => {
    if (!isModalOpen.row) return;
    try {
      await dispatch(updateStructuralThunk({
        id: isModalOpen.row.structureEngineerId,
        payload: {
          name: isModalOpen.row.name,
          email: isModalOpen.row.email,
          phone: isModalOpen.row.phone,
          isActive: true
        }
      })).unwrap();
      message.success('Item activated');
      setIsModalOpen({ open: false, type: null, row: null });
      fetchStructuralEngineers();
    } catch (error) {
      message.error(error || 'Failed to activate item');
    }
  };

  const handleAddNew = () => {
    const tempId = Date.now().toString();
    const newRow: StructuralEngineerType = {
      structureEngineerId: tempId,
      name: '',
      email: '',
      phone: '',
      isActive: true,
      isNew: true,
    };
    setEditingRow(newRow);
    form.setFieldsValue(newRow);
  };

  const saveEdit = async () => {
    if (!editingRow) return;
    try {
      const values = await form.validateFields();
      if (editingRow.isNew) {
        await dispatch(createStructuralThunk(values)).unwrap();
        message.success('Structural engineer created successfully!');
      } else {
        // For updates, send all values directly
        await dispatch(updateStructuralThunk({
          id: editingRow.structureEngineerId,
          payload: values
        })).unwrap();
        message.success('Structural engineer updated successfully!');
      }
      setEditingRow(null);
      form.resetFields();
      fetchStructuralEngineers();
    } catch (error) {
      console.error('Save error:', error);
      message.error(error || 'Failed to save structural engineer');
    }
  };

  const cancelEdit = () => {
    setEditingRow(null);
    form.resetFields();
  };

  const handleDelete = (record: StructuralEngineerType) => {
    setIsModalOpen({ open: true, type: 'deactivate', row: record });
  };

  const dataSource = editingRow?.isNew 
    ? [editingRow, ...(structuralengg || [])]
    : structuralengg || [];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, row: StructuralEngineerType) => {
        const inactive = row.isActive === false;
        const editable = editingRow?.structureEngineerId === row.structureEngineerId;
        return (
          <div className={inactive ? 'opacity-45' : ''}>
            {editable ? (
              <Form.Item name="name" rules={[{ required: true, message: 'Enter Name' }]}>
                <Input
                  value={row.name}
                  placeholder="Enter name"
                  autoFocus
                  disabled={status === Status.PENDING}
                />
              </Form.Item>
            ) : (
              <span>{row.name}</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (_, row: StructuralEngineerType) => {
        const inactive = row.isActive === false;
        const editable = editingRow?.structureEngineerId === row.structureEngineerId;
        return (
          <div className={inactive ? 'opacity-45' : ''}>
            {editable ? (
              <Form.Item name="email" rules={[
                { required: true, message: 'Enter Email' },
                { type: 'email', message: 'Enter valid email' }
              ]}>
                <Input
                  value={row.email}
                  placeholder="Enter email"
                  disabled={status === Status.PENDING}
                />
              </Form.Item>
            ) : (
              <span>{row.email}</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      render: (_, row: StructuralEngineerType) => {
        const inactive = row.isActive === false;
        const editable = editingRow?.structureEngineerId === row.structureEngineerId;
        return (
          <div className={inactive ? 'opacity-45' : ''}>
            {editable ? (
              <Form.Item name="phone" rules={[{ required: true, message: 'Enter Phone' }]}>
                <Input
                  value={row.phone}
                  placeholder="Enter phone"
                  disabled={status === Status.PENDING}
                />
              </Form.Item>
            ) : (
              <span>{row.phone}</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      width: 100,
      render: (_, row: StructuralEngineerType) => {
        const inactive = row.isActive === false;
        const editable = editingRow?.structureEngineerId === row.structureEngineerId;
        return (
          <div className={`text-center ${inactive ? 'opacity-45' : ''}`}>
            {editable ? (
              <Form.Item name="isActive" valuePropName="checked">
                <Switch
                  size="small"
                  checked={!!row?.isActive}
                  disabled={status === Status.PENDING}
                />
              </Form.Item>
            ) : (
              <Switch checked={!!row.isActive} disabled size="small" />
            )}
          </div>
        );
      },
    },
    {
      title: '',
      width: 160,
      render: (_, row: StructuralEngineerType) => {
        const inactive = row.isActive === false;

        if (inactive) {
          return (
            <div className="text-right">
              <Tooltip title="Reactivate this item">
                <Button
                  type="text"
                  icon={<IconPlus size={18} />}
                  onClick={() => setIsModalOpen({ open: true, type: 'activate', row })}
                />
              </Tooltip>
            </div>
          );
        }

        const editing = editingRow?.structureEngineerId === row.structureEngineerId;

        if (editing) {
          return (
            <div className="text-right">
              <Space>
                <Tooltip title="Save">
                  <Button
                    type="text"
                    icon={<IconCheck size={18} className="text-green-500" />}
                    onClick={saveEdit}
                    loading={status === Status.PENDING}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="text"
                    icon={<IconX size={18} className="text-red-500" />}
                    onClick={cancelEdit}
                  />
                </Tooltip>
              </Space>
            </div>
          );
        }

        return (
          <div className="text-right">
            <Space>
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<IconPencil size={18} />}
                  onClick={() => {
                    setEditingRow(row);
                    form.setFieldsValue(row);
                  }}
                  disabled={!!editingRow}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  type="text"
                  icon={<IconTrash size={18} className="text-red-500" />}
                  onClick={() => handleDelete(row)}
                  disabled={!!editingRow}
                />
              </Tooltip>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Structural Engineers</h1>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={handleAddNew}
          disabled={!!editingRow}
        >
          New
        </Button>
      </div>
      <Form form={form}>
        <Table
          rowKey="structureEngineerId"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="middle"
          rowClassName={record => (record.isActive === false ? 'bg-gray-50' : '')}
          loading={status === Status.PENDING}
        />
      </Form>

      <ConfirmationModal
        open={isModalOpen.open}
        onClose={() => setIsModalOpen({ open: false, row: null, type: null })}
        onConfirm={
          isModalOpen.type === 'activate' ? handleActivateConfirm : handleDeactivateConfirm
        }
        title={isModalOpen.type === 'activate' ? 'Activate this item?' : 'Deactivate this item?'}
        message={
          isModalOpen.row
            ? `Are you sure you want to ${
                isModalOpen.type === 'activate' ? 'activate' : 'deactivate'
              } "${isModalOpen.row.name}"? This will make it ${
                isModalOpen.type === 'activate' ? 'available again' : 'unavailable for assignment'
              }.`
            : 'Confirm Activation'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
        loading={status === Status.PENDING}
      />
    </div>
  );
};

export default StructuralEngineerPage;
