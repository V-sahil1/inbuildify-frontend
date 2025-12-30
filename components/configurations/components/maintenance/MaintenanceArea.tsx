import React, { useEffect, useState, useMemo } from 'react';
import { Table, Input, Button, Space, Tooltip, message } from 'antd';
import { IconCheck, IconEdit, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createMaintenanceArea,
  fetchMaintenanceArea,
  updateMaintenanceArea,
  deleteMaintenanceArea,
} from '@redux/feature/admin/maintenance/maintenanceArea/maintenanceAreaThunk';
import { Status } from '@lib/constants/enum';
import { MaintenanceArea } from '@redux/feature/admin/maintenance/maintenanceArea/IMaintenanceAreaState';
import ConfirmationModal from '@/components/common/ConfirmationModal';

export const MaintenanceAreaPage = () => {
  const dispatch = useAppDispatch();
  const { maintenanceArea, status } = useAppSelector(state => state.maintenance.maintenanceArea);

  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchMaintenanceAreaData = async () => {
    try {
      await dispatch(fetchMaintenanceArea());
    } catch (error) {
      console.error(error)
      message.error('Failed to fetch maintenance area data');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchMaintenanceAreaData();
    }
  }, [status.fetch]);

  const [editingKey, setEditingKey] = useState<string | number | null>(null);
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const dataSource = useMemo(() => {
    if (isAdding && editingKey && String(editingKey).startsWith('new-')) {
      const tempItem: MaintenanceArea = {
        maintenanceAreaId: editingKey as string,
        name: newValue,
      };
      return [tempItem, ...(maintenanceArea || [])];
    }
    return maintenanceArea || [];
  }, [maintenanceArea, isAdding, editingKey]);

  const getRowKey = (record: MaintenanceArea) => record.maintenanceAreaId;

  const handleAddNew = () => {
    setIsAdding(true);
    const tempKey = `new-${Date.now()}`;
    setEditingKey(tempKey);
    setNewValue('');
  };

  const handleSave = async (id: string | number) => {
    try {
      if (isAdding && id === editingKey) {
        await dispatch(createMaintenanceArea({ name: newValue })).unwrap();
        setIsAdding(false);
      } else {
        const item = maintenanceArea?.find(i => i.maintenanceAreaId === id);
        await dispatch(
          updateMaintenanceArea({
            maintenanceAreaId: id as string,
            name: newValue || item?.name || ''
          })
        ).unwrap();
      }
      setEditingKey(null);
      setNewValue('');
    } catch (error) {
      console.error('Failed to save:', error);
      message.error('Failed to save');
    }
  };

  const handleDeleteClick = (id: string | number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteMaintenanceArea(deleteId as string)).unwrap();
      message.success('Maintenance area deleted successfully');
      if (String(deleteId).startsWith('new-') && editingKey === deleteId) {
        setIsAdding(false);
        setEditingKey(null);
      }

      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      message.error('Failed to delete maintenance area');
    }
  };

  const handleEdit = (record: MaintenanceArea) => {
    const key = getRowKey(record);
    setEditingKey(key);
    setNewValue(record.name);
  };

  const handleCancel = () => {
    if (isAdding) {
      setIsAdding(false);
    }
    setEditingKey(null);
    setNewValue('');
  };

  const isLoading = status.update === Status.PENDING;

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'maintenanceAreaId',
      width: '80px',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Maintenance Area',
      dataIndex: 'name',
      render: (text: string, record: MaintenanceArea) => {
        const currentKey = getRowKey(record);
        return editingKey === currentKey ? (
          <Input value={newValue} onChange={e => setNewValue(e.target.value)} autoFocus disabled={isLoading} />
        ) : (
          <span>{text}</span>
        );
      },
    },
    {
      title: '',
      align: 'right' as const,
      render: (_, record: MaintenanceArea) => {
        const currentKey = getRowKey(record);
        if (editingKey === currentKey) {
          return (
            <Space>
              <Tooltip title="Save">
                <Button
                  type="text"
                  icon={<IconCheck style={{ color: 'green' }} />}
                  onClick={() => handleSave(currentKey)}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  type="text"
                  icon={<IconX style={{ color: 'red' }} />}
                  onClick={() => handleCancel()}
                  disabled={isLoading}
                />
              </Tooltip>
            </Space>
          );
        }
        return (
          <Space>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<IconEdit style={{ color: '#ff9d00ff' }} />}
                onClick={() => handleEdit(record)}
                disabled={isLoading}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<IconTrash style={{ color: 'red' }} />}
                onClick={() => handleDeleteClick(currentKey)}
                disabled={isLoading}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-gray-700 text-lg">Maintenance Area</div>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={handleAddNew}
          disabled={isAdding || editingKey !== null || isLoading}
        >
          New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        rowKey={record => record.maintenanceAreaId}
        rowClassName="text-sm"
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Maintenance Area"
        message="Are you sure you want to delete this maintenance area? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        loading={isLoading}
      />
    </div>
  );
};
