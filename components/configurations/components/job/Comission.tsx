'use client';
import React, { useEffect, useState } from 'react';
import { Table, Switch, Button, Form, Space, message, Typography, Popconfirm } from 'antd';
import { IconEdit, IconTrash, IconPlus, IconPin } from '@tabler/icons-react';
import type { ColumnsType } from 'antd/es/table';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import {
  getChildFields,
  getIncomingFields,
  getParentFields,
} from '@/components/formFields/comissionSettingFields';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createCommissionStage,
  createOutgoingCommission,
  deleteCommissionStage,
  deleteOutgoingCommission,
  fetchAllCommissionStage,
  fetchAllOutgoingCommission,
  fetchJobCommissionSetting,
  updateCommissionStage,
  updateJobCommissionSetting,
  updateOutgoingCommission,
} from '@redux/feature/admin/job/jobCommission/jobCommissionThunk';
import { Status } from '@lib/constants/enum';
import {
  CommissionStage,
  JobCommission,
} from '@redux/feature/admin/job/jobCommission/IJobCommissionState';
import { toggleExpand } from '@redux/feature/admin/job/jobCommission/jobCommissionSlice';

const { Text } = Typography;

export const Comission: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    commissionSetting,
    outgoingCommission,
    incomingCommission,
    commissionStageStatus,
    outgoingCommissionStatus,
    incomingCommissionStatus,
    status,
  } = useAppSelector(state => state.job.jobCommission);
  const [outgoingEnabled, setOutgoingEnabled] = useState<boolean>();
  const [incomingEnabled, setIncomingEnabled] = useState<boolean>();
  const [modalOpen, setModalOpen] = useState<'outgoing' | 'incoming' | 'outgoingChild' | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<JobCommission | null>(null);
  const [editingStage, setEditingStage] = useState<CommissionStage | null>(null);
  const [editingParent, setEditingParent] = useState<string | null>(null);
  const [editingIncoming, setEditingIncoming] = useState<CommissionStage | null>(null);
  const [form] = Form.useForm();
  const [childForm] = Form.useForm();
  const [incomingForm] = Form.useForm();

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchCommissionSetting();
    }
    if (commissionSetting) {
      setOutgoingEnabled(commissionSetting.defineOutgoingCommission);
      setIncomingEnabled(commissionSetting.defineIncomingCommission);
    }

    if (
      outgoingCommissionStatus.fetch === Status.IDLE &&
      commissionSetting?.defineOutgoingCommission
    ) {
      fetchOutgoingommission();
    }

    if (
      incomingCommissionStatus.fetch === Status.IDLE &&
      commissionSetting?.defineIncomingCommission
    ) {
      fetchIncomingommission();
    }
  }, [
    status.fetch,
    commissionSetting,
    outgoingCommissionStatus.fetch,
    incomingCommissionStatus.fetch,
  ]);

  const fetchCommissionSetting = async () => {
    try {
      await dispatch(fetchJobCommissionSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch job commission setting');
    }
  };

  const fetchOutgoingommission = async () => {
    try {
      await dispatch(fetchAllOutgoingCommission({ commission_type: 'outgoing' })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch outgoing commission');
    }
  };

  const fetchIncomingommission = async () => {
    try {
      await dispatch(fetchAllOutgoingCommission({ commission_type: 'incoming' })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch outgoing commission');
    }
  };

  // --- Sorting helpers ---
  const sortData = (arr: any[]) => [...arr].sort((a, b) => a.sort - b.sort);

  const adjustSort = (arr: any[], newSort: number, editingId?: string) => {
    const sorted = sortData(arr);
    let updated = sorted;
    if (newSort < 1) newSort = 1;
    if (newSort > arr.length + (editingId ? 0 : 1)) newSort = arr.length + 1;

    if (editingId) updated = updated.filter(i => i.id !== editingId);
    updated.splice(newSort - 1, 0, { placeholder: true });

    return updated
      .filter(i => !i.placeholder)
      .map((item, idx) => ({
        ...item,
        sort: idx + 1,
      }));
  };

  //save setting
  async function handleSaveSetting() {
    try {
      await dispatch(
        updateJobCommissionSetting({
          defineOutgoingCommission: outgoingEnabled,
          defineIncomingCommission: incomingEnabled,
        })
      ).unwrap();
      message.success('Job commission setting updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update job commission setting');
    }
  }

  // --- CRUD: Outgoing Parent ---
  const handleAddParent = () => {
    form.resetFields();
    setEditingItem(null);
    setModalOpen('outgoing');
  };

  const handleSaveParent = async values => {
    await form.validateFields();
    try {
      if (editingItem) {
        await dispatch(
          updateOutgoingCommission({
            data: values,
            id: editingItem.jobCommissionId,
            commissionType: 'outgoing',
          })
        ).unwrap();
        message.success('Outgoing commission updated successfully');
      } else {
        await dispatch(
          createOutgoingCommission({ ...values, commissionType: 'outgoing' })
        ).unwrap();
        message.success('Outgoing commission created successfully');
      }
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save outgoing commission');
    }
  };

  const handleEditParent = (record: JobCommission) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalOpen('outgoing');
  };

  const handleDeleteParent = async (id: string) => {
    try {
      await dispatch(deleteOutgoingCommission({ id, commissionType: 'outgoing' })).unwrap();
      message.success('Outgoing commission deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete outgoing commission');
    }
  };

  // --- CRUD: Outgoing Child (Stage) ---
  const handleAddChild = (parentId: string) => {
    setEditingParent(parentId);
    setEditingStage(null);
    childForm.resetFields();
    setModalOpen('outgoingChild');
  };

  const handleEditChild = (parentId: string, stage: CommissionStage) => {
    setEditingParent(parentId);
    setEditingStage(stage);
    childForm.setFieldsValue(stage);
    setModalOpen('outgoingChild');
  };

  const handleSaveChild = async values => {
    await childForm.validateFields();
    try {
      if (editingStage) {
        await dispatch(
          updateCommissionStage({
            data: values,
            id: editingStage.jobCommissionSubStageId,
            commissionId: editingParent,
          })
        ).unwrap();
        message.success('Outgoing commission stage updated successfully');
      } else {
        await dispatch(
          createCommissionStage({ ...values, jobCommissionId: editingParent })
        ).unwrap();
        message.success('Outgoing commission stage created successfully');
      }
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save outgoing commission stage');
    }
  };

  const handleDeleteChild = async (parentId: string, stageId: string) => {
    try {
      await dispatch(deleteCommissionStage({ id: stageId, commissionId: parentId })).unwrap();
      message.success('Stage deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete stage');
    }
  };

  // --- CRUD: Incoming ---
  const handleAddIncoming = () => {
    incomingForm.resetFields();
    setEditingIncoming(null);
    setModalOpen('incoming');
  };

  const handleEditIncoming = (record: CommissionStage) => {
    setEditingIncoming(record);
    incomingForm.setFieldsValue(record);
    setModalOpen('incoming');
  };

  const handleSaveIncoming = async values => {
    await incomingForm.validateFields();
    try {
      if (editingIncoming) {
        await dispatch(
          updateOutgoingCommission({
            data: values,
            id: editingIncoming.jobCommissionId,
            commissionType: 'incoming',
          })
        ).unwrap();
        message.success('Outgoing commission updated successfully');
      } else {
        await dispatch(
          createOutgoingCommission({ ...values, commissionType: 'incoming' })
        ).unwrap();
        message.success('Outgoing commission created successfully');
      }
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save incoming record');
    }
  };

  const handleDeleteIncoming = async (id: string) => {
    try {
      await dispatch(deleteOutgoingCommission({ id, commissionType: 'incoming' })).unwrap();
      message.success('Outgoing commission deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete outgoing commission');
    }
  };

  const outgoingColumns: ColumnsType<JobCommission> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Recipient', dataIndex: 'recipient' },
    { title: 'Commission Value', dataIndex: 'commissionValue' },
    { title: 'Sort', dataIndex: 'sortOrder', width: 100 },
    {
      title: '',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<IconEdit size={16} />}
            onClick={() => handleEditParent(record)}
          />
          <Popconfirm
            title="Are you sure to delete this commission?"
            onConfirm={() => handleDeleteParent(record.jobCommissionId)}
          >
            <Button size="small" danger icon={<IconTrash size={16} />} />
          </Popconfirm>

          <Button
            size="small"
            icon={<IconPlus size={16} />}
            onClick={() => handleAddChild(record.jobCommissionId)}
          />
        </Space>
      ),
    },
  ];
  const getStageData = async record => {
    if (!record.isExpanded) {
      dispatch(toggleExpand(record.jobCommissionId));
      try {
        await dispatch(fetchAllCommissionStage(record.jobCommissionId)).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch stage data');
      }
    }
  };
  const expandedRowRender = (record: JobCommission) => {
    const id = record.jobCommissionId;
    getStageData(record);
    const stageColumns: ColumnsType<CommissionStage> = [
      { title: '', dataIndex: 'icon', width: 40, render: () => <IconPin size={16} /> },
      { title: 'Stage', dataIndex: 'name' },
      { title: 'Commission Value', dataIndex: 'commissionValue' },
      { title: 'Sort', dataIndex: 'sortOrder', width: 80 },
      {
        title: '',
        width: 120,
        render: (_, record) => (
          <Space>
            <Button
              size="small"
              icon={<IconEdit size={14} />}
              onClick={() => handleEditChild(id, record)}
            />
            <Button
              size="small"
              danger
              icon={<IconTrash size={14} />}
              onClick={() => handleDeleteChild(id, record.jobCommissionSubStageId)}
            />
          </Space>
        ),
      },
    ];
    return (
      <Table
        columns={stageColumns}
        dataSource={record.stages}
        pagination={false}
        rowKey="id"
        size="small"
        loading={commissionStageStatus.fetch === Status.PENDING}
      />
    );
  };

  const incomingColumns: ColumnsType<CommissionStage> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Commission Value', dataIndex: 'commissionValue' },
    { title: 'Sort', dataIndex: 'sortOrder', width: 100 },
    {
      title: '',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<IconEdit size={16} />}
            onClick={() => handleEditIncoming(record)}
          />
          <Button
            size="small"
            danger
            icon={<IconTrash size={16} />}
            onClick={() => handleDeleteIncoming(record.jobCommissionId)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>Commission Settings</Typography.Title>
      <Text type="secondary">
        If you select '$' for the recipient, the Commission Value will be fixed.
        <br />
        If you select '%' for the recipient, the Commission Value will be calculated based on the
        contract amount.
        <br />
        <br />
        If you select '$' for the stage, the Commission Value will be fixed.
        <br />
        If you select '%' for the stage, the Commission Value will be calculated based on the
        recipient's commission value.
      </Text>

      <div className="flex items-center mt-4 gap-2">
        <Switch
          checked={outgoingEnabled}
          onChange={setOutgoingEnabled}
          disabled={status.update === Status.PENDING}
        />
        <p>Define Outgoing Commission Settings</p>
      </div>
      <div className="flex items-center mt-4 gap-2">
        <Switch
          checked={incomingEnabled}
          onChange={setIncomingEnabled}
          disabled={status.update === Status.PENDING}
        />
        <p>Define Incoming Commission Settings</p>
      </div>
      <div className="flex items-center justify-end mb-4 gap-2">
        {(outgoingEnabled !== commissionSetting?.defineOutgoingCommission ||
          incomingEnabled !== commissionSetting?.defineIncomingCommission) && (
          <Button
            type="primary"
            onClick={handleSaveSetting}
            loading={status.update === Status.PENDING}
          >
            Save
          </Button>
        )}
      </div>
      {commissionSetting?.defineOutgoingCommission && (
        <>
          <div className="flex items-center justify-between my-2">
            <p>Outgoing Commission</p>
            <Button type="primary" icon={<IconPlus size={18} />} onClick={handleAddParent}>
              New
            </Button>
          </div>
          <Table
            columns={outgoingColumns}
            dataSource={sortData(outgoingCommission)}
            expandable={{ expandedRowRender }}
            pagination={false}
            rowKey="jobCommissionId"
            loading={outgoingCommissionStatus.fetch === Status.PENDING}
          />
        </>
      )}

      {commissionSetting?.defineIncomingCommission && (
        <>
          <div className="flex items-center justify-between my-2">
            <p>Incoming Commission</p>
            <Button type="primary" icon={<IconPlus size={18} />} onClick={handleAddIncoming}>
              New
            </Button>
          </div>
          <Table
            columns={incomingColumns}
            dataSource={sortData(incomingCommission)}
            pagination={false}
            rowKey="id"
            bordered
            loading={incomingCommissionStatus.fetch === Status.PENDING}
          />
        </>
      )}

      {/* Outgoing Parent Modal */}
      {modalOpen === 'outgoing' && (
        <ActionDialogmodel
          title={editingItem ? 'Edit Commission Setting' : 'Add Commission Setting'}
          open={modalOpen === 'outgoing'}
          onCancel={() => setModalOpen(null)}
          isEditing={!!editingItem}
          onSubmit={handleSaveParent}
          fields={getParentFields()}
          initialValues={editingItem || {}}
          submitButtonText={editingItem ? 'Update' : 'Create'}
          loading={outgoingCommissionStatus.update === Status.PENDING}
        />
      )}

      {/* Outgoing Child Modal */}
      {modalOpen === 'outgoingChild' && (
        <ActionDialogmodel
          title={editingStage ? 'Edit Stage' : 'Add Stage'}
          open={modalOpen === 'outgoingChild'}
          onCancel={() => setModalOpen(null)}
          isEditing={!!editingStage}
          onSubmit={handleSaveChild}
          fields={getChildFields()}
          initialValues={editingStage || {}}
          submitButtonText={editingStage ? 'Update' : 'Create'}
          loading={commissionStageStatus.update === Status.PENDING}
        />
      )}

      {/* Incoming Modal */}
      {modalOpen === 'incoming' && (
        <ActionDialogmodel
          title={editingIncoming ? 'Edit Incoming Commission' : 'Add Incoming Commission'}
          open={modalOpen === 'incoming'}
          onCancel={() => setModalOpen(null)}
          isEditing={!!editingIncoming}
          onSubmit={handleSaveIncoming}
          fields={getIncomingFields()}
          initialValues={editingIncoming || {}}
          submitButtonText={editingIncoming ? 'Update' : 'Create'}
          loading={incomingCommissionStatus.update === Status.PENDING}
        />
      )}
    </div>
  );
};
