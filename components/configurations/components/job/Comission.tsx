'use client';
import React, { useState } from 'react';
import { Table, Switch, Button, Form, Space, message, Typography } from 'antd';
import { IconEdit, IconTrash, IconPlus, IconPin } from '@tabler/icons-react';
import type { ColumnsType } from 'antd/es/table';
import { comissionData } from 'data/configuration/comissionData';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import {
  getChildFields,
  getIncomingFields,
  getParentFields,
} from '@/components/formFields/comissionSettingFields';

const { Text } = Typography;

interface Stage {
  id: string;
  name: string;
  commissionValue: string;
  sort: number;
}

interface CommissionRecord {
  id: string;
  name: string;
  recipient: string;
  commissionValue: string;
  sort: number;
  stages: Stage[];
}

interface IncomingRecord {
  id: string;
  name: string;
  commissionValue: string;
  sort: number;
}

export const Comission: React.FC = () => {
  const [outgoingEnabled, setOutgoingEnabled] = useState(true);
  const [incomingEnabled, setIncomingEnabled] = useState(false);
  const [data, setData] = useState<CommissionRecord[]>(comissionData);
  const [incomingData, setIncomingData] = useState<IncomingRecord[]>([
    { id: 'i1', name: 'Distributor', commissionValue: '$10,000.00', sort: 1 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [incomingModalOpen, setIncomingModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<CommissionRecord | null>(null);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [editingParent, setEditingParent] = useState<string | null>(null);
  const [editingIncoming, setEditingIncoming] = useState<IncomingRecord | null>(null);

  const [form] = Form.useForm();
  const [childForm] = Form.useForm();
  const [incomingForm] = Form.useForm();

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

  // --- CRUD: Outgoing Parent ---
  const handleAddParent = () => {
    form.resetFields();
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleSaveParent = () => {
    form.validateFields().then(values => {
      const newSort = Number(values.sort);
      if (editingItem) {
        const adjusted = adjustSort(data, newSort, editingItem.id).map(item =>
          item.id === editingItem.id ? { ...item, ...values } : item
        );
        setData(adjusted);
        message.success('Updated successfully');
      } else {
        const newItem: CommissionRecord = {
          id: Date.now().toString(),
          stages: [],
          ...values,
        };
        const adjusted = adjustSort([...data, newItem], newSort);
        setData(adjusted);
        message.success('Added successfully');
      }
      setModalOpen(false);
    });
  };

  const handleEditParent = (record: CommissionRecord) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDeleteParent = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    message.success('Deleted successfully');
  };

  // --- CRUD: Outgoing Child (Stage) ---
  const handleAddChild = (parentId: string) => {
    setEditingParent(parentId);
    setEditingStage(null);
    childForm.resetFields();
    setChildModalOpen(true);
  };

  const handleEditChild = (parentId: string, stage: Stage) => {
    setEditingParent(parentId);
    setEditingStage(stage);
    childForm.setFieldsValue(stage);
    setChildModalOpen(true);
  };

  const handleSaveChild = () => {
    childForm.validateFields().then(values => {
      const parentIdx = data.findIndex(d => d.id === editingParent);
      if (parentIdx === -1) return;
      const parent = data[parentIdx];
      const newSort = Number(values.sort);

      let updatedStages;
      if (editingStage) {
        updatedStages = adjustSort(parent.stages, newSort, editingStage.id).map(s =>
          s.id === editingStage.id ? { ...s, ...values } : s
        );
      } else {
        const newStage: Stage = {
          id: Date.now().toString(),
          ...values,
        };
        updatedStages = adjustSort([...parent.stages, newStage], newSort);
      }

      parent.stages = updatedStages;
      const newData = [...data];
      newData[parentIdx] = { ...parent };
      setData(newData);
      setChildModalOpen(false);
      message.success('Stage saved successfully');
    });
  };

  const handleDeleteChild = (parentId: string, stageId: string) => {
    setData(prev =>
      prev.map(p =>
        p.id === parentId ? { ...p, stages: p.stages.filter(s => s.id !== stageId) } : p
      )
    );
    message.success('Stage deleted');
  };

  // --- CRUD: Incoming ---
  const handleAddIncoming = () => {
    incomingForm.resetFields();
    setEditingIncoming(null);
    setIncomingModalOpen(true);
  };

  const handleEditIncoming = (record: IncomingRecord) => {
    setEditingIncoming(record);
    incomingForm.setFieldsValue(record);
    setIncomingModalOpen(true);
  };

  const handleSaveIncoming = () => {
    incomingForm.validateFields().then(values => {
      const newSort = Number(values.sort);
      if (editingIncoming) {
        const adjusted = adjustSort(incomingData, newSort, editingIncoming.id).map(i =>
          i.id === editingIncoming.id ? { ...i, ...values } : i
        );
        setIncomingData(adjusted);
      } else {
        const newItem: IncomingRecord = { id: Date.now().toString(), ...values };
        const adjusted = adjustSort([...incomingData, newItem], newSort);
        setIncomingData(adjusted);
      }
      message.success('Incoming record saved');
      setIncomingModalOpen(false);
    });
  };

  const handleDeleteIncoming = (id: string) => {
    setIncomingData(prev => prev.filter(i => i.id !== id));
    message.success('Deleted successfully');
  };

  const outgoingColumns: ColumnsType<CommissionRecord> = [
    { title: 'S.No', dataIndex: 'sort', width: 80 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Recipient', dataIndex: 'recipient' },
    { title: 'Commission Value', dataIndex: 'commissionValue' },
    { title: 'Sort', dataIndex: 'sort', width: 100 },
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
          <Button
            size="small"
            danger
            icon={<IconTrash size={16} />}
            onClick={() => handleDeleteParent(record.id)}
          />
          <Button
            size="small"
            icon={<IconPlus size={16} />}
            onClick={() => handleAddChild(record.id)}
          />
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: CommissionRecord) => {
    const stageColumns: ColumnsType<Stage> = [
      { title: '', dataIndex: 'icon', width: 40, render: () => <IconPin size={16} /> },
      { title: 'Stage', dataIndex: 'name' },
      { title: 'Commission Value', dataIndex: 'commissionValue' },
      { title: 'Sort', dataIndex: 'sort', width: 80 },
      {
        title: '',
        width: 120,
        render: (_, stage) => (
          <Space>
            <Button
              size="small"
              icon={<IconEdit size={14} />}
              onClick={() => handleEditChild(record.id, stage)}
            />
            <Button
              size="small"
              danger
              icon={<IconTrash size={14} />}
              onClick={() => handleDeleteChild(record.id, stage.id)}
            />
          </Space>
        ),
      },
    ];
    return (
      <Table
        columns={stageColumns}
        dataSource={sortData(record.stages)}
        pagination={false}
        rowKey="id"
        size="small"
      />
    );
  };

  const incomingColumns: ColumnsType<IncomingRecord> = [
    { title: 'S.No', dataIndex: 'sort', width: 80 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Commission Value', dataIndex: 'commissionValue' },
    { title: 'Sort', dataIndex: 'sort', width: 100 },
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
            onClick={() => handleDeleteIncoming(record.id)}
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
        <Switch checked={outgoingEnabled} onChange={setOutgoingEnabled} />
        <p>Define Outgoing Commission Settings</p>
      </div>

      {outgoingEnabled && (
        <>
          <div className="flex items-end justify-end mb-2">
            <Button type="primary" icon={<IconPlus size={18} />} onClick={handleAddParent}>
              New
            </Button>
          </div>
          <Table
            columns={outgoingColumns}
            dataSource={sortData(data)}
            expandable={{ expandedRowRender }}
            pagination={false}
            rowKey="id"
          />
        </>
      )}

      <div className="flex items-center mt-4 gap-2">
        <Switch checked={incomingEnabled} onChange={setIncomingEnabled} />
        <p>Define Incoming Commission Settings</p>
      </div>

      {incomingEnabled && (
        <>
          <div className="flex items-end justify-end mb-2">
            <Button type="primary" icon={<IconPlus size={18} />} onClick={handleAddIncoming}>
              New
            </Button>
          </div>
          <Table
            columns={incomingColumns}
            dataSource={sortData(incomingData)}
            pagination={false}
            rowKey="id"
            bordered
          />
        </>
      )}

      {/* Outgoing Parent Modal */}
      <ActionDialogmodel
        title={editingItem ? 'Edit Commission Setting' : 'Add Commission Setting'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        isEditing={!!editingItem}
        onSubmit={handleSaveParent}
        fields={getParentFields()}
        initialValues={editingItem || {}}
        submitButtonText={editingItem ? 'Update' : 'Create'}
      />

      {/* Outgoing Child Modal */}
      <ActionDialogmodel
        title={editingStage ? 'Edit Stage' : 'Add Stage'}
        open={childModalOpen}
        onCancel={() => setChildModalOpen(false)}
        isEditing={!!editingStage}
        onSubmit={handleSaveChild}
        fields={getChildFields()}
        initialValues={editingStage || {}}
        submitButtonText={editingStage ? 'Update' : 'Create'}
      />

      {/* Incoming Modal */}
      <ActionDialogmodel
        title={editingIncoming ? 'Edit Incoming Commission' : 'Add Incoming Commission'}
        open={incomingModalOpen}
        onCancel={() => setIncomingModalOpen(false)}
        isEditing={!!editingIncoming}
        onSubmit={handleSaveIncoming}
        fields={getIncomingFields()}
        initialValues={editingIncoming || {}}
        submitButtonText={editingIncoming ? 'Update' : 'Create'}
      />
    </div>
  );
};
