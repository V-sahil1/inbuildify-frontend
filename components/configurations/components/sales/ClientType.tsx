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
  createClientType,
  fetchAllClientType,
  updateClientType,
  updateClientTypeStatus,
} from '@redux/feature/admin/sales/clientType/clientTypeThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { IClientType } from '@redux/feature/admin/sales/clientType/IClientTypeState';
import { getPaginationConfig } from '@lib/utils/getPaginationConfig';

export const ClientType: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clientType, status, pagination } = useAppSelector(
    (state: RootState) => state.sales.clientType
  );
  const [editingRow, setEditingRow] = useState<IClientType | null>(null);
  const [error, setError] = useState<{ clientType?: string; sortOrder?: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: IClientType | null;
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
      await dispatch(fetchAllClientType({ page, limit })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch cliet Type');
    }
  };

  const validateForm = () => {
    const errors = {
      clientType: '',
      sortOrder: '',
    };
    let isValid = true;
    if (!editingRow.clientType?.trim()) {
      errors.clientType = 'Client Type is required';
      isValid = false;
    }
    if (!editingRow.sortOrder || editingRow.sortOrder < 1) {
      errors.sortOrder = 'Sort order must be greater than 0';
      isValid = false;
    }
    setError(errors);
    return isValid;
  };

  // Start edit
  const startEdit = (record: IClientType) => {
    setError(null);
    setEditingRow({ ...record });
  };

  // Save edit (with new insertion/reorder logic)
  const saveEdit = async (clientTypeId: string) => {
    if (!validateForm()) {
      return;
    }
    try {
      if (editingRow?.isNew) {
        await dispatch(
          createClientType({ clientType: editingRow.clientType, sortOrder: editingRow.sortOrder })
        ).unwrap();
        message.success('Client Type created successfully');
      } else {
        const { isUpdated, updatedFields } = getUpdatedFields<IClientType>(
          editingRow,
          clientType.find(i => i.clientTypeId === clientTypeId)
        );
        if (!isUpdated) {
          setEditingRow(null);
          return;
        }
        await dispatch(
          updateClientType({
            data: updatedFields,
            id: clientTypeId,
          })
        ).unwrap();
        message.success('Client Type updated successfully');
      }
      setEditingRow(null);
    } catch (error) {
      message.error(error || 'Failed to save client type');
    }
  };

  // Cancel edit (remove temporary row if adding)
  const cancelEdit = () => {
    setEditingRow(null);
  };

  // Add new (temporary) row
  const handleAdd = () => {
    const newRow: IClientType = {
      clientTypeId: '',
      clientType: '',
      sortOrder: null,
      isActive: true,
      isNew: true,
    };
    setEditingRow(newRow);
  };

  // Modal openers
  const openDeactivateModal = (row: IClientType) =>
    setIsModalOpen({ open: true, type: 'deactivate', row });

  const openActivateModal = (row: IClientType) =>
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
      render: (_, record: IClientType) => {
        const isEditing = editingRow?.clientTypeId === record.clientTypeId;
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
      render: (sortOrder: number, record: IClientType) => {
        const isEditing = editingRow?.clientTypeId === record.clientTypeId;
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
              onWheel={(e) => e.currentTarget.blur()}
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
      render: (_, row: IClientType) => {
        const inactive = row.isActive === false;
        const editing = editingRow?.clientTypeId === row.clientTypeId;

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
  const dataSource = !!editingRow && editingRow.isNew ? [editingRow, ...clientType] : clientType;
  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-xl">Client Type</h3>
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
        rowKey="clientTypeId"
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
