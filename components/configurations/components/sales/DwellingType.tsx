'use client';

import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Tooltip, message, Space, Popconfirm } from 'antd';
import {
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconPencil,
} from '@tabler/icons-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createDwellingType,
  fetchDwellingType,
  updateDwellingStatus,
  updateDwellingType,
} from '@redux/feature/admin/sales/dwellingType/dwellingTypeThunk';
import { Status } from '@lib/constants/enum';
import TooltipButton from '@/components/common/TooltipButton';
import { IDwellingType } from '@redux/feature/admin/sales/dwellingType/IDwelingTypeState';

export const DwellingType: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dwellingType, status } = useAppSelector(state => state.sales.dwellingType);
  const [editingRow, setEditingRow] = useState<IDwellingType | null>(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: IDwellingType | null;
  }>({
    open: false,
    type: null,
    row: null,
  });
  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchData();
    }
  }, [status.fetch]);
  async function fetchData() {
    try {
      await dispatch(fetchDwellingType()).unwrap();
    } catch (error) {
      message.error('Failed to fetch dwelling type');
    }
  }

  // === ADD ===
  const handleAdd = () => {
    const newRow: IDwellingType = {
      dwellingTypeId: '',
      name: '',
      isActive: true,
      isNew: true,
    };
    setEditingRow(newRow);
  };

  const saveEdit = async (id: string) => {
    try {
      if (!editingRow.name || editingRow.name.trim() === '') {
        setError('Dwelling Type cannot be empty');
        return;
      }
      delete editingRow?.dwellingTypeId;
      if (editingRow?.isNew) {
        delete editingRow?.isNew;
        await dispatch(createDwellingType(editingRow)).unwrap();
        message.success('Dwelling Type created successfully');
      } else {
        if (editingRow.name !== dwellingType.find(item => item.dwellingTypeId === id)?.name) {
          await dispatch(updateDwellingType({ data: { name: editingRow.name }, id: id })).unwrap();
          message.success('Dwelling Type updated successfully');
        } else {
          message.info('No changes detected');
          return;
        }
      }
      setEditingRow(null);
    } catch (error) {
      message.error('Failed to save dwelling type');
    }
  };

  // === ACTIVATE / DEACTIVATE ===
  const openDeactivateModal = (row: IDwellingType) => {
    setIsModalOpen({ open: true, type: 'deactivate', row });
  };

  const openActivateModal = (row: IDwellingType) => {
    setIsModalOpen({ open: true, type: 'activate', row });
  };

  const handleDeactivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(
        updateDwellingStatus({ data: { isActive: false }, id: row.dwellingTypeId })
      ).unwrap();
      message.success('Item deactivated successfully');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error('Failed to deactivate dwelling type');
    }
  };

  const handleActivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(
        updateDwellingStatus({ data: { isActive: true }, id: row.dwellingTypeId })
      ).unwrap();
      message.success('Item activated successfully');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error('Failed to deactivate dwelling type');
    }
  };

  // === COLUMNS ===
  const columns = [
    {
      title: (
        <div className="flex items-center gap-1">
          Dwelling Type
          <Tooltip title="List of dwelling types">
            <IconInfoCircle size={14} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (_, record: IDwellingType) => {
        const isEditing = editingRow?.dwellingTypeId === record.dwellingTypeId;
        if (!record.isActive) {
          return <span className="text-gray-400 italic">{record.name}</span>;
        }
        return isEditing ? (
          <>
            <Input
              value={editingRow.name}
              onChange={e => setEditingRow(prev => ({ ...prev, name: e.target.value }))}
              disabled={status.create === Status.PENDING}
            />
            {error && <span className="text-red-500">{error}</span>}
          </>
        ) : (
          record.name
        );
      },
    },
    {
      title: '',
      width: 160,
      render: (_, row: IDwellingType) => {
        const inactive = row.isActive === false;
        const editing = editingRow?.dwellingTypeId === row.dwellingTypeId;

        if (inactive) {
          return (
            <div className="text-right">
              <TooltipButton
                title="Reactivate this item"
                type="text"
                icon={<IconPlus size={16} />}
                onClick={() => openActivateModal(row)}
              />
            </div>
          );
        }

        if (editing) {
          return (
            <div className="text-right">
              <Space>
                <TooltipButton
                  title="Save"
                  type="text"
                  icon={<IconCheck size={16} />}
                  onClick={() => saveEdit(row.dwellingTypeId)}
                  loading={status.create === Status.PENDING}
                />

                <TooltipButton
                  title="Cancel"
                  type="text"
                  icon={<IconX size={16} color="red" />}
                  onClick={() => setEditingRow(null)}
                  disabled={status.create === Status.PENDING}
                />
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
                  icon={<IconPencil size={16} />}
                  onClick={() => setEditingRow({ ...row })}
                />
              </Tooltip>
              <Popconfirm
                title={
                  <div>
                    Are you sure you want to delete this Dwelling Type?
                    <br />
                    <span className="text-red-500">
                      Note: If already used, please inactivate instead.
                    </span>
                  </div>
                }
                onConfirm={() => openDeactivateModal(row)}
                okText="Inactivate"
                cancelText="Cancel"
                placement="top"
              >
                <Button type="text" icon={<IconTrash size={16} color="red" />} />
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];
  const dataSource =
    !!editingRow && editingRow?.isNew ? [editingRow, ...dwellingType] : dwellingType;
  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-xl">Dwelling Type</h3>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={handleAdd}
          disabled={!!editingRow}
        >
          New
        </Button>
      </div>

      <Table
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        size="middle"
        loading={status.fetch === Status.PENDING}
      />

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
              } "${isModalOpen.row.name}"?`
            : 'Confirm Action'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
        loading={status.create === Status.PENDING}
      />
    </div>
  );
};
