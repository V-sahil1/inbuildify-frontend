'use client';

import React, { useState } from 'react';
import { Button, Modal, Table, message, Input, Dropdown, Menu } from 'antd';
import { IconEdit, IconPlus, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { notesTemplateData, personalizationList } from 'data/configuration/TemplateData';

export const TemplateNotes = () => {
  const [templates, setTemplates] = useState(notesTemplateData);
  const [modalMode, setModalMode] = useState<false | 'activate' | 'deactivate'>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const [templateForm, setTemplateForm] = useState({
    notestemplate: '',
    content: '',
  });

  const insertToken = (token: string) =>
    setTemplateForm(prev => ({ ...prev, content: prev.content + ` [${token}]` }));

  const saveTemplate = () => {
    if (!templateForm.notestemplate.trim()) {
      return message.error('Template name required.');
    }

    const newEntry = {
      key: templates.length + 1,
      ...templateForm,
      activated: false,
    };

    setTemplates([newEntry, ...templates]);
    resetForm();
    message.success('Template added. Click + to activate.');
  };

  const updateTemplate = () => {
    setTemplates(prev =>
      prev.map(item => (item.key === isEditing ? { ...item, ...templateForm } : item))
    );

    resetForm();
    message.success('Template updated.');
  };

  const activateTemplate = () => {
    setTemplates(prev =>
      prev.map(t => (t.key === selectedRow.key ? { ...t, activated: true } : t))
    );

    closeModal();
    message.success('Template activated.');
  };

  const deactivateTemplate = () => {
    setTemplates(prev =>
      prev.map(t => (t.key === selectedRow.key ? { ...t, activated: false } : t))
    );

    closeModal();
    message.success('Template deactivated.');
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
        const editing = isEditing === record.key;
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
            <div className="font-medium text-sm">{record.notestemplate}</div>

            <div className="text-xs mt-1 whitespace-pre-line">{record.content}</div>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex justify-end">
          {!isCreating && !isEditing && (
            <Button type="primary" onClick={() => setIsCreating(true)}>
              <IconPlus /> New
            </Button>
          )}
        </div>
      ),
      width: '10%',
      render: (_: any, record: any) => {
        const editing = isEditing === record.key;
        const creating = record.newRow;

        if (creating) {
          return (
            <div className="flex gap-1 mt-2">
              <Button type="text" onClick={saveTemplate}>
                <IconCheck size={18} className="text-primaary" />
              </Button>

              <Button type="text" danger onClick={resetForm}>
                <IconX size={18} />
              </Button>
            </div>
          );
        }

        if (editing) {
          return (
            <div className="flex gap-1 mt-2">
              <Button type="text" onClick={updateTemplate}>
                <IconCheck size={18} className="text-primaary" />
              </Button>

              <Button type="text" danger onClick={resetForm}>
                <IconX size={18} />
              </Button>
            </div>
          );
        }

        return (
          <div className="flex justify-end gap-2">
            {!record.activated ? (
              <Button
                type="text"
                onClick={() => {
                  setSelectedRow(record);
                  setModalMode('activate');
                }}
              >
                <IconPlus size={18} />
              </Button>
            ) : (
              <>
                <Button
                  type="text"
                  onClick={() => {
                    setIsEditing(record.key);
                    setTemplateForm({
                      notestemplate: record.notestemplate,
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

  const tableData = isCreating ? [{ key: 'new', newRow: true }, ...templates] : templates;

  return (
    <div className="space-y-4">
      <Table columns={columns} dataSource={tableData} pagination={false} />

      <Modal
        title="Confirmation"
        open={modalMode !== false}
        onCancel={closeModal}
        centered
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          modalMode === 'activate' && (
            <Button key="ok" type="primary" onClick={activateTemplate}>
              Activate
            </Button>
          ),
          modalMode === 'deactivate' && (
            <Button key="deact" type="primary" onClick={deactivateTemplate}>
              Deactivate
            </Button>
          ),
        ]}
      >
        <p>
          <strong>Template Name:</strong> {selectedRow?.notestemplate}
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
