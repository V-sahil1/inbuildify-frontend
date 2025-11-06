'use client';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { IconCheck, IconEdit, IconMapDown, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { Button, Dropdown, Input, Table } from 'antd';
import type { TableProps } from 'antd';
import { useRef, useState } from 'react';

const options = ['Address', 'Created Date', 'FileType', 'Full Name', 'Reference Number'];

export const FileNaming = () => {
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [deleteModelOpen, setDeleteModelOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // For naming format input
  const [value, setValue] = useState('');
  const [savedValue, setSavedValue] = useState(''); // last confirmed value
  const inputRef = useRef<any>(null);

  const columns = [
    {
      title: 'File Type',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <p>{text}</p>,
    },
    {
      title: 'Folder',
      dataIndex: 'folder',
      key: 'folder',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            icon={<IconEdit />}
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setModelOpen(true);
            }}
          />
          <Button
            icon={<IconTrash />}
            className="text-red-500"
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setDeleteModelOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Parent Folder 1',
      folder: 'Folder 1',
    },
    {
      key: '2',
      name: 'Parent Folder 2',
      folder: 'Folder 2',
    },
  ];

  const insertAtCursor = (text: string) => {
    const input = inputRef.current?.resizableTextArea?.textArea;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newValue = value.slice(0, start) + `[${text}]` + value.slice(end);
    setValue(newValue);

    // Restore cursor position
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + text.length + 2, start + text.length + 2);
    }, 0);
  };

  return (
    <>
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500">
          Note: These folders will be shown in the job details under the Documents section
        </p>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={() => {
            setSelectedRecord(null);
            setModelOpen(true);
          }}
        >
          New
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName="hover:bg-gray-50"
      />

      {/* Model for add/edit */}
      <ActionDialogmodel
        open={modelOpen}
        title={selectedRecord ? 'Edit Folder' : 'New Folder'}
        isEditing={!!selectedRecord}
        initialValues={selectedRecord}
        onCancel={() => setModelOpen(false)}
        onSubmit={() => setModelOpen(false)}
        fields={[
          {
            label: 'Name',
            name: 'name',
            type: 'text',
          },
          {
            label: 'Folder',
            name: 'folder',
            type: 'select',
            options: [
              { label: 'Receipts', value: 'receipts' },
              { label: 'Invoices', value: 'invoices' },
              { label: 'Sketches', value: 'sketches' },
            ],
          },
        ]}
      />

      {/* Naming Format Section */}
      <div className="w-full p-4">
        <div className="text-lg font-semibold mb-1">Naming Format</div>
        <p className="text-sm text-gray-500 mb-3">
          Only space, hyphen & underscores are allowed for text separation. Special characters such
          as ~ | @ # $ % ^ & * ( ) ; / &lt; &gt; ? , [ ] {'{'} {'}'} ' " are not allowed.
        </p>

        <div className="flex items-center gap-2">
          <Input.TextArea
            ref={inputRef}
            rows={2}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter naming format..."
            className="flex-1"
          />

          <Dropdown
            menu={{
              items: options.map(opt => ({
                key: opt,
                label: opt,
                onClick: () => insertAtCursor(opt),
              })),
            }}
            trigger={['click']}
          >
            <Button type="default">
              Insert Personalization <IconMapDown />
            </Button>
          </Dropdown>

          {/* Only show save/cancel when changed */}
          {value !== savedValue && (
            <>
              <Button type="text" icon={<IconCheck />} onClick={() => setSavedValue(value)} />
              <Button type="text" icon={<IconX />} onClick={() => setValue(savedValue)} />
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmationModal
        open={deleteModelOpen}
        type="danger"
        onClose={() => setDeleteModelOpen(false)}
        onConfirm={() => setDeleteModelOpen(false)}
        message="Are you sure you want to delete this folder?"
      />
    </>
  );
};
