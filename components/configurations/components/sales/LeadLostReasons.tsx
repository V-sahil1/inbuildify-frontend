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
import {
  createLeadLostReason,
  fetchAllLeadLostReason,
  updateLeadLostReason,
  updateLeadLostReasonStatus,
} from '@redux/feature/admin/sales/leadLostReason/leadLostReasonThunk';
import { Status } from '@lib/constants/enum';
import { leadLostReason } from '@redux/feature/admin/sales/leadLostReason/ILeadLostReasonState';

export const LeadLostReasons: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leadLostReason, status } = useAppSelector(
    (state: RootState) => state.sales.leadLostReason
  );
  // const [data, setData] = useState<leadLostReason[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<Partial<leadLostReason> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: leadLostReason | null;
  }>({
    open: false,
    type: null,
    row: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      if (status.fetch === Status.IDLE) {
        try {
          await dispatch(fetchAllLeadLostReason()).unwrap();
        } catch (error) {
          message.error(error || 'Failed to fetch lead lost reason');
        }
      }
    };
    fetchData();
  }, [dispatch]);

  // Utility: ensure list is sorted by sort asc
  const sorted = (list: leadLostReason[]) => [...list].sort((a, b) => a.sortOrder - b.sortOrder);

  // Utility: insert a new item at desiredSort (1-indexed). If desiredSort > length -> append.
  const insertAtSort = (prev: leadLostReason[], newItem: leadLostReason, desiredSort?: number) => {
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
    prev: leadLostReason[],
    id: string,
    updates: Partial<leadLostReason>,
    desiredSort?: number
  ) => {
    const list = sorted(prev);
    const idx = list.findIndex(i => i.leadLostReasonId === id);
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
  // === EDITING ===
  const startEdit = (record: leadLostReason) => {
    setEditingId(record.leadLostReasonId);
    setEditingRow({ ...record });
  };

  const saveEdit = async (id: string) => {
    if (!editingRow.lostReason || editingRow.lostReason.trim() === '') {
      message.error('Lost Reason cannot be empty');
      return;
    }
    if (!editingRow.sortOrder || editingRow.sortOrder < 1) {
      message.error('sort order must be greater than 1');
      return;
    }

    const isNew = id === '';
    const desiredSortRaw = editingRow.sortOrder;
    const desiredSort = Number(desiredSortRaw);
    try {
      if (isNew) {
        // Build final new item (assign a real positive id)
        const newItem: leadLostReason = {
          ...(editingRow as leadLostReason),
          sortOrder: Number.isFinite(desiredSort) ? desiredSort : 1,
          isDraft: false,
          isActive: editingRow.isActive ?? true,
        } as leadLostReason;
        await dispatch(
          createLeadLostReason({
            lostReason: newItem.lostReason,
            sortOrder: newItem.sortOrder,
            isActive: newItem.isActive,
          })
        ).unwrap();
        message.success('Lead Lost Reason created successfully');
        setIsAdding(false);
      } else {
        // Existing item: update fields and if sort changed or provided, move accordingly
        const updatedFields: Partial<leadLostReason> = {
          ...editingRow,
          isDraft: false,
        };
        const values = { lostReason: updatedFields.lostReason, sortOrder: updatedFields.sortOrder };
        const prevValues = leadLostReason.filter(i => i.leadLostReasonId === id)[0];
        const updatedValues = Object.keys(values).reduce((acc, key) => {
          if (values[key] !== prevValues[key]) {
            acc[key] = values[key];
          }
          return acc;
        }, {} as Partial<leadLostReason>);
        if (Object.keys(updatedValues).length === 0) {
          message.info('No changes detected');
          return;
        }
        // const current = leadLostReason.find(p => p.leadLostReasonId === id);
        // if (!current) return leadLostReason;
        // // If sort provided and different, move item
        // if (Number.isFinite(desiredSort) && desiredSort !== current.sortOrder) {
        //   return moveExistingItem(leadLostReason, id, updatedFields, desiredSort);
        // }
        await dispatch(
          updateLeadLostReason({
            data: updatedValues,
            id,
          })
        ).unwrap();
        message.success('Lead Lost Reason updated successfully');
      }
      setEditingId(null);
      setEditingRow({});
    } catch (error) {
      message.error(error || 'Failed to save lead lost reason');
    }
  };

  const cancelEdit = () => {
    if (isAdding && editingId) {
      // setData(prev => prev.filter(item => item.leadLostReasonId !== editingId));
      setIsAdding(false);
    }
    setEditingId(null);
    setEditingRow(null);
  };

  // === ADD ===
  const handleAdd = () => {
    const newRow: leadLostReason = {
      leadLostReasonId: '', // temporary negative ID
      lostReason: '',
      sortOrder: null,
      isActive: true,
      isDraft: true,
    };
    // Insert at start temporarily so user can edit; final position will be decided on save based on the sort value.
    // setData(prev => [newRow, ...prev]);
    setEditingId(newRow.leadLostReasonId);
    setEditingRow(newRow);
    setIsAdding(true);
  };

  // === DEACTIVATE / ACTIVATE ===
  const openDeactivateModal = (row: leadLostReason) => {
    setIsModalOpen({ open: true, type: 'deactivate', row });
  };

  const openActivateModal = (row: leadLostReason) => {
    setIsModalOpen({ open: true, type: 'activate', row });
  };

  const handleDeactivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      dispatch(updateLeadLostReasonStatus({ data: { isActive: false }, id: row.leadLostReasonId }));
      message.success('Item deactivated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to deactivate lead lost reason');
    }
  };

  const handleActivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      dispatch(updateLeadLostReasonStatus({ data: { isActive: true }, id: row.leadLostReasonId }));
      message.success('Item activated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to Activate lead lost reason');
    }
  };

  // === SORT INPUT ===
  const handleSortChange = (value: number | string) => {
    const num = Number(value);
    setEditingRow(prev => ({
      ...prev,
      sortOrder: isNaN(num) ? undefined : num,
    }));
  };

  // === TABLE COLUMNS ===
  const columns = [
    {
      title: (
        <div className="flex items-center gap-1">
          Lost Reason
          <Tooltip title="Reason for marking the opportunity as lost">
            <IconInfoCircle size={14} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'reason',
      key: 'lostReason',
      render: (_: any, record: leadLostReason) => {
        const isEditing = editingId === record.leadLostReasonId;
        if (!record.isActive) {
          return <span className="text-gray-400 italic">{record.lostReason}</span>;
        }
        return isEditing ? (
          <Input
            value={editingRow.lostReason}
            onChange={e => setEditingRow(prev => ({ ...prev, lostReason: e.target.value }))}
          />
        ) : (
          record.lostReason
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-1">
          Sort Order
          <Tooltip title="Reorder lost reasons by changing this value">
            <IconInfoCircle size={14} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'sortOrder',
      width: 120,
      render: (sortOrder: number, record: leadLostReason) => {
        const isEditing = editingId === record.leadLostReasonId;
        if (!record.isActive) {
          return <span className="text-gray-400">{record.sortOrder}</span>;
        }
        return (
          <Input
            type="number"
            value={isEditing ? (editingRow.sortOrder ?? '') : sortOrder}
            onChange={e => isEditing && handleSortChange(e.target.value)}
            disabled={!isEditing}
          />
        );
      },
    },
    {
      title: '',
      width: 160,
      render: (_: any, row: leadLostReason) => {
        const inactive = row.isActive === false;
        const editing = editingId === row.leadLostReasonId;

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
                    onClick={() => saveEdit(row.leadLostReasonId)}
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
              {/* here if the lost reason is not being used at anywhere then it can be directly deleted but if it is used then the pop over show to inactivate otherwise delete */}
              <Popconfirm
                title={
                  <div>
                    Are you sure you want to delete the Lost Reason?
                    <br />
                    <span className="text-red-500">
                      Note: Already used this Lost reason type, so please inactivate the Lost
                      Reason.
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

  const dataSource = (isAdding ? [editingRow, ...leadLostReason] : leadLostReason).filter(Boolean);

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-xl">Lost Reasons</h3>
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
        rowKey="id"
        size="middle"
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
              } "${isModalOpen.row.lostReason}"? This will make it ${
                isModalOpen.type === 'activate' ? 'available again' : 'unavailable for new leads'
              }.`
            : 'Confirm Action'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
      />
    </div>
  );
};
