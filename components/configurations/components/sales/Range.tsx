'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Tooltip,
  message,
  Space,
  Popconfirm,
  Select,
  Upload,
  Image,
} from 'antd';
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
import { useUsersHook } from '@hooks/useUserHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchRange,
  updateRange,
  updateRangeStatus,
} from '@redux/feature/admin/sales/range/rangeThunk';
import { Status } from '@lib/constants/enum';
import { createRange } from '@redux/feature/admin/sales/range/rangeThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import TooltipButton from '@/components/common/TooltipButton';
import { RangeType } from '@redux/feature/admin/sales/range/IRangeState';

export const Range: React.FC = () => {
  const dispatch = useAppDispatch();
  const { range, status } = useAppSelector(state => state.sales.range);
  const [editingRow, setEditingRow] = useState<RangeType | null>(null);
  const [error, setError] = useState<{ name?: string; sortOrder?: string } | null>(null);
  const { userOptions } = useUsersHook();
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: 'activate' | 'deactivate' | null;
    row: RangeType | null;
  }>({
    open: false,
    type: null,
    row: null,
  });
  const isDisabled = status.create === Status.PENDING;
  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchData();
    }
  }, [status.fetch]);
  async function fetchData() {
    try {
      await dispatch(fetchRange()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetchc range');
    }
  }
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
  const startEdit = (record: RangeType) => {
    setError(null);
    setEditingRow({ ...record });
  };

  const saveEdit = async (id: string) => {
    if (!validateForm()) {
      return;
    }
    try {
      if (editingRow?.isNew) {
        delete editingRow.rangeId;
        delete editingRow.isNew;
        const formData = formDataGenerator(editingRow);
        await dispatch(createRange(formData)).unwrap();
        message.success('Range created successfully');
      } else {
        const { isUpdated, updatedFields } = getUpdatedFields<RangeType>(
          editingRow,
          range.find(p => p.rangeId === id)
        );
        if (!isUpdated) {
          setEditingRow(null);
          return;
        }
        (delete updatedFields.rangeId, updatedFields.isNew);
        await dispatch(updateRange({ data: formDataGenerator(updatedFields), id })).unwrap();
        message.success('Range updated successfully');
      }
      setEditingRow(null);
    } catch (error) {
      message.error(error || 'Failed to save range');
    }finally{
      await dispatch(fetchRange()).unwrap();
    }
  };

  const cancelEdit = () => {
    setEditingRow(null);
  };

  const handleAdd = () => {
    setError(null);
    const newRow: RangeType = {
      rangeId: '',
      name: '',
      sortOrder: 1,
      bgColor: '#7c3aed',
      fontColor: '#ffffff',
      logoUrl: '',
      headerUrl: '',
      userId: [],
      isActive: true,
      isNew: true,
    };
    setEditingRow(newRow);
  };

  const openDeactivateModal = (row: RangeType) =>
    setIsModalOpen({ open: true, type: 'deactivate', row });

  const openActivateModal = (row: RangeType) =>
    setIsModalOpen({ open: true, type: 'activate', row });

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
      render: (_, record: RangeType) => {
        const isEditing = editingRow?.rangeId === record.rangeId;
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
      render: (_, record: RangeType) => {
        const isEditing = editingRow?.rangeId === record.rangeId;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Upload
            listType="picture"
            beforeUpload={() => false}
            onChange={info =>
              setEditingRow(prev => ({ ...prev, logoUrl: info.fileList[0].originFileObj }))
            }
            className="custom-upload"
            maxCount={1}
            fileList={
              record.logoUrl && typeof record.logoUrl === 'string'
                ? [
                    {
                      uid: '-1',
                      name: 'Logo',
                      status: 'done',
                      url: record.logoUrl,
                    },
                  ]
                : []
            }
          >
            <Button icon={<IconUpload />} disabled={isDisabled}>
              Upload
            </Button>
          </Upload>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
            {record.logoUrl && typeof record.logoUrl === 'string' ? (
              <Image src={record.logoUrl} alt="Header" preview={false} />
            ) : (
              <span className="text-xs text-gray-400">NO IMAGE</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Header',
      dataIndex: 'header',
      key: 'header',
      width: 120,
      render: (_, record: RangeType) => {
        const isEditing = editingRow?.rangeId === record.rangeId;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Upload
            listType="picture"
            beforeUpload={() => false}
            onChange={info =>
              setEditingRow(prev => ({ ...prev, headerUrl: info.fileList[0].originFileObj }))
            }
            className="custom-upload"
            maxCount={1}
            fileList={
              record.headerUrl && typeof record.headerUrl === 'string'
                ? [
                    {
                      uid: '-1',
                      name: 'Header',
                      status: 'done',
                      url: record.headerUrl,
                    },
                  ]
                : []
            }
          >
            <Button icon={<IconUpload />} disabled={isDisabled}>
              Upload
            </Button>
          </Upload>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
            {record.headerUrl && typeof record.headerUrl === 'string' ? (
              <Image src={record.headerUrl} alt="Header" preview={false} />
            ) : (
              <span className="text-xs text-gray-400">NO IMAGE</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'User',
      dataIndex: 'users',
      key: 'users',
      render: (_, record: RangeType) => {
        const isEditing = editingRow?.rangeId === record.rangeId;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Select
            mode="multiple"
            placeholder="Select Users"
            value={(editingRow.userId as string[]) ?? []}
            options={userOptions}
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
      render: (sortOrder: number, record: RangeType) => {
        const isEditing = editingRow?.rangeId === record.rangeId;
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
      render: (_, row: RangeType) => {
        const inactive = row.isActive === false;
        const editing = editingRow?.rangeId === row.rangeId;

        if (inactive) {
          return (
            <div className="text-right">
              <TooltipButton
                title="Reactivate this item"
                type="text"
                icon={<IconPlus size={16} />}
                onClick={() => openActivateModal(row)}
              />
            </div>
          );
        }

        if (editing) {
          return (
            <div className="text-right">
              <Space>
                <TooltipButton
                  title="Save"
                  type="text"
                  icon={<IconCheck size={16} />}
                  onClick={() => saveEdit(row.rangeId)}
                  loading={isDisabled}
                />

                <TooltipButton
                  title="Cancel"
                  type="text"
                  icon={<IconX size={16} color="red" />}
                  onClick={cancelEdit}
                  disabled={isDisabled}
                />
              </Space>
            </div>
          );
        }

        return (
          <div className="text-right">
            <Space>
              <TooltipButton
                title="Edit"
                type="text"
                icon={<IconPencil size={16} />}
                onClick={() => startEdit(row)}
              />

              <Popconfirm
                title="Are you sure you want to deactivate?"
                onConfirm={() => openDeactivateModal(row)}
                okText="Inactivate"
                cancelText="Cancel"
              >
                <TooltipButton
                  title="Delete"
                  type="text"
                  icon={<IconTrash size={16} color="red" />}
                />
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];
  const dataSource = !!editingRow && editingRow.isNew ? [editingRow, ...range] : range;
  return (
    <div className="p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-xl">Range</h3>
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleAdd}
            disabled={!!editingRow}
          >
            New
          </Button>
        </div>
      </div>

      <Table
        pagination={false}
        columns={columns}
        dataSource={dataSource}
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
