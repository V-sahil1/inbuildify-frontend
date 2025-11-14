'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Badge,
  Space,
  Popconfirm,
  message,
  Typography,
} from 'antd';
import { IconList, IconTrash, IconPencil } from '@tabler/icons-react';
import { debouncedURL } from '@lib/utils/debounceURL';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { ChecklistDrawer } from '@/components/costCenter/ChecklistDrawer';
import { ChecklistItem, initialCostCenters } from 'data/costCenterData';
import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import { getCostCenterModalFields } from '@/components/costCenter/costCenterFormFields';

interface CostCenter {
  key: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  checklist?: number;
}

export default function CostCenterMaster() {
  const [openModal, setOpenModal] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);

  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<CostCenter | null>(null);

  const [costCenterChecklists, setCostCenterChecklists] = useState<Record<string, ChecklistItem[]>>(
    {}
  );

  const [data, setData] = useState<CostCenter[]>(() => initialCostCenters);

  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['code', 'name', 'description', 'sortOrder', 'isActive'],
  });

  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const filteredData = data.filter(
    item =>
      (!filters.code || item.code.toLowerCase().includes(filters.code.toLowerCase())) &&
      (!filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.description ||
        item.description.toLowerCase().includes(filters.description.toLowerCase())) &&
      (!filters.sortOrder || Number(filters.sortOrder) === item.sortOrder) &&
      (!filters.isActive || item.isActive === (filters.isActive === 'true'))
  );

  const reinsertWithOrder = (list: CostCenter[], item: CostCenter, desired: number) => {
    const others = list.filter(r => r.key !== item.key).sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = Math.max(0, Math.min((desired || 1) - 1, others.length));
    const withItem = [...others];
    withItem.splice(idx, 0, item);
    return withItem.map((r, i) => ({ ...r, sortOrder: i + 1 }));
  };

  const handleAdd = (values: any) => {
    const newItem: CostCenter = {
      key: (data.length + 1).toString(),
      ...values,
      isActive: values.isActive ?? true,
      checklist: 0,
    };
    setData(prev =>
      reinsertWithOrder([...prev, newItem], newItem, Number(values.sortOrder) || prev.length + 1)
    );
    message.success('Cost Center Added');
    setOpenModal(false);
  };

  const handleEdit = (values: any) => {
    if (!editRecord) return;
    const normalized: any = { ...values };
    if (typeof normalized.isActive === 'string') {
      normalized.isActive = normalized.isActive === 'true';
    }
    const updated: CostCenter = { ...editRecord, ...normalized };
    setData(prev =>
      reinsertWithOrder(
        prev.map(r => (r.key === editRecord.key ? updated : r)),
        updated,
        Number(values.sortOrder) || editRecord.sortOrder
      )
    );
    message.success('Cost Center Updated');
    setOpenModal(false);
    setIsEditing(false);
    setEditRecord(null);
  };

  const handleDelete = (record: CostCenter) => {
    const hasChecklist = (record.checklist || 0) > 0;
    if (hasChecklist) {
      setData(prev =>
        prev.map(r => (r.key === record.key ? { ...r, isActive: false, checklist: 0 } : r))
      );
      setCostCenterChecklists(prev => {
        const next = { ...prev };
        delete next[record.code];
        return next;
      });
      message.success('Cost Center inactivated and checklists removed');
    } else {
      setData(prev =>
        prev.filter(r => r.key !== record.key).map((r, i) => ({ ...r, sortOrder: i + 1 }))
      );
      message.success('Cost Center deleted');
    }
  };

  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span>Code</span>
          <Input value={filters.code} onChange={e => setParams({ code: e.target.value })} />
        </div>
      ),
      dataIndex: 'code',
      width: '15%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Name</span>
          <Input value={filters.name} onChange={e => setParams({ name: e.target.value })} />
        </div>
      ),
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Description</span>
          <Input
            value={filters.description}
            onChange={e => setParams({ description: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'description',
      width: '30%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Sort Order</span>
          <Input
            value={filters.sortOrder}
            onChange={e => setParams({ sortOrder: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'sortOrder',
      width: '8%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium">Status</span>
          <StatusSelect
            activeInactive
            value={filters.isActive}
            onChange={val => setParams({ isActive: val })}
            width="100%"
          />
        </div>
      ),
      width: '10%',
      render: (_: any, record: CostCenter) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      width: '14%',
      render: (_: any, record: CostCenter) => (
        <Space size="middle">
          <Badge count={record.checklist} style={{ background: 'var(--primary)' }}>
            <Button
              type="link"
              icon={<IconList />}
              onClick={e => {
                e.stopPropagation();
                if (!record.isActive) {
                  message.warning('Inactive cost center cannot manage checklists');
                  return;
                }
                setSelectedCostCenter(record);
                setOpenChecklist(true);
              }}
              className="text-primary"
            />
          </Badge>
          <Button
            type="link"
            icon={<IconPencil />}
            onClick={e => {
              e.stopPropagation();
              setIsEditing(true);
              setEditRecord(record);
              setOpenModal(true);
            }}
          />
          <span onClick={e => e.stopPropagation()}>
            <Popconfirm
              title={
                (record.checklist || 0) > 0
                  ? 'Are you sure you want to inactivate?'
                  : 'Are you sure you want to delete the cost center?'
              }
              description={
                (record.checklist || 0) > 0 ? (
                  <div className="text-sm">
                    <p>
                      This Cost Center is already mapped for existing jobs hence it can only be
                      inactivated.
                    </p>
                    <p className="mt-1">
                      Note: Inactivating the cost center will also remove the checklist(s) mapped
                      with this cost center.
                    </p>
                  </div>
                ) : undefined
              }
              okText={(record.checklist || 0) > 0 ? 'Inactive' : 'Delete'}
              cancelText="Cancel"
              onConfirm={() => handleDelete(record)}
            >
              <Button danger type="link" icon={<IconTrash />} />
            </Popconfirm>
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between p-4">
        <Typography.Title level={4}>Cost Center Master</Typography.Title>

        <Space size={16}>
          <Badge count={filteredData.length}>
            <Button>Total Records</Button>
          </Badge>
          <Button
            type="primary"
            onClick={() => {
              setIsEditing(false);
              setEditRecord(null);
              setOpenModal(true);
            }}
          >
            New Cost Center
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 10 }} />

      <ActionDialogmodel
        title={isEditing ? 'Edit Cost Center' : 'Create Cost Center'}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        submitButtonText="Save"
        fields={getCostCenterModalFields(isEditing)}
        isEditing={isEditing}
        initialValues={
          isEditing && editRecord
            ? { ...editRecord, isActive: String(editRecord.isActive) }
            : undefined
        }
        onSubmit={vals => (isEditing ? handleEdit(vals) : handleAdd(vals))}
      />

      {selectedCostCenter && (
        <ChecklistDrawer
          open={openChecklist}
          onClose={() => setOpenChecklist(false)}
          costCenterName={selectedCostCenter.code}
          initialSelected={costCenterChecklists[selectedCostCenter.code] || []}
          onUpdate={updatedList => {
            setCostCenterChecklists(prev => ({ ...prev, [selectedCostCenter.code]: updatedList }));
            setData(prev =>
              prev.map(row =>
                row.code === selectedCostCenter.code
                  ? { ...row, checklist: updatedList.length }
                  : row
              )
            );
          }}
        />
      )}
    </div>
  );
}
