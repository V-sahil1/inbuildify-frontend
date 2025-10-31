'use client';

import React, { useState } from 'react';
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
import { DwellingTypeData } from 'data/configuration/leadsourceData';

interface DwellingType {
  id: number;
  name: string;
  isActive?: boolean;
  isDraft?: boolean;
}

export const DwellingType: React.FC = () => {
  const [data, setData] = useState<DwellingType[]>(DwellingTypeData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<Partial<DwellingType>>({});
  const [isAdding, setIsAdding] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: DwellingType | null;
  }>({
    open: false,
    type: null,
    row: null,
  });

  // === ADD ===
  const handleAdd = () => {
    const newRow: DwellingType = {
      id: -Date.now(), // temporary negative ID
      name: '',
      isActive: true,
      isDraft: true,
    };
    setData(prev => [newRow, ...prev]); // add at top
    setEditingId(newRow.id);
    setEditingRow(newRow);
    setIsAdding(true);
  };

  // === EDITING ===
  const startEdit = (record: DwellingType) => {
    setEditingId(record.id);
    setEditingRow({ ...record });
  };

  const saveEdit = (id: number) => {
    if (!editingRow.name || editingRow.name.trim() === '') {
      message.error('Dwelling Type cannot be empty');
      return;
    }

    const isNew = id < 0;
    const newItem: DwellingType = {
      ...(editingRow as DwellingType),
      id: isNew ? Date.now() : id,
      isActive: editingRow.isActive ?? true,
      isDraft: false,
    };

    setData(prev => {
      if (isNew) {
        const filtered = prev.filter(item => item.id !== id);
        return [newItem, ...filtered];
      }
      return prev.map(p => (p.id === id ? { ...p, ...newItem } : p));
    });

    setEditingId(null);
    setEditingRow({});
    setIsAdding(false);
    message.success('Changes saved successfully');
  };

  const cancelEdit = () => {
    if (isAdding && editingId) {
      setData(prev => prev.filter(item => item.id !== editingId));
      setIsAdding(false);
    }
    setEditingId(null);
    setEditingRow({});
  };

  // === ACTIVATE / DEACTIVATE ===
  const openDeactivateModal = (row: DwellingType) => {
    setIsModalOpen({ open: true, type: 'deactivate', row });
  };

  const openActivateModal = (row: DwellingType) => {
    setIsModalOpen({ open: true, type: 'activate', row });
  };

  const handleDeactivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;
    setData(prev => prev.map(p => (p.id === row.id ? { ...p, isActive: false } : p)));
    message.success('Item deactivated');
    setIsModalOpen({ open: false, type: null, row: null });
  };

  const handleActivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;
    setData(prev => prev.map(p => (p.id === row.id ? { ...p, isActive: true } : p)));
    message.success('Item activated');
    setIsModalOpen({ open: false, type: null, row: null });
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
      render: (_: any, record: DwellingType) => {
        const isEditing = editingId === record.id;
        if (!record.isActive) {
          return <span className="text-gray-400 italic">{record.name}</span>;
        }
        return isEditing ? (
          <Input
            value={editingRow.name}
            onChange={e => setEditingRow(prev => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          record.name
        );
      },
    },
    {
      title: '',
      width: 160,
      render: (_: any, row: DwellingType) => {
        const inactive = row.isActive === false;
        const editing = editingId === row.id;

        if (inactive) {
          return (
            <div className="text-right">
              <Tooltip title="Reactivate this item">
                <Button
                  type="text"
                  icon={<IconPlus size={18} />}
                  onClick={() => openActivateModal(row)}
                />
              </Tooltip>
            </div>
          );
        }

        if (editing) {
          return (
            <div className="text-right">
              <Space>
                <Tooltip title="Save">
                  <Button
                    type="text"
                    icon={<IconCheck size={18} className="text-green-500" />}
                    onClick={() => saveEdit(row.id)}
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
                  onClick={() => startEdit(row)}
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
                <Button type="text" icon={<IconTrash size={18} className="text-red-500" />} />
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-xl">Dwelling Type</h3>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={handleAdd}
          disabled={!!editingId}
        >
          New
        </Button>
      </div>

      <Table pagination={false} columns={columns} dataSource={data} rowKey="id" size="middle" />

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
      />
    </div>
  );
};
