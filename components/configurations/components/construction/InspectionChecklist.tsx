'use client';
import React, { useState } from 'react';
import { Table, Button, message, Dropdown, Switch } from 'antd';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { inspectionChecklistSettingFields } from '@/components/formFields/InspectionChecklistSettingFields';
import { inspectionChecklistData } from 'data/configuration/inspectionChecklist';
import { ChecklistHeader } from '../ChecklistHeader';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';

export interface RowData {
  key: string;
  description: string;
  sort: number;
  type: 'stage' | 'checklist';
  children?: RowData[];
}

export const InspectionChecklist: React.FC = () => {
  const [data, setData] = useState<RowData[]>(inspectionChecklistData);
  const [editing, setEditing] = useState<RowData | null>(null);
  const [editValue, setEditValue] = useState('');
  const [modalopen, setModalopen] = useState<'checklist' | 'stage' | null>(null);

  const handleEdit = (record: RowData) => {
    setEditing(record);
    setEditValue(record.description);
  };

  const handleDelete = (record: RowData) => {
    const deleteRecursive = (list: RowData[]): RowData[] =>
      list
        .filter(item => item.key !== record.key)
        .map(item =>
          item.children ? { ...item, children: deleteRecursive(item.children) } : item
        );
    setData(deleteRecursive(data));
    message.success('Deleted successfully');
  };

  const handleSave = () => {
    if (!editing) return;
    const updateRecursive = (list: RowData[]): RowData[] =>
      list.map(item => {
        if (item.key === editing.key) {
          return { ...item, description: editValue };
        }
        if (item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    setData(updateRecursive(data));
    setEditing(null);
    message.success('Updated successfully');
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: RowData) => (
        <span
          className={`${
            record.children
              ? 'font-semibold text-gray-700 bg-gray-100 block px-2 py-1 rounded'
              : 'text-gray-600'
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
      align: 'center' as const,
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: RowData) => (
        <div className="flex justify-center gap-4">
          <IconPencil
            className="text-blue-600 cursor-pointer hover:scale-110 transition"
            onClick={() => handleEdit(record)}
          />
          <IconTrash
            className="text-red-600 cursor-pointer hover:scale-110 transition"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <ChecklistHeader />
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Checklist Table</h2>
        <Dropdown
          menu={{
            items: [
              {
                key: 'checklist',
                label: 'New checklist',
                onClick: () => setModalopen('checklist'),
              },
              {
                key: 'stage',
                label: 'New Stage',
                onClick: () => setModalopen('stage'),
              },
            ],
          }}
        >
          <Button type="primary" icon={<IconPlus />}>
            New
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        expandable={{ defaultExpandAllRows: true }}
        rowClassName={record => (record.children ? 'bg-gray-50' : '')}
      />
      <ActionDialogmodel
        open={!!modalopen || !!editing}
        title={modalopen === 'checklist' ? 'New checklist' : 'New stage'}
        initialValues={editing}
        isEditing={!!editing}
        onCancel={() => {
          setModalopen(null);
          setEditing(null);
        }}
        onSubmit={() => {
          setModalopen(null);
          setEditing(null);
        }}
        fields={inspectionChecklistSettingFields(modalopen || editing?.type)}
      />

      {/* this is the delete model we have to manage according to the stage and the checklist deletion */}
      <ConfirmationContentModal
        open={false}
        onClose={() => console.log('close')}
        onSubmit={() => console.log('confirm')}
        title="Delete"
        content={
          <div className="space-y-4">
            <p>Are you sure you want to delete the inspection?</p>
            <div className="flex gap-2 ">
              <Switch />
              <p>
                Delete The inspection from all existing jobs. There is a defect created for this
                inspection checklist, deleting this checklist will also delete the defect.
              </p>
            </div>
          </div>
        }
        okText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};
