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
import { RootState } from '@redux/feature/store';
import { clientType } from '@redux/feature/admin/sales/clientType/IClientTypeState';
import {
  createClientType,
  fetchAllClientType,
  updateClientType,
  updateClientTypeStatus,
} from '@redux/feature/admin/sales/clientType/clientTypeThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const ClientType: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clientType, status } = useAppSelector((state: RootState) => state.sales.clientType);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<Partial<clientType> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<{ clientType?: string; sortOrder?: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: clientType | null;
  }>({
    open: false,
    type: null,
    row: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status.fetch === Status.IDLE) await dispatch(fetchAllClientType()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch cliet Type');
      }
    };
    fetchData();
  }, [status.fetch]);

  const validateForm = () => {
    const errors = {
      clientType: '',
      sortOrder: '',
    };
    let isValid = true;
    if (!editingRow.clientType?.trim()) {
      errors.clientType = 'Lost Reason is required';
      isValid = false;
    }
    if (!editingRow.sortOrder || editingRow.sortOrder < 1) {
      errors.sortOrder = 'Sort order must be greater than 0';
      isValid = false;
    }
    setError(errors);
    return isValid;
  };

  // Utility: ensure list is sorted by sortOrder asc
  const sorted = (list: clientType[]) => [...list].sort((a, b) => a.sortOrder - b.sortOrder);

  // Utility: insert a new item at desiredSort (1-indexed). If desiredSort > length -> append.
  const insertAtSort = (prev: clientType[], newItem: clientType, desiredSort?: number) => {
    const list = sorted(prev);
    const maxPos = list.length + 1;
    const pos = Math.min(
      Math.max(1, Number.isFinite(desiredSort as number) ? (desiredSort as number) : 1),
      maxPos
    );
    const newList = [...list.slice(0, pos - 1), newItem, ...list.slice(pos - 1)];
    return newList.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
  };

  // Utility: move existing item to desiredSort and apply updates from editingRow
  const moveExistingItem = (
    prev: clientType[],
    clientTypeId: string,
    updates: Partial<clientType>,
    desiredSort?: number
  ) => {
    const list = sorted(prev);
    const idx = list.findIndex(i => i.clientTypeId === clientTypeId);
    if (idx === -1) return prev;
    const item = { ...list[idx], ...updates };
    // remove the item
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

  // Start edit
  const startEdit = (record: clientType) => {
    setIsAdding(false);
    setError(null);
    setEditingId(record.clientTypeId);
    setEditingRow({ ...record });
  };

  // Save edit (with new insertion/reorder logic)
  const saveEdit = async (clientTypeId: string) => {
    if (!validateForm()) {
      return;
    }

    const isNew = clientTypeId === '';
    const desiredSortRaw = editingRow.sortOrder;
    const desiredSort = Number(desiredSortRaw);
    try {
      if (isNew) {
        // Build final new item (assign a real positive clientTypeId)
        const finalId = '';
        const newItem: clientType = {
          ...(editingRow as clientType),
          clientTypeId: finalId,
          sortOrder: Number.isFinite(desiredSort) ? desiredSort : 1,
          isDraft: false,
        } as clientType;
        await dispatch(
          createClientType({ clientType: newItem.clientType, sortOrder: newItem.sortOrder })
        ).unwrap();
        message.success('Client Type created successfully');
        // setData(prev => {
        //   // remove temporary negative clientTypeId if present, then insert at position
        //   const prevClean = prev.filter(item => item.clientTypeId !== clientTypeId);
        //   return insertAtSort(prevClean, newItem, newItem.sortOrder);
        // });

        setIsAdding(false);
      } else {
        // Existing item: update fields and if sortOrder changed or provided, move accordingly
        // const updatedFields: Partial<clientType> = {
        //   ...editingRow,
        //   isDraft: false,
        // };
        const values = getUpdatedFields<clientType>(
          editingRow,
          clientType.find(i => i.clientTypeId === clientTypeId)
        );
        await dispatch(
          updateClientType({
            data: values,
            id: clientTypeId,
          })
        ).unwrap();
        // setData(prev => {
        //   const current = prev.find(p => p.clientTypeId === clientTypeId);
        //   if (!current) return prev;

        //   const updatedFields: Partial<clientType> = {
        //     ...editingRow,
        //     isDraft: false,
        //   };

        //   // If sortOrder provided and different, move item
        //   if (Number.isFinite(desiredSort) && desiredSort !== current.sortOrder) {
        //     return moveExistingItem(prev, clientTypeId, updatedFields, desiredSort);
        //   }

        //   // Otherwise just update the item in place (keep sortOrder)
        //   return prev.map(p => (p.clientTypeId === clientTypeId ? { ...p, ...updatedFields } : p));
        // });
        setEditingId(null);
        setEditingRow({});
      }
    } catch (error) {
      message.error(error || 'Failed to save client type');
    }
  };

  // Cancel edit (remove temporary row if adding)
  const cancelEdit = () => {
    if (isAdding && editingId) {
      setIsAdding(false);
    }
    setEditingId(null);
    setEditingRow(null);
  };

  // Add new (temporary) row
  const handleAdd = () => {
    const newRow: clientType = {
      clientTypeId: '', // temporary negative ID
      clientType: '',
      sortOrder: null,
      isActive: true,
      isDraft: true,
    };
    // Insert at start temporarily so user can edit; final position will be decided on save based on the sortOrder value.
    setEditingId(newRow.clientTypeId);
    setEditingRow(newRow);
    setIsAdding(true);
  };

  // Modal openers
  const openDeactivateModal = (row: clientType) =>
    setIsModalOpen({ open: true, type: 'deactivate', row });

  const openActivateModal = (row: clientType) =>
    setIsModalOpen({ open: true, type: 'activate', row });

  // Confirm modal actions
  const handleDeactivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(
        updateClientTypeStatus({ data: { isActive: false }, id: row.clientTypeId })
      ).unwrap();
      message.success('Item deactivated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to deactivate client type');
    }
  };

  const handleActivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(
        updateClientTypeStatus({ data: { isActive: true }, id: row.clientTypeId })
      ).unwrap();
      message.success('Item activated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to deactivate client type');
    }
  };

  // Sort change handler (updates editingRow.sortOrder)
  const handleSortChange = (value: number | string) => {
    const num = Number(value);
    setEditingRow(prev => ({
      ...prev,
      sortOrder: isNaN(num) ? undefined : num,
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
      dataIndex: 'clientType',
      key: 'clientType',
      render: (_, record: clientType) => {
        const isEditing = editingId === record.clientTypeId;
        if (!record.isActive) {
          return <span className="text-gray-400 italic">{record.clientType}</span>;
        }
        return isEditing ? (
          <>
            <Input
              value={editingRow.clientType}
              onChange={e => setEditingRow(prev => ({ ...prev, clientType: e.target.value }))}
              disabled={status.create === Status.PENDING}
            />
            {error?.clientType && <span className="text-red-500">{error.clientType}</span>}
          </>
        ) : (
          record.clientType
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
      dataIndex: 'sortOrder',
      width: 120,
      render: (sortOrder: number, record: clientType) => {
        const isEditing = editingId === record.clientTypeId;
        if (!record.isActive) {
          return <span className="text-gray-400">{record.sortOrder}</span>;
        }
        return isEditing ? (
          <>
            <Input
              type="number"
              value={isEditing ? (editingRow.sortOrder ?? '') : sortOrder}
              onChange={e => isEditing && handleSortChange(e.target.value)}
              disabled={status.create === Status.PENDING}
            />
            {error?.sortOrder && <span className="text-red-500">{error.sortOrder}</span>}
          </>
        ) : (
          record.sortOrder
        );
      },
    },
    {
      title: '',
      width: 160,
      render: (_, row: clientType) => {
        const inactive = row.isActive === false;
        const editing = editingId === row.clientTypeId;

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
                    onClick={() => saveEdit(row.clientTypeId)}
                    loading={status.create === Status.PENDING}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="text"
                    icon={<IconX size={18} className="text-red-500" />}
                    onClick={cancelEdit}
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
  const dataSource = (isAdding ? [editingRow, ...clientType] : clientType).filter(Boolean);
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
        dataSource={[...dataSource].sort((a, b) => a.sortOrder - b.sortOrder)}
        rowKey="clientTypeId"
        size="middle"
        loading={status.fetch === Status.PENDING}
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
              } "${isModalOpen.row.clientType}"? This will ${
                isModalOpen.type === 'activate' ? 'activate' : 'deactivate'
              } it.`
            : 'Confirm Action'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
        loading={status.create === Status.PENDING}
      />
    </div>
  );
};
