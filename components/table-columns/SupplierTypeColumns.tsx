import React, { useState } from 'react';
import { Badge, Button, Input, message, Popconfirm } from 'antd';
import {
  IconSearch,
  IconTrash,
  IconPencil,
  IconTruck,
  IconPlus,
  IconList,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import { ISupplierType } from '@redux/feature/supplier/ISupplierState';
import {
  createSupplierType,
  deleteSupplierType,
  updateSupplierType,
} from '@redux/feature/supplier/supplierThunk';
import TooltipButton from '../common/TooltipButton';
import StatusSelect from '../common/custom-selects/StatusSelect';

export const useSupplierTypeColumns = (
  setSelectedType,
  setConfirmMode,
  setDrawerOpen,
  selectedType,
  setSelectAll,
  setParams,
  filters
) => {
  const dispatch = useAppDispatch();
  const [editingRow, setEditingRow] = useState<ISupplierType | null>(null);

  const handleConfirmAdd = async () => {
    try {
      const payload = {
        name: editingRow?.name,
        isActive: editingRow?.isActive,
      };
      if (editingRow?.isNew) {
        await dispatch(createSupplierType(payload)).unwrap();
        message.success('Supplier type added successfully');
      } else {
        await dispatch(
          updateSupplierType({ supplierTypeId: editingRow.supplierTypeId, data: payload })
        ).unwrap();
        message.success('Supplier type updated successfully');
      }
      setEditingRow(null);
    } catch (error) {
      message.error(error || 'Failed to add supplier type');
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      const hasRelations =
        selectedType?.suppliers.length > 0 || selectedType?.checklists.length > 0;
      if (hasRelations) {
        await dispatch(
          updateSupplierType({
            supplierTypeId: selectedType?.supplierTypeId,
            data: { isActive: false },
          })
        ).unwrap();
        setParams({ isActive: 'true' });
        message.success('Supplier type deactivated successfully');
      } else {
        await dispatch(deleteSupplierType(selectedType?.supplierTypeId)).unwrap();
        message.success('Supplier type deleted successfully');
      }
      setSelectedType(null);
      setConfirmMode(null);
    } catch (error) {
      message.error('Failed to delete supplier type');
    }
  };
  const handleActivate = async (id: string) => {
    try {
      await dispatch(updateSupplierType({ supplierTypeId: id, data: { isActive: true } })).unwrap();
      setParams({ isActive: 'false' });
      message.success('Supplier type activated successfully');
    } catch (error) {
      message.error('Failed to activate supplier type');
    }
  };

  const handleStartAdd = () => {
    const temp: ISupplierType = {
      supplierTypeId: '',
      name: '',
      suppliers: [],
      checklists: [],
      isActive: true,
      isNew: true,
    };
    setEditingRow(temp);
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-3">
          <Input
            addonBefore={
              <StatusSelect
                value={filters?.isActive}
                onChange={val => setParams({ isActive: val })}
                activeInactive={true}
                width={100}
              />
            }
            placeholder="Search Supplier Type..."
            prefix={<IconSearch size={16} />}
            value={filters?.name}
            onChange={e => setParams({ name: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'name',
      width: '70%',
      render: (_, record: ISupplierType) =>
        editingRow?.supplierTypeId === record.supplierTypeId ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              autoFocus
              value={editingRow.name}
              onChange={e => setEditingRow(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Supplier Type"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{record.name}</span>
              <TooltipButton
                title="Edit"
                type="text"
                onClick={() => setEditingRow(record)}
                icon={<IconPencil size={16} />}
              />
            </div>
          </div>
        ),
    },
    {
      title: (
        <Button type="primary" className="ml-auto" onClick={handleStartAdd}>
          New
        </Button>
      ),
      dataIndex: 'actions',
      render: (_, record: ISupplierType) => {
        if (editingRow?.supplierTypeId === record.supplierTypeId) {
          return (
            <div className="flex items-center gap-1">
              <Button
                type="text"
                onClick={handleConfirmAdd}
                icon={<IconCheck size={16} color="green" />}
              />
              <Button
                type="text"
                onClick={() => setEditingRow(null)}
                icon={<IconX size={16} color="red" />}
              />
            </div>
          );
        } else {
          return record.isActive && !record.isNew ? (
            <div className="flex items-center gap-1">
              <Badge count={record.suppliers.length} size="small">
                <TooltipButton
                  title="Suppliers"
                  type="text"
                  onClick={e => {
                    e.stopPropagation();
                    setDrawerOpen('supplier');
                    setSelectAll('supplier');
                    setSelectedType(record);
                  }}
                  icon={<IconTruck size={16} />}
                />
              </Badge>
              <Badge count={record.checklists.length} size="small">
                <TooltipButton
                  title="Checklist"
                  type="text"
                  onClick={e => {
                    e.stopPropagation();
                    setDrawerOpen('checklist');
                    setSelectAll('checklist');
                    setSelectedType(record);
                  }}
                  icon={<IconList size={16} />}
                />
              </Badge>

              <TooltipButton
                title="Remove"
                type="text"
                icon={<IconTrash size={16} color="red" />}
                onClick={() => {
                  const hasRelations =
                    record?.suppliers.length > 0 || record?.checklists.length > 0;
                  setSelectedType(record);
                  setConfirmMode(hasRelations ? 'inactive' : 'delete');
                }}
              />
            </div>
          ) : (
            <Popconfirm
              title="Are you sure you want to activate this type?"
              onConfirm={() => handleActivate(record.supplierTypeId)}
            >
              <TooltipButton
                title="Activate"
                type="text"
                icon={<IconPlus size={16} color="green" />}
              />
            </Popconfirm>
          );
        }
      },
    },
  ];

  return {
    columns,
    editingRow,
    handleDeleteConfirm,
  };
};
