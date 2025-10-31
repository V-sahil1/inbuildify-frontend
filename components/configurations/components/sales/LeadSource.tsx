'use client';

import React, { useMemo, useState } from 'react';
import { Table, Input, Button, Space, Tooltip, message, Switch } from 'antd';
import { IconPencil, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { leadSourceData } from 'data/configuration/leadsourceData';

type Item = {
  id: number;
  name: string;
  sort: number;
  allowChange?: boolean;
  isDefault?: boolean;
  isActive?: boolean;
};

const initialData: Item[] = leadSourceData || [];

export const LeadSource: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Partial<Item>>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: Item | null;
  }>({
    open: false,
    type: null,
    row: null,
  });

  const startEdit = (row: Item) => {
    setEditingId(row.id);
    setDrafts(d => ({ ...d, [row.id]: { ...row } }));
  };

  const cancelEdit = (id: number) => {
    if (id < 0) {
      setItems(prev => prev.filter(it => it.id !== id));
      setIsAdding(false);
    }
    setEditingId(null);
    setDrafts(d => {
      const copy = { ...d };
      delete copy[id];
      return copy;
    });
  };

  const saveEdit = (id: number) => {
    const draft = drafts[id];
    if (!draft) return;
    const name = (draft.name || '').trim();
    const sort = Number(draft.sort ?? 0);
    const isDefault = !!draft.isDefault;
    const allowChange = !!draft.allowChange;

    if (!name) {
      message.error('Name cannot be empty');
      return;
    }
    if (!Number.isInteger(sort) || sort < 1) {
      message.error('Sort must be a positive integer');
      return;
    }

    const conflict = items.some(it => it.id !== id && it.isActive !== false && it.sort === sort);
    if (conflict) {
      message.error('Sort order must be unique among active rows');
      return;
    }

    setItems(prev => {
      const exists = prev.some(p => p.id === id);
      let next: Item[] = prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          name,
          sort,
          allowChange,
          isDefault,
          isActive: p.isActive !== false,
        };
      });

      if (!exists) {
        const newId = Date.now();
        next = [
          ...next,
          {
            id: newId,
            name,
            sort,
            allowChange,
            isDefault,
            isActive: true,
          },
        ];
      }

      if (isDefault) {
        next = next.map(p => (p.id === id ? p : { ...p, isDefault: false }));
      }

      return next.slice().sort((a, b) => a.sort - b.sort);
    });

    setEditingId(null);
    setIsAdding(false);
    setDrafts(d => {
      const copy = { ...d };
      delete copy[id];
      return copy;
    });

    message.success('Saved');
  };

  const openDeactivateModal = (row: Item) => {
    if (row.isDefault) {
      message.warning('Default item cannot be deactivated');
      return;
    }
    setIsModalOpen({ open: true, type: 'deactivate', row });
  };

  const handleDeactivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;

    setItems(prev => prev.map(p => (p.id === row.id ? { ...p, isActive: false } : p)));
    message.success('Item deactivated');
    setIsModalOpen({ open: false, type: null, row: null });
  };

  const openActivateModal = (row: Item) => {
    setIsModalOpen({ open: true, type: 'activate', row });
  };

  const handleActivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;

    setItems(prev => prev.map(p => (p.id === row.id ? { ...p, isActive: true } : p)));
    message.success('Item activated');
    setIsModalOpen({ open: false, type: null, row: null });
  };

  const handleAddNew = () => {
    if (isAdding) return;
    const tempId = -Date.now();
    const nextSort = (items.reduce((max, it) => Math.max(max, it.sort || 0), 0) || 0) + 1;
    const newRow: Item = {
      id: tempId,
      name: '',
      sort: nextSort,
      allowChange: true,
      isDefault: false,
      isActive: true,
    };
    setItems(prev => [...prev, newRow].slice().sort((a, b) => a.sort - b.sort));
    setDrafts(d => ({ ...d, [tempId]: { ...newRow } }));
    setEditingId(tempId);
    setIsAdding(true);
  };

  const columns = [
    {
      title: 'Lead Source',
      dataIndex: 'name',
      render: (_: any, row: Item) => {
        const inactive = row.isActive === false;
        const editable = editingId === row.id;
        const draft = drafts[row.id] ?? {};
        return (
          <div className={inactive ? 'opacity-45' : ''}>
            {editable ? (
              <Input
                value={draft.name ?? row.name}
                onChange={e =>
                  setDrafts(d => ({
                    ...d,
                    [row.id]: { ...(d[row.id] ?? row), name: e.target.value },
                  }))
                }
                placeholder="Enter source"
                autoFocus
              />
            ) : (
              <span>
                {row.name}
                {row.isDefault && (
                  <Tooltip title="This is the default lead source">
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      Default
                    </span>
                  </Tooltip>
                )}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 100,
      render: (_: number, record: Item) => {
        const inactive = record.isActive === false;
        const editable = editingId === record.id;
        const draft = drafts[record.id] ?? {};
        return editable ? (
          <div className={`w-full ${inactive ? 'opacity-50' : ''}`}>
            <Input
              type="number"
              value={draft.sort ?? record.sort}
              min={1}
              onChange={e => {
                const val = Number(e.target.value);
                setDrafts(prev =>
                  prev?.[record.id]
                    ? {
                        ...prev,
                        [record.id]: { ...prev[record.id], sort: val },
                      }
                    : prev
                );
              }}
            />
          </div>
        ) : (
          <span className={inactive ? 'opacity-45' : ''}>{record.sort}</span>
        );
      },
    },
    {
      title: 'Allow to change',
      dataIndex: 'allowChange',
      width: 140,
      render: (_: any, row: Item) => {
        const inactive = row.isActive === false;
        const editable = editingId === row.id;
        const draft = drafts[row.id] ?? {};
        return (
          <div className={`text-center ${inactive ? 'opacity-45' : ''}`}>
            {editable ? (
              <Switch
                size="small"
                checked={!!draft.allowChange}
                onChange={e =>
                  setDrafts(d => ({
                    ...d,
                    [row.id]: {
                      ...(d[row.id] ?? row),
                      allowChange: e,
                    },
                  }))
                }
              />
            ) : (
              <Switch checked={!!row.allowChange} disabled size="small" />
            )}
          </div>
        );
      },
    },
    {
      title: '',
      width: 160,
      render: (_: any, row: Item) => {
        const inactive = row.isActive === false;
        const isDefault = !!row.isDefault;

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

        const editing = editingId === row.id;

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
                    onClick={() => cancelEdit(row.id)}
                  />
                </Tooltip>
              </Space>
            </div>
          );
        }

        return (
          <div className="text-right">
            <Space>
              <Tooltip title={isDefault ? 'Default (cannot edit)' : 'Edit'}>
                <Button
                  type="text"
                  icon={<IconPencil size={18} />}
                  disabled={isDefault}
                  onClick={() => startEdit(row)}
                />
              </Tooltip>

              <Tooltip title="Deactivate (soft delete)">
                <Button
                  type="text"
                  icon={<IconTrash size={18} className="text-red-500" />}
                  onClick={() => openDeactivateModal(row)}
                />
              </Tooltip>
            </Space>
          </div>
        );
      },
    },
  ];

  const displayed = useMemo(() => items.slice().sort((a, b) => a.sort - b.sort), [items]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold m-0">Lead Source</h3>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={handleAddNew}
          disabled={isAdding}
        >
          New
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={displayed}
        pagination={false}
        size="middle"
        rowClassName={record => (record.isActive === false ? 'bg-gray-50' : '')}
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
              } "${isModalOpen.row.name}"? This will make it ${
                isModalOpen.type === 'activate' ? 'available again' : 'unavailable for new leads'
              }.`
            : 'Confirm Activation'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
      />
    </div>
  );
};
