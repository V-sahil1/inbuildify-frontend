'use client';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { IconCheck, IconEdit, IconMapDown, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { Button, Dropdown, Input, message, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createFileNaming,
  createFileNamingFormat,
  deleteFileNaming,
  fetchAllFileNaming,
  fetchAllFileNamingFormat,
  updateFileNaming,
} from '@redux/feature/admin/document/fileNaming/fileNamingThunk';
import { Status } from '@lib/constants/enum';
import { fetchAllDocumentArea } from '@redux/feature/admin/document/area/documentAreaThunk';
import { CustomBulkSelect } from '@/components/common/CustomBulkSelect';
import { FileNamingRule } from '@redux/feature/admin/document/fileNaming/IFileNamingState';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const options = ['Address', 'Created Date', 'FileType', 'Full Name', 'Reference Number'];

export const FileNaming = () => {
  const dispatch = useAppDispatch();
  const { files, namingFormat, status, namingFormatStatus } = useAppSelector(
    state => state.document.files
  );
  const { commonFolder, status: folderStatus } = useAppSelector(state => state.document.area);
  const [modelOpen, setModelOpen] = useState<'create' | 'delete' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<FileNamingRule | null>(null);

  // For naming format input
  const [value, setValue] = useState('');
  const inputRef = useRef<TextAreaRef>(null);
  const folderOptions =
    commonFolder &&
    commonFolder.map(item => ({ label: item.name, value: item.documentCommonFolderId }));

  const fetchFolders = async () => {
    try {
      await dispatch(fetchAllDocumentArea()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch folders');
    }
  };

  const fetchFileNamingFormat = async () => {
    try {
      await dispatch(fetchAllFileNamingFormat()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch file naming format');
    }
  };

  const fetchFileNaming = async () => {
    try {
      await dispatch(fetchAllFileNaming()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch file naming');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchFileNaming();
    }
    if (folderStatus.fetch === Status.IDLE) {
      fetchFolders();
    }
    if (namingFormatStatus.fetch === Status.IDLE) {
      fetchFileNamingFormat();
    }
    if (namingFormat) {
      setValue(namingFormat);
    }
  }, [status.fetch, folderStatus.fetch, namingFormatStatus.fetch]);

  const handleSave = async values => {
    try {
      if (selectedRecord) {
        const {isUpdated, updatedFields} = getUpdatedFields(values, {
          fileType: selectedRecord.fileType,
          folderIds: selectedRecord.folderNames.map(i => i.id),
        });
        if (!isUpdated) {
          setModelOpen(null);
          setSelectedRecord(null);
          return;
        }

        await dispatch(
          updateFileNaming({ data: updatedFields, id: selectedRecord.documentFileNamingRuleId })
        ).unwrap();
        message.success('File naming updated successfully');
      } else {
        await dispatch(createFileNaming(values)).unwrap();
        message.success('File naming created successfully');
      }
      setSelectedRecord(null);
      setModelOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save file');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteFileNaming(selectedRecord.documentFileNamingRuleId)).unwrap();
      message.success('File naming deleted successfully');
      setSelectedRecord(null);
      setModelOpen(null);
    } catch (error) {
      message.error(error || 'Failed to delete file');
    }
  };

  const columns = [
    {
      title: 'File Type',
      dataIndex: 'fileType',
      key: 'fileType',
    },
    {
      title: 'Folder',
      dataIndex: 'folderNames',
      key: 'folderNames',
      render: folderNames => {
        return folderNames && folderNames.map(folder => folder.name).join(', ');
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<IconEdit />}
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setModelOpen('create');
            }}
          />
          <Button
            icon={<IconTrash />}
            className="text-red-500"
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setModelOpen('delete');
            }}
          />
        </div>
      ),
    },
  ];

  const handleSaveNamingFormat = async (value: string) => {
    try {
      await dispatch(createFileNamingFormat({ namingFormat: value })).unwrap();
      message.success('File naming format saved successfully');
    } catch (error) {
      message.error(error || 'Failed to save file');
    }
  };

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
            setModelOpen('create');
          }}
        >
          New
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={files}
        pagination={false}
        rowClassName="hover:bg-gray-50"
        loading={status.fetch === Status.PENDING}
      />

      {/* Model for add/edit */}
      {modelOpen === 'create' && (
        <ActionDialogmodel
          open={modelOpen === 'create'}
          title={selectedRecord ? 'Edit Folder' : 'New Folder'}
          isEditing={!!selectedRecord}
          initialValues={{
            ...selectedRecord,
            folderIds: selectedRecord?.folderNames?.map(folder => folder.id),
          }}
          onCancel={() => setModelOpen(null)}
          onSubmit={values => handleSave(values)}
          fields={[
            {
              label: 'Name',
              name: 'fileType',
              type: 'text',
              rules: [{ required: true, message: 'Please enter file type' }],
            },
            {
              label: 'Folder',
              name: 'folderIds',
              type: 'custom',
              render: <CustomBulkSelect options={folderOptions} onChange={() => {}} />,
            },
          ]}
          loading={status.create === Status.PENDING}
        />
      )}

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
          {value !== namingFormat && (
            <>
              <Button
                type="text"
                icon={<IconCheck />}
                onClick={() => {
                  handleSaveNamingFormat(value);
                }}
                loading={namingFormatStatus.create === Status.PENDING}
              />
              <Button type="text" icon={<IconX />} onClick={() => setValue(namingFormat)} />
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {modelOpen === 'delete' && (
        <ConfirmationModal
          open={modelOpen === 'delete'}
          type="danger"
          onClose={() => setModelOpen(null)}
          onConfirm={() => handleDelete()}
          message="Are you sure you want to delete this folder?"
          loading={status.create === Status.PENDING}
        />
      )}
    </>
  );
};
