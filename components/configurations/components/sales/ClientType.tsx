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
import { clientTypeData } from 'data/configuration/leadsourceData';

interface ClientType {
  id: number;
  type: string;
  sort: number;
  isActive?: boolean;
  isDraft?: boolean;
}

export const ClientType: React.FC = () => {
  const [data, setData] = useState<ClientType[]>(clientTypeData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<Partial<ClientType>>({});
  const [isAdding, setIsAdding] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: ClientType | null;
  }>({
    open: false,
    type: null,
    row: null,
  });

  // Utility: ensure list is sorted by sort asc
  const sorted = (list: ClientType[]) => [...list].sort((a, b) => a.sort - b.sort);

  // Utility: insert a new item at desiredSort (1-indexed). If desiredSort > length -> append.
  const insertAtSort = (prev: ClientType[], newItem: ClientType, desiredSort?: number) => {
    const list = sorted(prev);
    const maxPos = list.length + 1;
    const pos = Math.min(
      Math.max(1, Number.isFinite(desiredSort as number) ? (desiredSort as number) : 1),
      maxPos
    );
    const newList = [...list.slice(0, pos - 1), newItem, ...list.slice(pos - 1)];
    return newList.map((item, idx) => ({ ...item, sort: idx + 1 }));
  };

  // Utility: move existing item to desiredSort and apply updates from editingRow
  const moveExistingItem = (
    prev: ClientType[],
    id: number,
    updates: Partial<ClientType>,
    desiredSort?: number
  ) => {
    const list = sorted(prev);
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return prev;
    const item = { ...list[idx], ...updates };
    // remove the item
    const others = list.filter((_, i) => i !== idx);
    const maxPos = others.length + 1;
    const pos = Math.min(
      Math.max(1, Number.isFinite(desiredSort as number) ? (desiredSort as number) : item.sort),
      maxPos
    );
    const newList = [...others.slice(0, pos - 1), item, ...others.slice(pos - 1)];
    return newList.map((it, i) => ({ ...it, sort: i + 1 }));
  };

  // Start edit
  const startEdit = (record: ClientType) => {
    setEditingId(record.id);
    setEditingRow({ ...record });
  };

  // Save edit (with new insertion/reorder logic)
  const saveEdit = (id: number) => {
    if (!editingRow.type || editingRow.type.trim() === '') {
      message.error('Client Type cannot be empty');
      return;
    }

    const isNew = id < 0;
    const desiredSortRaw = editingRow.sort;
    const desiredSort = Number(desiredSortRaw);

    if (isNew) {
      // Build final new item (assign a real positive id)
      const finalId = Math.abs(id);
      const newItem: ClientType = {
        ...(editingRow as ClientType),
        id: finalId,
        sort: Number.isFinite(desiredSort) ? desiredSort : 1,
        isDraft: false,
      } as ClientType;

      setData(prev => {
        // remove temporary negative id if present, then insert at position
        const prevClean = prev.filter(item => item.id !== id);
        return insertAtSort(prevClean, newItem, newItem.sort);
      });

      setIsAdding(false);
    } else {
      // Existing item: update fields and if sort changed or provided, move accordingly
      setData(prev => {
        const current = prev.find(p => p.id === id);
        if (!current) return prev;

        const updatedFields: Partial<ClientType> = {
          ...editingRow,
          isDraft: false,
        };

        // If sort provided and different, move item
        if (Number.isFinite(desiredSort) && desiredSort !== current.sort) {
          return moveExistingItem(prev, id, updatedFields, desiredSort);
        }

        // Otherwise just update the item in place (keep sort)
        return prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
      });
    }

    setEditingId(null);
    setEditingRow({});
    message.success('Changes saved successfully');
  };

  // Cancel edit (remove temporary row if adding)
  const cancelEdit = () => {
    if (isAdding && editingId) {
      setData(prev => prev.filter(item => item.id !== editingId));
      setIsAdding(false);
    }
    setEditingId(null);
    setEditingRow({});
  };

  // Add new (temporary) row
  const handleAdd = () => {
    const newRow: ClientType = {
      id: -Date.now(), // temporary negative ID
      type: '',
      sort: 1,
      isActive: true,
      isDraft: true,
    };
    // Insert at start temporarily so user can edit; final position will be decided on save based on the sort value.
    setData(prev => [newRow, ...prev]);
    setEditingId(newRow.id);
    setEditingRow(newRow);
    setIsAdding(true);
  };

  // Modal openers
  const openDeactivateModal = (row: ClientType) =>
    setIsModalOpen({ open: true, type: 'deactivate', row });

  const openActivateModal = (row: ClientType) =>
    setIsModalOpen({ open: true, type: 'activate', row });

  // Confirm modal actions
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

  // Sort change handler (updates editingRow.sort)
  const handleSortChange = (value: number | string) => {
    const num = Number(value);
    setEditingRow(prev => ({
      ...prev,
      sort: isNaN(num) ? undefined : num,
    }));
  };

  // Table Columns
  const columns = [
    {
      title: (
        <div className="flex items-center gap-1">
          Client Type
          <Tooltip title="Reason for marking the opportunity as lost">
            <IconInfoCircle size={14} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'type',
      key: 'type',
      render: (_: any, record: ClientType) => {
        const isEditing = editingId === record.id;
        if (!record.isActive) {
          return <span className="text-gray-400 italic">{record.type}</span>;
        }
        return isEditing ? (
          <Input
            value={editingRow.type}
            onChange={e => setEditingRow(prev => ({ ...prev, type: e.target.value }))}
          />
        ) : (
          record.type
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-1">
          Sort Order
          <Tooltip title="Reorder client types by changing this value">
            <IconInfoCircle size={14} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'sort',
      width: 120,
      render: (sort: number, record: ClientType) => {
        const isEditing = editingId === record.id;
        if (!record.isActive) {
          return <span className="text-gray-400">{record.sort}</span>;
        }
        return (
          <Input
            type="number"
            value={isEditing ? (editingRow.sort ?? '') : sort}
            onChange={e => isEditing && handleSortChange(e.target.value)}
            disabled={!isEditing}
          />
        );
      },
    },
    {
      title: '',
      width: 160,
      render: (_: any, row: ClientType) => {
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
                    Are you sure you want to delete the Client Type?
                    <br />
                    <span className="text-red-500">
                      Note: Already used this Client Type, so please inactivate the Client Type.
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
        <h3 className="font-semibold text-xl">Client Type</h3>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={handleAdd}
          disabled={!!editingId} // disable while editing
        >
          New
        </Button>
      </div>

      <Table
        pagination={false}
        columns={columns}
        dataSource={[...data].sort((a, b) => a.sort - b.sort)}
        rowKey="id"
        size="middle"
      />

      <ConfirmationModal
        open={isModalOpen.open}
        onClose={() => setIsModalOpen({ open: false, row: null, type: null })}
        onConfirm={
          isModalOpen.type === 'activate' ? handleActivateConfirm : handleDeactivateConfirm
        }
        title={
          isModalOpen.type === 'activate' ? 'Activate Client Type?' : 'Deactivate Client Type?'
        }
        message={
          isModalOpen.row
            ? `Are you sure you want to ${
                isModalOpen.type === 'activate' ? 'activate' : 'deactivate'
              } "${isModalOpen.row.type}"? This will ${
                isModalOpen.type === 'activate' ? 'activate' : 'deactivate'
              } it.`
            : 'Confirm Action'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
      />
    </div>
  );
};
