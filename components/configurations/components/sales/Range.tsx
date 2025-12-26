'use client';

import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Tooltip, message, Space, Popconfirm, Select, Upload } from 'antd';
import {
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconPencil,
  IconUpload,
} from '@tabler/icons-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useUsersHook } from '@hooks/useUserData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchRange,
  updateRange,
  updateRangeStatus,
} from '@redux/feature/admin/sales/range/rangeThunk';
import { Status } from '@lib/constants/enum';
import { range } from '@redux/feature/admin/sales/range/IRangeState';
import { createRange } from '@redux/feature/admin/sales/range/rangeThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const Range: React.FC = () => {
  const dispatch = useAppDispatch();
  const { range, status } = useAppSelector(state => state.sales.range);
  // const [data, setData] = useState<range[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<Partial<range>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<{ name?: string; sortOrder?: string } | null>(null);
  const { users } = useUsersHook();
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: range | null;
  }>({
    open: false,
    type: null,
    row: null,
  });
  const isDisabled = status.create === Status.PENDING;
  useEffect(() => {
    async function fetchData() {
      try {
        await dispatch(fetchRange()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetchc range');
      }
    }
    if (status.fetch === Status.IDLE) {
      fetchData();
    }
  }, [status.fetch]);

  const validateForm = () => {
    const errors = {
      name: '',
      sortOrder: '',
    };
    let isValid = true;
    if (!editingRow.name?.trim()) {
      errors.name = 'name is required';
      isValid = false;
    }
    if (!editingRow.sortOrder || editingRow.sortOrder < 1) {
      errors.sortOrder = 'Sort order must be greater than 0';
      isValid = false;
    }
    setError(errors);
    return isValid;
  };
  const sorted = (list: range[]) => [...list].sort((a, b) => a.sortOrder - b.sortOrder);

  const insertAtSort = (prev: range[], newItem: range, desiredSort?: number) => {
    const list = sorted(prev);
    const maxPos = list.length + 1;
    const pos = Math.min(
      Math.max(1, Number.isFinite(desiredSort as number) ? (desiredSort as number) : 1),
      maxPos
    );
    const newList = [...list.slice(0, pos - 1), newItem, ...list.slice(pos - 1)];
    return newList.map((item, idx) => ({ ...item, sort: idx + 1 }));
  };

  const moveExistingItem = (
    prev: range[],
    id: string,
    updates: Partial<range>,
    desiredSort?: number
  ) => {
    const list = sorted(prev);
    const idx = list.findIndex(i => i.rangeId === id);
    if (idx === -1) return prev;
    const item = { ...list[idx], ...updates };
    const others = list.filter((_, i) => i !== idx);
    const maxPos = others.length + 1;
    const pos = Math.min(
      Math.max(
        1,
        Number.isFinite(desiredSort as number) ? (desiredSort as number) : item.sortOrder
      ),
      maxPos
    );
    const newList = [...others.slice(0, pos - 1), item, ...others.slice(pos - 1)];
    return newList.map((it, i) => ({ ...it, sortOrder: i + 1 }));
  };

  const startEdit = (record: range) => {
    setEditingId(record.rangeId);
    setEditingRow({ ...record });
  };

  const saveEdit = async (id: string) => {
    if (!validateForm()) {
      return;
    }
    try {
      if (!editingRow.name || editingRow.name.trim() === '') {
        message.error('Name cannot be empty');
        return;
      }

      const isNew = id === '';
      const desiredSort = Number(editingRow.sortOrder);

      if (isNew) {
        const newItem: range = {
          ...(editingRow as range),

          sortOrder: Number.isFinite(desiredSort) ? desiredSort : 1,
          isActive: editingRow.isActive ?? true,
        } as range;
        delete newItem.rangeId;

        await dispatch(createRange(newItem)).unwrap();
        message.success('Range created successfully');
        // setData(prev => {
        //   const prevClean = prev.filter(it => it.id !== id);
        //   return insertAtSort(prevClean, newItem, newItem.sort);
        // });

        setIsAdding(false);
      } else {
        const updatedFields = getUpdatedFields<range>(
          editingRow,
          range.find(p => p.rangeId === id)
        );
        delete updatedFields.rangeId;
        await dispatch(updateRange({ data: updatedFields, id })).unwrap();
        message.success('Range updated successfully');
        // setData(prev => {
        //   const current = prev.find(p => p.id === id);
        //   if (!current) return prev;

        //   const updatedFields: Partial<range> = {
        //     ...editingRow,
        //     isDraft: false,
        //   };

        //   if (Number.isFinite(desiredSort) && desiredSort !== current.sort) {
        //     return moveExistingItem(prev, id, updatedFields, desiredSort);
        //   }

        //   // just update
        //   return prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
        // });
      }

      setEditingId(null);
      setEditingRow({});
    } catch (error) {
      message.error(error || 'Failed to save range');
    }
  };

  const cancelEdit = () => {
    if (isAdding && editingId) {
      // setData(prev => prev.filter(item => item.id !== editingId));
      setIsAdding(false);
    }
    setEditingId(null);
    setEditingRow(null);
  };

  const handleAdd = () => {
    const newRow: range = {
      rangeId: '',
      name: '',
      sortOrder: 1,
      bgColor: '#7c3aed',
      fontColor: '#ffffff',
      logoUrl: '',
      headerUrl: '',
      userId: [],
      isActive: true,
    };
    // setData(prev => [newRow, ...prev]);
    setEditingId(newRow.rangeId);
    setEditingRow(newRow);
    setIsAdding(true);
  };

  const openDeactivateModal = (row: range) =>
    setIsModalOpen({ open: true, type: 'deactivate', row });

  const openActivateModal = (row: range) => setIsModalOpen({ open: true, type: 'activate', row });

  const handleDeactivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(updateRangeStatus({ data: { isActive: false }, id: row.rangeId })).unwrap();
      message.success('Item successfully deactivated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to deactivate item');
    }
    // setData(prev => prev.map(p => (p.id === row.id ? { ...p, isActive: false } : p)));
  };

  const handleActivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(updateRangeStatus({ data: { isActive: true }, id: row.rangeId })).unwrap();
      message.success('Item successfully activated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to activate item');
    }
    // setData(prev => prev.map(p => (p.id === row.id ? { ...p, isActive: true } : p)));
  };

  const handleSortChange = (value: number | string) => {
    const num = Number(value);
    setEditingRow(prev => ({ ...prev, sortOrder: isNaN(num) ? undefined : num }));
  };
  const columns = [
    {
      title: (
        <div className="flex items-center gap-1">
          Name
          <Tooltip title="Display label">
            <IconInfoCircle size={14} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (_, record: range) => {
        const isEditing = editingId === record.rangeId;
        if (!record.isActive) {
          return <span className="text-gray-400 italic">{record.name}</span>;
        }
        return isEditing ? (
          <div className="flex flex-col gap-2">
            <Input
              value={editingRow.name}
              placeholder="Enter name"
              onChange={e => setEditingRow(p => ({ ...p, name: e.target.value }))}
              disabled={isDisabled}
            />
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs text-gray-500">BG color</div>
                <Input
                  type="color"
                  value={editingRow.bgColor ?? '#7c3aed'}
                  onChange={e => setEditingRow(p => ({ ...p, bgColor: e.target.value }))}
                  style={{ width: 56, height: 32, padding: 0, borderRadius: 4 }}
                  disabled={isDisabled}
                />
              </div>
              <div>
                <div className="text-xs text-gray-500">Font color</div>
                <Input
                  type="color"
                  value={editingRow.fontColor ?? '#ffffff'}
                  onChange={e => setEditingRow(p => ({ ...p, fontColor: e.target.value }))}
                  style={{ width: 56, height: 32, padding: 0, borderRadius: 4 }}
                  disabled={isDisabled}
                />
              </div>
            </div>
            {error?.name && <div className="text-red-500">{error.name}</div>}
          </div>
        ) : (
          <div>
            <span
              className="px-4 py-1 rounded-full text-sm"
              style={{
                background: record.bgColor ?? '#a78bfa',
                color: record.fontColor ?? '#fff',
                display: 'inline-block',
              }}
            >
              {record.name}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 120,
      render: (_, record: range) => {
        const isEditing = editingId === record.rangeId;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Upload showUploadList={false} listType="picture" beforeUpload={() => false}>
            <Button icon={<IconUpload />} disabled={isDisabled}>
              Upload
            </Button>
          </Upload>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
            {/* placeholder logo */}
            <span className="text-xs text-gray-400">NO IMAGE</span>
          </div>
        );
      },
    },
    {
      title: 'Header',
      dataIndex: 'header',
      key: 'header',
      width: 120,
      render: (_, record: range) => {
        const isEditing = editingId === record.rangeId;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Upload showUploadList={false} listType="picture" beforeUpload={() => false}>
            <Button icon={<IconUpload />} disabled={isDisabled}>
              Upload
            </Button>
          </Upload>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
            <span className="text-xs text-gray-400">NO IMAGE</span>
          </div>
        );
      },
    },
    {
      title: 'User',
      dataIndex: 'users',
      key: 'users',
      render: (_, record: range) => {
        const isEditing = editingId === record.rangeId;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Select
            mode="multiple"
            placeholder="Select Users"
            value={(editingRow.userId as string[]) ?? []}
            options={users.map(user => ({ value: user.usersId, label: user.name }))}
            onChange={vals => setEditingRow(p => ({ ...p, userId: vals }))}
            style={{ minWidth: 220 }}
            disabled={isDisabled}
          />
        ) : (
          <div className="text-sm text-gray-600">
            {(record.userId ?? []).length > 0 ? `${(record.userId ?? []).length} user(s)` : ''}
          </div>
        );
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      render: (sortOrder: number, record: range) => {
        const isEditing = editingId === record.rangeId;
        if (!record.isActive) return <div className="text-gray-400">{record.sortOrder}</div>;
        return isEditing ? (
          <>
            <Input
              type="number"
              value={editingRow.sortOrder ?? ''}
              onChange={e => handleSortChange(e.target.value)}
              style={{ width: 72 }}
              disabled={isDisabled}
            />
            {error?.sortOrder && <div className="text-red-500">{error.sortOrder}</div>}
          </>
        ) : (
          <div className="text-gray-400">{sortOrder}</div>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 140,
      render: (_, row: range) => {
        const inactive = row.isActive === false;
        const editing = editingId === row.rangeId;

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
                    onClick={() => saveEdit(row.rangeId)}
                    loading={isDisabled}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="text"
                    icon={<IconX size={18} className="text-red-500" />}
                    onClick={cancelEdit}
                    disabled={isDisabled}
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
                title="Are you sure you want to deactivate?"
                onConfirm={() => openDeactivateModal(row)}
                okText="Inactivate"
                cancelText="Cancel"
              >
                <Button type="text" icon={<IconTrash size={18} className="text-red-500" />} />
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];
  const dataSource = (isAdding ? [editingRow, ...range] : range).filter(Boolean);
  return (
    <div className="p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-xl">Range</h3>
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleAdd}
            disabled={!!editingId}
          >
            New
          </Button>
        </div>
      </div>

      <Table
        pagination={false}
        columns={columns}
        dataSource={[...dataSource].sort((a, b) => a.sortOrder - b.sortOrder)}
        rowKey="rangeId"
        size="middle"
        className="ant-table-striped"
        loading={status.fetch === Status.PENDING}
      />

      <ConfirmationModal
        open={isModalOpen.open}
        onClose={() => setIsModalOpen({ open: false, type: null, row: null })}
        onConfirm={
          isModalOpen.type === 'activate' ? handleActivateConfirm : handleDeactivateConfirm
        }
        title={isModalOpen.type === 'activate' ? 'Activate item?' : 'Deactivate item?'}
        message={
          isModalOpen.row
            ? `Are you sure you want to ${
                isModalOpen.type === 'activate' ? 'activate' : 'deactivate'
              } "${isModalOpen.row.name}"?`
            : 'Confirm Action'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
        loading={isDisabled}
      />
    </div>
  );
};
