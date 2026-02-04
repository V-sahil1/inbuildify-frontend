import React, { useMemo, useState } from 'react';
import { Badge, Button, Input, Select, Tooltip } from 'antd';
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
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { ChecklistDrawer } from '@/components/common/ChecklistDrawer';
import { useAppSelector } from '@hooks/redux';
import { ConstructionChecklistType } from '@redux/feature/admin/construction/constructionChecklist/IConstructionChecklistState';

const { Option } = Select;

export interface SupplierTypeItem {
  id: number;
  name: string;
  suppliers: string[];
  isActive: boolean;
  checklists: string[];
  isNew?: boolean;
}

export const initialTypes: SupplierTypeItem[] = [
  {
    id: 1,
    name: 'Brick cleaner',
    suppliers: [],
    checklists: [],
    isActive: true,
  },
  {
    id: 2,
    name: 'Brick Layer',
    suppliers: [],
    checklists: [],
    isActive: true,
  },
  {
    id: 3,
    name: 'Carpenter',
    suppliers: [],
    checklists: [],
    isActive: false,
  },
  {
    id: 4,
    name: 'Caulking',
    suppliers: [],
    checklists: [],
    isActive: true,
  },
];

export const useSupplierTypeColumns = () => {
  const [types, setTypes] = useState<SupplierTypeItem[]>(initialTypes);
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive'>('active');
  const [search, setSearch] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState<'delete' | 'inactive' | null>(null);
  const [selectedType, setSelectedType] = useState<SupplierTypeItem | null>(null);
  const [checklistDrawerType, setChecklistDrawerType] = useState<SupplierTypeItem | null>(null);
  const [supplierDrawerType, setSupplierDrawerType] = useState<SupplierTypeItem | null>(null);

  const { checklist } = useAppSelector(state => state.construction.constructionChecklist);
  const checklistItems = checklist;

  const filteredTypes = useMemo(
    () =>
      types.filter(type => {
        const matchesStatus =
          (statusFilter === 'active' && type.isActive) ||
          (statusFilter === 'inactive' && !type.isActive);

        const matchesSearch = !search || type.name.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
      }),
    [types, statusFilter, search]
  );

  const handleActivate = (id: number) => {
    setTypes(prev => prev.map(t => (t.id === id ? { ...t, isActive: true } : t)));
  };

  const handleDeleteClick = (record: SupplierTypeItem) => {
    const hasRelations = record.suppliers.length > 0 || record.checklists.length > 0;
    setSelectedType(record);
    setConfirmMode(hasRelations ? 'inactive' : 'delete');
    setConfirmOpen(true);
  };

  const handleOpenChecklist = (record: SupplierTypeItem) => {
    setChecklistDrawerType(record);
  };

  const handleOpenSupplier = (record: SupplierTypeItem) => {
    setSupplierDrawerType(record);
  };

  const handleStartAdd = () => {
    if (isAddingNew) return;
    const temp: SupplierTypeItem = {
      id: Date.now(),
      name: '',
      suppliers: [],
      checklists: [],
      isActive: true,
      isNew: true,
    };
    setTypes(prev => [temp, ...prev]);
    setIsAddingNew(true);
    setNewTypeName('');
  };

  const handleConfirmAdd = (tempId: number) => {
    const trimmed = newTypeName.trim();
    if (!trimmed) {
      setTypes(prev => prev.filter(t => !(t.isNew && t.id === tempId)));
    } else {
      setTypes(prev =>
        prev.map(t => (t.id === tempId ? { ...t, name: trimmed, isNew: false } : t))
      );
    }
    setIsAddingNew(false);
    setNewTypeName('');
  };

  const handleCancelAdd = (tempId: number) => {
    setTypes(prev => prev.filter(t => !(t.isNew && t.id === tempId)));
    setIsAddingNew(false);
    setNewTypeName('');
  };

  const handleUpdateChecklists = (selectedItems: ConstructionChecklistType[]) => {
    setTypes(prev =>
      prev.map(t =>
        checklistDrawerType && t.id === checklistDrawerType.id
          ? { ...t, checklists: selectedItems.map(i => i.name) }
          : t
      )
    );
  };

  const handleUpdateSuppliers = (selectedItems: ConstructionChecklistType) => {
    // setTypes(prev =>
    //   prev.map(t =>
    //     supplierDrawerType && t.id === supplierDrawerType.id
    //       ? { ...t, suppliers: selectedItems.map(i => i.name) }
    //       : t
    //   )
    // );
  };

  const handleConfirm = () => {
    if (!selectedType || !confirmMode) return;

    if (confirmMode === 'delete') {
      setTypes(prev => prev.filter(t => t.id !== selectedType.id));
    } else {
      setTypes(prev =>
        prev.map(t =>
          t.id === selectedType.id ? { ...t, isActive: false, suppliers: [], checklists: [] } : t
        )
      );
    }

    setConfirmOpen(false);
    setSelectedType(null);
    setConfirmMode(null);
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-3">
          <Input
            addonBefore={
              <Select
                value={statusFilter}
                onChange={val => setStatusFilter(val)}
                style={{ width: 140 }}
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            }
            placeholder="Search Supplier Type..."
            prefix={<IconSearch size={16} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      ),
      dataIndex: 'name',
      width: '70%',
      render: (_: any, record: SupplierTypeItem) =>
        record.isNew ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              autoFocus
              value={newTypeName}
              onChange={e => setNewTypeName(e.target.value)}
              placeholder="Supplier Type"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{record.name}</span>
              <Tooltip title="Edit">
                <button type="button" className="text-gray-400 hover:text-blue-500">
                  <IconPencil size={14} />
                </button>
              </Tooltip>
            </div>
          </div>
        ),
    },
    {
      title: '',
      dataIndex: 'suppliers',
      width: '10%',
      render: (_: any, record: SupplierTypeItem) =>
        record.isActive && !record.isNew ? (
          <Tooltip title="Suppliers">
            <Button
              type="text"
              onClick={e => {
                e.stopPropagation();
                handleOpenSupplier(record);
              }}
            >
              <Badge count={record.suppliers.length} size="small">
                <IconTruck size={18} />
              </Badge>
            </Button>
          </Tooltip>
        ) : null,
    },
    {
      title: '',
      dataIndex: 'checklists',
      width: '10%',
      render: (_: any, record: SupplierTypeItem) =>
        record.isActive && !record.isNew ? (
          <Tooltip title="Checklist">
            <Button
              type="text"
              onClick={e => {
                e.stopPropagation();
                handleOpenChecklist(record);
              }}
            >
              <Badge count={record.checklists.length} size="small">
                <IconList size={18} />
              </Badge>
            </Button>
          </Tooltip>
        ) : null,
    },
    {
      title: (
        <Button type="primary" className="ml-auto" onClick={handleStartAdd}>
          New
        </Button>
      ),
      dataIndex: 'actions',
      render: (_: any, record: SupplierTypeItem) => {
        if (record.isNew) {
          return (
            <div className="flex items-center gap-1">
              <Button type="text" onClick={() => handleConfirmAdd(record.id)}>
                <IconCheck size={18} className="text-green-600" />
              </Button>
              <Button type="text" onClick={() => handleCancelAdd(record.id)}>
                <IconX size={18} className="text-red-600" />
              </Button>
            </div>
          );
        }

        if (record.isActive) {
          return (
            <Button
              danger
              type="text"
              icon={<IconTrash size={18} />}
              onClick={() => handleDeleteClick(record)}
            />
          );
        }

        return (
          <Tooltip title="Activate">
            <Button
              type="text"
              icon={<IconPlus size={18} />}
              onClick={() => handleActivate(record.id)}
            />
          </Tooltip>
        );
      },
    },
  ];

  const confirmModal =
    confirmMode && selectedType ? (
      <ConfirmationContentModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedType(null);
          setConfirmMode(null);
        }}
        title="Confirm Deletion"
        okText={confirmMode === 'delete' ? 'Delete' : 'Inactive'}
        onSubmit={handleConfirm}
        content={
          confirmMode === 'delete' ? (
            <div className="text-center flex flex-col gap-4 text-lg my-4">
              <div>
                Type : <strong>{selectedType?.name}</strong>
              </div>
              <div>Are you sure you want to delete this {selectedType?.name}?</div>
            </div>
          ) : (
            <div className="text-center flex flex-col gap-4 text-lg">
              <div>
                Type : <strong>{selectedType?.name}</strong>
              </div>

              <div>
                <div className="text-primary">
                  This {selectedType?.name} has been used in existing supplier.
                </div>
                <div className="text-primary">
                  This {selectedType?.name} can't be deleted. Please inactivate the{' '}
                  {selectedType?.name} if not required.
                </div>
              </div>
              <div>Are you sure you want to inactivate this {selectedType?.name}?</div>
            </div>
          )
        }
      />
    ) : null;

  const checklistDrawer = checklistDrawerType && (
    <ChecklistDrawer
      open={!!checklistDrawerType}
      onClose={() => setChecklistDrawerType(null)}
      title={checklistDrawerType.name}
      width="45%"
      initialSelected={
        checklistDrawerType.checklists
          .map(checklistName => {
            const checklistItem = checklistItems.find(item => item.name === checklistName);
            return checklistItem
              ? {
                  constructionChecklistId: checklistItem.constructionChecklistId,
                  costCenterId: '',
                  constructionChecklist: {
                    id: checklistItem.constructionChecklistId,
                    name: checklistItem.name,
                  },
                }
              : null;
          })
          .filter(Boolean) as any[]
      }
      onUpdate={() => {}}
      onRemove={() => {}}
      recommendation={false}
    />
  );
  const supplierDrawer = supplierDrawerType && (
    <ChecklistDrawer
      open={!!supplierDrawerType}
      onClose={() => setSupplierDrawerType(null)}
      title={supplierDrawerType.name}
      width="45%"
      initialSelected={
        supplierDrawerType.suppliers
          .map(supplierName => {
            const checklistItem = checklistItems.find(item => item.name === supplierName);
            return checklistItem
              ? {
                  constructionChecklistId: checklistItem.constructionChecklistId,
                  costCenterId: '',
                  constructionChecklist: {
                    id: checklistItem.constructionChecklistId,
                    name: checklistItem.name,
                  },
                }
              : null;
          })
          .filter(Boolean) as any[]
      }
      onUpdate={handleUpdateSuppliers}
      onRemove={() => {}}
      recommendation={true}
    />
  );

  return {
    columns,
    data: filteredTypes,
    confirmModal,
    // checklistDrawer,
    // supplierDrawer,
  };
};
