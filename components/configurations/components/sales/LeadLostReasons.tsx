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
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { LeadLostReasonType } from '@redux/feature/admin/sales/leadLostReason/ILeadLostReasonState';
import { getPaginationConfig } from '@lib/utils/getPaginationConfig';

export const LeadLostReasons: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leadLostReason, status, pagination } = useAppSelector(
    (state: RootState) => state.sales.leadLostReason
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<Partial<LeadLostReasonType> | null>(null);
  const [error, setError] = useState<{ lostReason?: string; sortOrder?: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: LeadLostReasonType | null;
  }>({
    open: false,
    type: null,
    row: null,
  });
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      await dispatch(fetchAllLeadLostReason({ page, limit })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch lead lost reason');
    }
  };
  const validateForm = () => {
    const errors = {
      lostReason: '',
      sortOrder: '',
    };
    let isValid = true;
    if (!editingRow.lostReason?.trim()) {
      errors.lostReason = 'Lost Reason is required';
      isValid = false;
    }
    if (!editingRow.sortOrder || editingRow.sortOrder < 1) {
      errors.sortOrder = 'Sort order must be greater than 0';
      isValid = false;
    }
    setError(errors);
    return isValid;
  };

  // === EDITING ===
  const startEdit = (record: LeadLostReasonType) => {
    setEditingRow({ ...record });
    setError(null);
  };

  const saveEdit = async (id: string) => {
    if (!validateForm()) {
      return;
    }
    const isNew = id === '';
    const desiredSortRaw = editingRow.sortOrder;
    const desiredSort = Number(desiredSortRaw);
    try {
      if (isNew) {
        const newItem: LeadLostReasonType = {
          ...(editingRow as LeadLostReasonType),
          sortOrder: Number.isFinite(desiredSort) ? desiredSort : 1,
          isActive: editingRow.isActive ?? true,
        } as LeadLostReasonType;
        await dispatch(
          createLeadLostReason({
            lostReason: newItem.lostReason,
            sortOrder: newItem.sortOrder,
            isActive: newItem.isActive,
          })
        ).unwrap();
        message.success('Lead Lost Reason created successfully');
      } else {
        const values = { lostReason: editingRow.lostReason, sortOrder: editingRow.sortOrder };
        const prevValues = leadLostReason.filter(i => i.leadLostReasonId === id)[0];
        const { isUpdated, updatedFields } = getUpdatedFields<LeadLostReasonType>(
          values,
          prevValues
        );
        if (!isUpdated) {
          setEditingRow({});
          return;
        }

        await dispatch(
          updateLeadLostReason({
            data: updatedFields,
            id,
          })
        ).unwrap();
        message.success('Lead Lost Reason updated successfully');
      }
      setEditingRow(null);
    } catch (error) {
      message.error(error || 'Failed to save lead lost reason');
    }
  };

  const cancelEdit = () => {
    setEditingRow(null);
  };

  // === ADD ===
  const handleAdd = () => {
    const newRow: LeadLostReasonType = {
      leadLostReasonId: '',
      lostReason: '',
      sortOrder: null,
      isActive: true,
      isNew: true,
    };
    setEditingRow(newRow);
  };

  const handleDeactivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(
        updateLeadLostReasonStatus({ data: { isActive: false }, id: row.leadLostReasonId })
      );
      message.success('Item deactivated');
      setIsModalOpen({ open: false, type: null, row: null });
    } catch (error) {
      message.error(error || 'Failed to deactivate lead lost reason');
    }
  };

  const handleActivateConfirm = async () => {
    const row = isModalOpen.row;
    if (!row) return;
    try {
      await dispatch(
        updateLeadLostReasonStatus({ data: { isActive: true }, id: row.leadLostReasonId })
      );
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
      render: (_, record: LeadLostReasonType) => {
        const isEditing = editingRow?.leadLostReasonId === record.leadLostReasonId;
        if (!record.isActive) {
          return <span className="text-gray-400 italic">{record.lostReason}</span>;
        }
        return isEditing ? (
          <>
            <Input
              value={editingRow.lostReason}
              onChange={e => setEditingRow(prev => ({ ...prev, lostReason: e.target.value }))}
              disabled={status.create === Status.PENDING}
            />
            {error?.lostReason && <span className="text-red-500">{error.lostReason}</span>}
          </>
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
      render: (sortOrder: number, record: LeadLostReasonType) => {
        const isEditing = editingRow?.leadLostReasonId === record.leadLostReasonId;
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
      render: (_, row: LeadLostReasonType) => {
        const inactive = row.isActive === false;
        const editing = editingRow?.leadLostReasonId === row.leadLostReasonId;

        if (inactive) {
          return (
            <div className="text-right">
              <Tooltip title="Reactivate this item">
                <Button
                  type="text"
                  icon={<IconPlus size={18} />}
                  onClick={() => setIsModalOpen({ open: true, type: 'activate', row })}
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
                onConfirm={() => setIsModalOpen({ open: true, type: 'deactivate', row })}
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

  const dataSource =
    !!editingRow && editingRow.isNew ? [editingRow, ...leadLostReason] : leadLostReason;

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-xl">Lost Reasons</h3>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={handleAdd}
          disabled={!!editingRow} // disable while editing
        >
          New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        size="middle"
        pagination={getPaginationConfig({
          currentPage: currentPage,
          limit: pagination?.limit,
          totalRecords: pagination?.totalRecords,
          setCurrentPage,
        })}
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
              } "${isModalOpen.row.lostReason}"? This will make it ${
                isModalOpen.type === 'activate' ? 'available again' : 'unavailable for new leads'
              }.`
            : 'Confirm Action'
        }
        type={isModalOpen.type === 'activate' ? 'success' : 'warning'}
        confirmText={isModalOpen.type === 'activate' ? 'Activate' : 'Deactivate'}
        loading={status.create === Status.PENDING}
      />
    </div>
  );
};
