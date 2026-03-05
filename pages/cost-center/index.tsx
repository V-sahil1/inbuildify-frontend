'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Space, message, Typography } from 'antd';
import { debouncedURL } from '@lib/utils/debounceURL';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { ChecklistDrawer } from '@/components/common/ChecklistDrawer';
import { getCostCenterModalFields } from '@/components/costCenter/costCenterFormFields';
import { CostCennterGetParams, ICostCenter } from '@redux/feature/costCenter/IcostCenterState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createCostCenterChecklist,
  deleteCostCenterChecklist,
  fetchAllCostCenter,
  fetchAllCostCenterChecklist,
} from '@redux/feature/costCenter/costCenterThunk';
import { CostCenterColumn } from '@/components/table-columns/CostCenterColumn';
import { ConstructionChecklistType } from '@redux/feature/admin/construction/constructionChecklist/IConstructionChecklistState';

export default function CostCenterMaster() {
  const dispatch = useAppDispatch();
  const { costCenter, status } = useAppSelector(state => state.costCenter);
  const [openModal, setOpenModal] = useState<'costCenter' | 'checklist' | null>(null);
  const [editRecord, setEditRecord] = useState<ICostCenter | null>(null);
  const { debouncedUpdateURL, setParams, filters, instantFilters} = debouncedURL({
    filtersKey: ['code', 'name', 'description', 'sortOrder', 'isActive'],
    initialValue: { isActive: '' },
  });
  const { columns, handleSubmit } = CostCenterColumn(
    instantFilters,
    setParams,
    setEditRecord,
    setOpenModal,
    editRecord
  );

  useEffect(() => {
    fetchCostCenter();
  }, [filters]);

  useEffect(() => {
    fetchCostCenterChecklistData();
  }, [status.fetch]);

  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const fetchCostCenter = async () => {
    try {
      const params: CostCennterGetParams = {
        code: filters.code || undefined,
        name: filters.name || undefined,
        description: filters.description || undefined,
        sort_order: Number(filters.sortOrder) || undefined,
        status: filters.isActive !== '' ? filters.isActive === 'true' : undefined,
      };
      await dispatch(fetchAllCostCenter(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch cost center ');
    }
  };

  const fetchCostCenterChecklistData = async () => {
    try {
      costCenter.map(
        async i => await dispatch(fetchAllCostCenterChecklist(i.costCenterId)).unwrap()
      );
    } catch (error) {
      message.error(error || 'Failed to fetch cost center checklist data');
    }
  };

  const handleAddChecklist = async (values: ConstructionChecklistType) => {
    try {
      const payload = {
        costCenterId: editRecord?.costCenterId,
        constructionChecklistId: values.constructionChecklistId,
      };
      await dispatch(createCostCenterChecklist(payload)).unwrap();
      message.success('Checklist added successfully');
    } catch (error) {
      message.error(error || 'Failed to add checklist');
    }
  };

  const handleRemoveChecklist = async (values, id) => {
    try {
      const payload = {
        costCenterId: editRecord?.costCenterId,
        constructionChecklistId: values.constructionChecklistId,
        id,
      };
      await dispatch(deleteCostCenterChecklist(payload)).unwrap();
      message.success('Checklist removed successfully');
    } catch (error) {
      message.error(error || 'Failed to remove checklist');
    }
  };

  return (
    <div>
      <div className="flex justify-between p-4">
        <Typography.Title level={4}>Cost Center Master</Typography.Title>

        <Space size={16}>
          <Badge count={costCenter.length}>
            <Button>Total Records</Button>
          </Badge>
          <Button
            type="primary"
            onClick={() => {
              setEditRecord(null);
              setOpenModal('costCenter');
            }}
          >
            New Cost Center
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={costCenter} pagination={{ pageSize: 10 }} />

      {openModal === 'costCenter' && (
        <ActionDialogmodel
          title={!!editRecord ? 'Edit Cost Center' : 'Create Cost Center'}
          open={openModal === 'costCenter'}
          onCancel={() => setOpenModal(null)}
          submitButtonText="Save"
          fields={getCostCenterModalFields(!!editRecord)}
          isEditing={!!editRecord}
          initialValues={{ ...editRecord, status: editRecord?.status?.toString() }}
          onSubmit={values => handleSubmit(values)}
        />
      )}

      {openModal === 'checklist' && (
        <ChecklistDrawer
          open={openModal === 'checklist'}
          onClose={() => setOpenModal(null)}
          title={`Checklists for ${editRecord.code}`}
          initialSelected={
            costCenter.find(i => i.costCenterId === editRecord.costCenterId)?.checklist || []
          }
          onUpdate={handleAddChecklist}
          onRemove={handleRemoveChecklist}
        />
      )}
    </div>
  );
}
