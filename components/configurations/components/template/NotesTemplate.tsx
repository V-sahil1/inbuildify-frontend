'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, message, Input, Dropdown, Menu } from 'antd';
import { IconEdit, IconPlus, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { personalizationList } from 'data/configuration/TemplateData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  activateNotesTemplate,
  createNotesTemplate,
  fetchNotesTemplate,
  updateNotesTemplate,
} from '@redux/feature/admin/template/notes/notesThunk';
import { Status } from '@lib/constants/enum';

export const TemplateNotes = () => {
  const dispatch = useAppDispatch();
  const { notes, status } = useAppSelector(state => state.template.notesTemplate);

  const [modalMode, setModalMode] = useState<false | 'activate' | 'deactivate'>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [templateForm, setTemplateForm] = useState({
    notestemplate: '',
    content: '',
  });

  const fetchNotesData = async () => {
    try {
      await dispatch(fetchNotesTemplate()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch the notes');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchNotesData();
    }
  }, [dispatch, status.fetch]);

  const insertToken = (token: string) =>
    setTemplateForm(prev => ({ ...prev, content: prev.content + ` [${token}]` }));

  const saveTemplate = async () => {
    if (!templateForm.notestemplate.trim()) {
      return message.error('Template name required.');
    }

    try {
      await dispatch(
        createNotesTemplate({
          name: templateForm.notestemplate,
          content: templateForm.content,
        })
      ).unwrap();
      message.success('Template added. Click + to activate.');
      resetForm();
    } catch (error: any) {
      message.error(error || 'Failed to create template');
    }
  };

  const updateTemplate = async () => {
    if (!isEditing) return;

    try {
      await dispatch(
        updateNotesTemplate({
          id: isEditing,
          data: {
            name: templateForm.notestemplate,
            content: templateForm.content,
          },
        })
      ).unwrap();
      message.success('Template updated.');
      resetForm();
    } catch (error: any) {
      message.error(error || 'Failed to update template');
    }
  };

  const activateTemplate = async () => {
    if (!selectedRow) return;

    try {
      await dispatch(
        activateNotesTemplate({
          id: selectedRow.templateNoteId,
        })
      ).unwrap();
      message.success('Template activated.');
      closeModal();
    } catch (error: any) {
      message.error(error || 'Failed to activate template');
    }
  };

  const deactivateTemplate = async () => {
    if (!selectedRow) return;

    try {
      await dispatch(
        activateNotesTemplate({
          id: selectedRow.templateNoteId,
        })
      ).unwrap();
      message.success('Template deactivated.');
      closeModal();
    } catch (error: any) {
      message.error(error || 'Failed to deactivate template');
    }
  };

  const resetForm = () => {
    setTemplateForm({ notestemplate: '', content: '' });
    setIsCreating(false);
    setIsEditing(null);
  };

  const closeModal = () => {
    setModalMode(false);
    setSelectedRow(null);
  };

  const menu = (
    <Menu>
      {personalizationList.map(item => (
        <Menu.Item key={item} onClick={() => insertToken(item)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: 'S.No',
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Notes Template',
      width: '75%',
      render: (_: any, record: any) => {
        const editing = isEditing === record.templateNoteId;
        const creating = record.newRow;

        if (creating || editing) {
          return (
            <div>
              <div className="flex items-center gap-[10%] mb-2">
                <Input
                  placeholder="Template Name"
                  value={templateForm.notestemplate}
                  onChange={e => setTemplateForm(p => ({ ...p, notestemplate: e.target.value }))}
                />

                <Dropdown overlay={menu} trigger={['click']}>
                  <Button size="small">Insert Personalization ▼</Button>
                </Dropdown>
              </div>

              <Input.TextArea
                rows={5}
                placeholder="Write template content..."
                value={templateForm.content}
                onChange={e => setTemplateForm(p => ({ ...p, content: e.target.value }))}
              />
            </div>
          );
        }

        return (
          <div>
            <div className="font-medium text-sm">{record.name}</div>

            <div className="text-xs mt-1 whitespace-pre-line">{record.content}</div>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex justify-end">
          {!isCreating && !isEditing && (
            <Button
              type="primary"
              onClick={() => setIsCreating(true)}
              disabled={status.create === Status.PENDING}
            >
              <IconPlus /> New
            </Button>
          )}
        </div>
      ),
      width: '10%',
      render: (_: any, record: any) => {
        const editing = isEditing === record.templateNoteId;
        const creating = record.newRow;

        if (creating) {
          return (
            <div className="flex gap-1 mt-2">
              <Button type="text" onClick={saveTemplate} loading={status.create === Status.PENDING}>
                <IconCheck size={18} className="text-primaary" />
              </Button>

              <Button
                type="text"
                danger
                onClick={resetForm}
                disabled={status.create === Status.PENDING}
              >
                <IconX size={18} />
              </Button>
            </div>
          );
        }

        if (editing) {
          return (
            <div className="flex gap-1 mt-2">
              <Button
                type="text"
                onClick={updateTemplate}
                loading={status.update === Status.PENDING}
              >
                <IconCheck size={18} className="text-primaary" />
              </Button>

              <Button
                type="text"
                danger
                onClick={resetForm}
                disabled={status.update === Status.PENDING}
              >
                <IconX size={18} />
              </Button>
            </div>
          );
        }

        return (
          <div className="flex justify-end gap-2">
            {!record.isActive ? (
              <Button
                type="text"
                onClick={() => {
                  setSelectedRow(record);
                  setModalMode('activate');
                }}
              >
                <IconPlus size={18} className="text-gray-400" />
              </Button>
            ) : (
              <>
                <Button
                  type="text"
                  onClick={() => {
                    setIsEditing(record.templateNoteId);
                    setTemplateForm({
                      notestemplate: record.name,
                      content: record.content,
                    });
                  }}
                >
                  <IconEdit size={18} />
                </Button>

                <Button
                  type="text"
                  danger
                  onClick={() => {
                    setSelectedRow(record);
                    setModalMode('deactivate');
                  }}
                >
                  <IconTrash size={18} />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const tableData = isCreating ? [{ templateNoteId: 'new', newRow: true }, ...notes] : notes;

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        loading={status.fetch === Status.PENDING}
        rowKey="templateNoteId"
      />

      <Modal
        title="Confirmation"
        open={modalMode !== false}
        onCancel={closeModal}
        centered
        footer={[
          <Button key="cancel" onClick={closeModal} disabled={status.activate === Status.PENDING}>
            Cancel
          </Button>,
          modalMode === 'activate' && (
            <Button
              key="ok"
              type="primary"
              onClick={activateTemplate}
              loading={status.activate === Status.PENDING}
            >
              Activate
            </Button>
          ),
          modalMode === 'deactivate' && (
            <Button
              key="deact"
              type="primary"
              onClick={deactivateTemplate}
              loading={status.activate === Status.PENDING}
            >
              Deactivate
            </Button>
          ),
        ]}
      >
        <p>
          <strong>Template Name:</strong> {selectedRow?.name}
        </p>
        <p>
          {modalMode === 'deactivate'
            ? 'Are you sure you want to deactivate this template?'
            : 'Are you sure you want to activate this template?'}
        </p>
      </Modal>
    </div>
  );
};
