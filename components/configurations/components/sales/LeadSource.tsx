'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Input, Button, Space, Tooltip, message, Switch } from 'antd';
import { IconPencil, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import {
  createleadSource,
  fetchAllleadSource,
  updateleadSource,
  updateleadSourceStatus,
} from '@redux/feature/admin/sales/leadSource/leadSourceThunk';
import { Status } from '@lib/constants/enum';
import { leadSource } from '@redux/feature/admin/sales/leadSource/ILeadSourceState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const LeadSource: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leadSource, status } = useAppSelector((state: RootState) => state.sales.leadSource);
  const [items, setItems] = useState<leadSource[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<leadSource>>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<{ name: string; sortOrder: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: leadSource | null;
  }>({
    open: false,
    type: null,
    row: null,
  });

  useEffect(() => {
    const fetchLeadSource = async () => {
      try {
        await dispatch(fetchAllleadSource());
      } catch (error) {
        message.error(error || 'Failed to fetch lead sources');
      }
    };
    if (status.fetch === Status.IDLE) {
      fetchLeadSource();
    }
    if (leadSource && leadSource.length > 0) {
      setItems([...leadSource]);
    }
  }, [status.fetch, leadSource]);

  const validateForm = values => {
    const errors = {
      name: '',
      sortOrder: '',
    };
    let isValid = true;
    if (!values.name?.trim()) {
      errors.name = 'Lead source is required';
      isValid = false;
    }
    if (!values.sortOrder || values.sortOrder < 1) {
      errors.sortOrder = 'Sort Order must be a positive number';
    }
    setError(errors);
    return isValid;
  };

  const startEdit = (row: leadSource) => {
    setError(null);
    setEditingId(row.leadSourceId);
    setDrafts(d => ({ ...d, [row.leadSourceId]: { ...row } }));
  };
  const cancelEdit = (id: string) => {
    if (isAdding) {
      setItems(prev => prev.filter(it => it.leadSourceId !== id));
      setIsAdding(false);
    }
    setEditingId(null);
    setDrafts(d => {
      const copy = { ...d };
      delete copy[id];
      return copy;
    });
  };

  const saveEdit = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    const name = (draft.name || '').trim();
    const sortOrder = Number(draft.sortOrder ?? 0);
    const allowChange = !!draft.allowChange;
    if (!validateForm({ name, sortOrder })) {
      return;
    }

    const conflict = items.some(
      it => it.leadSourceId !== id && it.isActive !== false && it.sortOrder === sortOrder
    );
    if (conflict) {
      message.error('Sort order must be unique among active rows');
      return;
    }
    try {
      const exists = leadSource.some(p => p.leadSourceId === id);

      if (!exists) {
        await dispatch(createleadSource({ name, sortOrder, allowChange, isActive: true })).unwrap();
        message.success('leadsource created successfully');
      } else {
        const updatedFields = getUpdatedFields(
          { name, sortOrder, allowChange },
          leadSource.find(i => i.leadSourceId === id)
        );
        if (Object.keys(updatedFields).length == 0) {
          setEditingId(null);
          setIsAdding(false);
          return;
        }
        await dispatch(updateleadSource({ data: updatedFields, id: id })).unwrap();
        message.success('leadsource updated successfully');
      }
      setEditingId(null);
      setIsAdding(false);
      setDrafts(d => {
        const copy = { ...d };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      message.error(error || 'Failed to save leadsource');
    }
  };

  const openDeactivateModal = (row: leadSource) => {
    if (row.isDefault) {
      message.warning('Default item cannot be deactivated');
      return;
    }
    setIsModalOpen({ open: true, type: 'deactivate', row });
  };

  const handleDeactivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(
        updateleadSourceStatus({ data: { isActive: false }, id: row.leadSourceId })
      ).unwrap();
      message.success('Item deactivated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to deactivated item');
    }
  };

  const openActivateModal = (row: leadSource) => {
    setIsModalOpen({ open: true, type: 'activate', row });
  };

  const handleActivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(
        updateleadSourceStatus({ data: { isActive: true }, id: row.leadSourceId })
      ).unwrap();
      message.success('Item activated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to activated item');
    }
  };

  const handleAddNew = () => {
    setError(null);
    if (isAdding) return;
    const tempId = Date.now().toString();
    const nextSort = (items.reduce((max, it) => Math.max(max, it.sortOrder || 0), 0) || 0) + 1;
    const newRow: leadSource = {
      leadSourceId: tempId,
      name: '',
      sortOrder: nextSort,
      allowChange: true,
      isDefault: false,
      isActive: true,
    };
    setItems(prev => [...prev, newRow].slice().sort((a, b) => a.sortOrder - b.sortOrder));
    setDrafts(d => ({ ...d, [tempId]: { ...newRow } }));
    setEditingId(tempId);
    setIsAdding(true);
  };

  const columns = [
    {
      title: 'Lead Source',
      dataIndex: 'name',
      render: (_, row: leadSource) => {
        const inactive = row.isActive === false;
        const editable = editingId === row.leadSourceId;
        const draft = drafts[row.leadSourceId] ?? {};
        return (
          <div className={inactive ? 'opacity-45' : ''}>
            {editable ? (
              <>
                <Input
                  value={draft.name ?? row.name}
                  onChange={e =>
                    setDrafts(d => ({
                      ...d,
                      [row.leadSourceId]: { ...(d[row.leadSourceId] ?? row), name: e.target.value },
                    }))
                  }
                  placeholder="Enter source"
                  autoFocus
                  disabled={status.create === Status.PENDING}
                />
                {error?.name && <span className="text-red-500">{error?.name}</span>}
              </>
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
      render: (_: number, record: leadSource) => {
        const inactive = record.isActive === false;
        const editable = editingId === record.leadSourceId;
        const draft = drafts[record.leadSourceId] ?? {};
        return editable ? (
          <div className={`w-full ${inactive ? 'opacity-50' : ''}`}>
            <Input
              type="number"
              value={draft.sortOrder ?? record.sortOrder}
              min={1}
              onChange={e => {
                const val = Number(e.target.value);
                setDrafts(prev =>
                  prev?.[record.leadSourceId]
                    ? {
                        ...prev,
                        [record.leadSourceId]: { ...prev[record.leadSourceId], sortOrder: val },
                      }
                    : prev
                );
              }}
              disabled={status.create === Status.PENDING}
            />
            {error?.sortOrder && <span className="text-red-500">{error?.sortOrder}</span>}
          </div>
        ) : (
          <span className={inactive ? 'opacity-45' : ''}>{record.sortOrder}</span>
        );
      },
    },
    {
      title: 'Allow to change',
      dataIndex: 'allowChange',
      width: 140,
      render: (_, row: leadSource) => {
        const inactive = row.isActive === false;
        const editable = editingId === row.leadSourceId;
        const draft = drafts[row.leadSourceId] ?? {};
        return (
          <div className={`text-center ${inactive ? 'opacity-45' : ''}`}>
            {editable ? (
              <Switch
                size="small"
                checked={!!draft.allowChange}
                onChange={e =>
                  setDrafts(d => ({
                    ...d,
                    [row.leadSourceId]: {
                      ...(d[row.leadSourceId] ?? row),
                      allowChange: e,
                    },
                  }))
                }
                disabled={status.create === Status.PENDING}
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
      render: (_, row: leadSource) => {
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

        const editing = editingId === row.leadSourceId;

        if (editing) {
          return (
            <div className="text-right">
              <Space>
                <Tooltip title="Save">
                  <Button
                    type="text"
                    icon={<IconCheck size={18} className="text-green-500" />}
                    onClick={() => saveEdit(row.leadSourceId)}
                    loading={status.create === Status.PENDING}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="text"
                    icon={<IconX size={18} className="text-red-500" />}
                    onClick={() => cancelEdit(row.leadSourceId)}
                    disabled={status.create === Status.PENDING}
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
  const displayed = useMemo(() => items.slice().sort((a, b) => a.sortOrder - b.sortOrder), [items]);

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
              } "${isModalOpen.row.name}"? This will make it ${
                isModalOpen.type === 'activate' ? 'available again' : 'unavailable for new leads'
              }.`
            : 'Confirm Activation'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
        loading={status.create === Status.PENDING}
      />
    </div>
  );
};
