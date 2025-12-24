'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Input, Button, Space, Tooltip, message, Switch } from 'antd';
import { IconPencil, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { createleadSource, fetchAllleadSource, updateleadSource } from '@redux/feature/admin/sales/leadSource/leadSourceThunk';
import { Status } from '@lib/constants/enum';
import { leadSource } from '@redux/feature/admin/sales/leadSource/ILeadSourceState';

export const LeadSource: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leadSource, status } = useAppSelector((state: RootState) => state.sales.leadSource);
  const [items, setItems] = useState<leadSource[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<leadSource>>>({});
  const [isAdding, setIsAdding] = useState(false);
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
      await dispatch(fetchAllleadSource());
    };
    if (status.fetch === Status.IDLE) {
      fetchLeadSource();
    }
  }, []);
  useEffect(() => {
    if (leadSource && leadSource.length > 0) {
      setItems([...leadSource]);
    }
  }, [leadSource]);
  const startEdit = (row: leadSource) => {
    setEditingId(row.leadSourceId);
    setDrafts(d => ({ ...d, [row.leadSourceId]: { ...row } }));
  };

  const cancelEdit = (id: string) => {
    if (id === null) {
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

  const saveEdit =async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    const name = (draft.name || '').trim();
    const sortOrder = Number(draft.sortOrder ?? 0);
    const isDefault = !!draft.isDefault;
    const allowChange = !!draft.allowChange;

    if (!name) {
      message.error('Name cannot be empty');
      return;
    }
    if (!Number.isInteger(sortOrder) || sortOrder < 1) {
      message.error('Sort must be a positive integer');
      return;
    }

    const conflict = items.some(
      it => it.leadSourceId !== id && it.isActive !== false && it.sortOrder === sortOrder
    );
    if (conflict) {
      message.error('Sort order must be unique among active rows');
      return;
    }
    const exists = leadSource.some(p => p.leadSourceId === id);
    console.log("-------",exists,{name,sortOrder,allowChange,isActive:true})
    // let next: leadSource[] = items.map(p => {
    //   if (p.leadSourceId !== id) return p;
    //   return {
    //     ...p,
    //     name,
    //     sortOrder,
    //     allowChange,
    //     isDefault,
    //     isActive: p.isActive !== false,
    //   };
    // });

    if (!exists) {
      console.log('exisys---',exists)
      await dispatch(createleadSource({name,sortOrder,allowChange,isActive:true})).unwrap()
      message.success('leadsource created successfully')
    }
    else{
      await dispatch(updateleadSource({data:{name,sortOrder,allowChange},id:id})).unwrap()
      message.success('leadsource updated successfully')
    }

    if (isDefault) {
      // next = next.map(p => (p.leadSourceId === id ? p : { ...p, isDefault: false }));
    }
    // setItems(prev => {
    //   const exists = prev.some(p => p.leadSourceId === id);

    //   return next.slice().sort((a, b) => a.sortOrder - b.sortOrder);
    // });

    setEditingId(null);
    setIsAdding(false);
    setDrafts(d => {
      const copy = { ...d };
      delete copy[id];
      return copy;
    });
  };

  const openDeactivateModal = (row: leadSource) => {
    if (row.isDefault) {
      message.warning('Default item cannot be deactivated');
      return;
    }
    setIsModalOpen({ open: true, type: 'deactivate', row });
  };

  const handleDeactivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;

    setItems(prev =>
      prev.map(p => (p.leadSourceId === row.leadSourceId ? { ...p, isActive: false } : p))
    );
    message.success('Item deactivated');
    setIsModalOpen({ open: false, type: null, row: null });
  };

  const openActivateModal = (row: leadSource) => {
    setIsModalOpen({ open: true, type: 'activate', row });
  };

  const handleActivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;

    setItems(prev =>
      prev.map(p => (p.leadSourceId === row.leadSourceId ? { ...p, isActive: true } : p))
    );
    message.success('Item activated');
    setIsModalOpen({ open: false, type: null, row: null });
  };

  const handleAddNew = () => {
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
      render: (_: any, row: leadSource) => {
        const inactive = row.isActive === false;
        const editable = editingId === row.leadSourceId;
        const draft = drafts[row.leadSourceId] ?? {};
        return (
          <div className={inactive ? 'opacity-45' : ''}>
            {editable ? (
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
                        [record.leadSourceId]: { ...prev[record.leadSourceId], sort: val },
                      }
                    : prev
                );
              }}
            />
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
      render: (_: any, row: leadSource) => {
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
      render: (_: any, row: leadSource) => {
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
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="text"
                    icon={<IconX size={18} className="text-red-500" />}
                    onClick={() => cancelEdit(row.leadSourceId)}
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
