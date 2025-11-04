'use client';
import React, { useState } from 'react';
import { Table, Button, message, Dropdown, Switch, Input, Popconfirm } from 'antd';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { ohListData } from 'data/configuration/ohListData';

export interface RowData {
  key: string;
  description: string;
  sort: number;
  children?: RowData[];
}

export const OHList: React.FC = () => {
  const [data, setData] = useState(ohListData);
  const [editing, setEditing] = useState<RowData | null>(null);
  const [editValue, setEditValue] = useState('');
  const [modalopen, setModalopen] = useState<boolean | null>(null);
  const [signatureRequired, setSignatureRequired] = useState(false);
  const [minAudits, setMinAudits] = useState('');

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
            record.children ? 'font-semibold text-gray-700  block px-2  rounded' : 'text-gray-600'
          }`}
        >
          {record.children ? (
            <div className="flex justify-between">
              <div className="flex  gap-2 flex-col">
                {text}
                <div className="flex items-center gap-2">
                  <IconPlus size={16} className="border rounded-full border-primary text-primary" />
                  Notes
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>Add to default</p>
                <div>
                  <Switch />
                </div>
              </div>
            </div>
          ) : (
            text
          )}
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
      render: (_: any, record: RowData) =>
        record.children ? (
          <Button icon={<IconPlus />} type="primary" onClick={() => setModalopen(true)}>
            New
          </Button>
        ) : (
          <div className="flex justify-center gap-4">
            <IconPencil
              className="text-blue-600 cursor-pointer hover:scale-110 transition"
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={() => handleDelete(record)}
            >
              <IconTrash className="text-red-600 cursor-pointer hover:scale-110 transition" />
            </Popconfirm>
          </div>
        ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h2>

        {/* Signature Required Section */}
        <div className="flex items-start gap-3 mb-6">
          <Switch checked={signatureRequired} onChange={setSignatureRequired} className="mt-1" />
          <div>
            <div className="text-gray-800 font-medium">Signature Required</div>
            <p className="text-gray-600 text-sm leading-snug mt-1">
              When the toggle is <span className="font-semibold">ON</span> — During list submission,
              if the logged-in user has an email signature, it will be added to the PDF.
              <br />
              When the toggle is <span className="font-semibold">OFF</span> — During list
              submission, regardless of whether the toggle is enabled or not, the user’s email
              signature will not be added to the PDF.
            </p>
          </div>
        </div>

        {/* Minimum Audits Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="text-gray-800 font-medium mb-2 sm:mb-0">Minimum Audits</div>
            <Input
              placeholder="No count given"
              value={minAudits}
              onChange={e => setMinAudits(e.target.value)}
              className="w-48"
            />
          </div>
          <p className="text-gray-600 text-sm leading-snug mt-2">
            Based on the values provided, score will be calculated on the OH&amp;S count graph. If
            the value is provided as <span className="font-semibold">2</span>, then the scoring can
            be calculated as follows:
            <br />2 audits per week = 100%, 1 audit per week = 50%, 0 audits per week = 0%.
          </p>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">OH&S List Table</h2>
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
        open={modalopen || !!editing}
        title={`${!!editing ? 'Edit' : 'New OH&S List'}`}
        initialValues={editing}
        isEditing={!!editing}
        onCancel={() => {
          setModalopen(null);
          setEditing(null);
        }}
        onSubmit={() => {
          handleSave();
          setModalopen(null);
          setEditing(null);
        }}
        fields={[
          {
            label: 'Description',
            name: 'description',
            type: 'text',
            placeholder: 'Enter description',
            rules: [{ required: true, message: 'Please enter description' }],
          },
          {
            label: 'Sort',
            name: 'sort',
            type: 'number',
            rules: [{ required: true, message: 'Please enter sort' }],
          },
        ]}
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
