'use client';

import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tooltip, message, Switch, Form } from 'antd';
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
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { LeadSourceType } from '@redux/feature/admin/sales/leadSource/ILeadSourceState';
import { getPaginationConfig } from '@lib/utils/getPaginationConfig';
import { createSortOrderValidation } from '@lib/constants/formInputValidations';

export const LeadSource: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { leadSource, status, pagination } = useAppSelector(
    (state: RootState) => state.sales.leadSource
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<LeadSourceType | null>(null);
  const PAGE_SIZE = 10;
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: LeadSourceType | null;
  }>({
    open: false,
    type: null,
    row: null,
  });

  useEffect(() => {
    fetchLeadSource();
  }, [currentPage]);

  const fetchLeadSource = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      await dispatch(fetchAllleadSource({ page, limit }));
    } catch (error) {
      message.error(error || 'Failed to fetch lead sources');
    }
  };

  const saveEdit = async () => {
    const values = await form.validateFields();
    try {
      if (editingRow?.isNew) {
        await dispatch(createleadSource({ ...values, isActive: true })).unwrap();
        message.success('leadsource created successfully');
      } else {
        const { isUpdated, updatedFields } = getUpdatedFields(
          values,
          leadSource.find(i => i.leadSourceId === editingRow.leadSourceId)
        );
        if (!isUpdated) {
          setEditingRow(null);
          return;
        }
        await dispatch(
          updateleadSource({ data: updatedFields, id: editingRow.leadSourceId })
        ).unwrap();
        message.success('leadsource updated successfully');
      }
      form.resetFields();
      setEditingRow(null);
      await dispatch(fetchAllleadSource({ page: currentPage, limit: PAGE_SIZE })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to save leadsource');
    } finally {
    }
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
    const tempId = Date.now().toString();
    const nextSort = leadSource?.length + 1;
    const newRow: LeadSourceType = {
      leadSourceId: tempId,
      name: '',
      sortOrder: nextSort,
      allowChange: true,
      isActive: true,
      isNew: true,
    };
    setEditingRow(newRow);
    form.setFieldsValue(newRow);
  };

  const columns = [
    {
      title: 'Lead Source',
      dataIndex: 'name',
      render: (_, row: LeadSourceType) => {
        const inactive = row.isActive === false;
        const editable = editingRow?.leadSourceId === row.leadSourceId;
        return (
          <div className={inactive ? 'opacity-45' : ''}>
            {editable ? (
              <Form.Item name="name" rules={[{ required: true, message: 'Enter Lead Source' }]}>
                <Input
                  value={row.name}
                  placeholder="Enter source"
                  autoFocus
                  disabled={status.create === Status.PENDING}
                />
              </Form.Item>
            ) : (
              <span>{row.name}</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      width: 100,
      render: (_: number, record: LeadSourceType) => {
        const inactive = record.isActive === false;
        const editable = editingRow?.leadSourceId === record.leadSourceId;
        return editable ? (
          <div className={`w-full ${inactive ? 'opacity-50' : ''}`}>
            <Form.Item
              name="sortOrder"
              rules={createSortOrderValidation(leadSource?.length ?? 0, !editingRow?.isNew)}
            >
              <Input
                type="number"
                value={record.sortOrder}
                min={1}
                max={leadSource?.length + (editingRow?.isNew ? 1 : 0)}
                disabled={status.create === Status.PENDING}
                onWheel={e => e.currentTarget.blur()}
              />
            </Form.Item>
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
      render: (_, row: LeadSourceType) => {
        const inactive = row.isActive === false;
        const editable = editingRow?.leadSourceId === row.leadSourceId;
        return (
          <div className={`text-center justify-center flex ${inactive ? 'opacity-45' : ''}`}>
            {editable ? (
              <Form.Item name="allowChange" valuePropName="checked">
                <Switch
                  size="small"
                  checked={!!row?.allowChange}
                  disabled={status.create === Status.PENDING}
                />
              </Form.Item>
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
      render: (_, row: LeadSourceType) => {
        const inactive = row.isActive === false;

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

        const editing = editingRow?.leadSourceId === row.leadSourceId;

        if (editing) {
          return (
            <div className="text-right">
              <Space>
                <Tooltip title="Save">
                  <Button
                    type="text"
                    icon={<IconCheck size={18} className="text-green-500" />}
                    onClick={saveEdit}
                    loading={status.create === Status.PENDING}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="text"
                    icon={<IconX size={18} className="text-red-500" />}
                    onClick={() => {
                      setEditingRow(null);
                      form.resetFields();
                    }}
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
                  onClick={() => {
                    setEditingRow(row);
                    form.setFieldsValue(row);
                  }}
                />
              </Tooltip>

              <Tooltip title="Deactivate (soft delete)">
                <Button
                  type="text"
                  icon={<IconTrash size={18} className="text-red-500" />}
                  onClick={() => setIsModalOpen({ open: true, type: 'deactivate', row })}
                />
              </Tooltip>
            </Space>
          </div>
        );
      },
    },
  ];
  const dataSource = !!editingRow && editingRow.isNew ? [editingRow, ...leadSource] : leadSource;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold m-0">Lead Source</h3>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={handleAddNew}
          disabled={!!editingRow}
        >
          New
        </Button>
      </div>
      <Form form={form}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={getPaginationConfig({
            currentPage,
            limit: pagination?.limit,
            totalRecords: pagination?.totalRecords,
            setCurrentPage,
          })}
          size="middle"
          rowClassName={record => (record.isActive === false ? 'bg-gray-50' : '')}
          loading={status.fetch === Status.PENDING}
        />
      </Form>

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
