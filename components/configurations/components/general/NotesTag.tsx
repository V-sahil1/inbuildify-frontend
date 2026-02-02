'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Form, Popconfirm, Card, ColorPicker, message } from 'antd';
import { IconEdit, IconTrash, IconCheck, IconX, IconPlus } from '@tabler/icons-react';
import { notesTag } from '@redux/feature/admin/general/notesTag/INotesTagState';
import {
  createNotesTag,
  deleteNotesTag,
  fetchAllNotesTag,
  updateNotesTag,
} from '@redux/feature/admin/general/notesTag/notesTagThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const NotesTag: React.FC = () => {
  const [form] = Form.useForm();
  const [editingRow, setEditingRow] = useState<notesTag | null>(null);
  const dispatch = useAppDispatch();
  const { notesTag, status } = useAppSelector((state: RootState) => state.general.noteTags);

  useEffect(() => {
    async function fetchAllNotes() {
      try {
        await dispatch(fetchAllNotesTag()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch notes tag');
      }
    }
    if (status.fetch === Status.IDLE) {
      fetchAllNotes();
    }
  }, [status.fetch]);

  const handleAdd = () => {
    const newRow: notesTag = {
      notesTagId: '',
      name: '',
      backgroundColor: '#1677ff',
      fontColor: '#ffffff',
      isNew: true,
    };
    setEditingRow(newRow);
    form.setFieldsValue(newRow);
  };

  const handleSave = async () => {
    try {
      const values: notesTag = await form.validateFields();
      if (values) {
        if (editingRow && !!editingRow.notesTagId) {
          const prevValues = notesTag.filter(i => i.notesTagId === editingRow.notesTagId)[0];
          const { isUpdated, updatedFields } = getUpdatedFields<notesTag>(values, prevValues);
          if (!isUpdated) {
            message.info('No changes detected');
            return;
          }
          await dispatch(
            updateNotesTag({
              notesTagId: editingRow.notesTagId,
              data: updatedFields,
            })
          ).unwrap();
          message.success('Notes Tag updated successfully');
        } else {
          await dispatch(createNotesTag(values)).unwrap();
          message.success('Notes Tag created successfully');
        }
      }
      setEditingRow(null);
      form.resetFields();
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error(error || 'Failed to save notes tag');
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    form.resetFields();
  };

  const handleEdit = (record: notesTag) => {
    setEditingRow(record);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteNotesTag(id)).unwrap();
      message.success('Tag deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete tag');
    }
  };

  const ColorCell = ({
    name,
    record,
  }: {
    name: 'backgroundColor' | 'fontColor';
    record: notesTag;
  }) => {
    const isEditing = editingRow?.notesTagId === record.notesTagId;

    if (isEditing) {
      const currentValue = Form.useWatch(name, form);

      return (
        <Form.Item
          name={name}
          style={{ margin: 0 }}
          rules={[
            { required: true, message: `Please select ${name}` },
            { min: 4, message: 'Please enter valid hex code' },
          ]}
        >
          <div className="flex items-center gap-2">
            <ColorPicker
              value={currentValue}
              onChange={color => {
                const hex = color.toHexString().toUpperCase();
                form.setFieldValue(name, hex);
              }}
            />
            <Input
              value={currentValue}
              onChange={e => {
                let v = e.target.value || '';
                if (v && !v.startsWith('#')) v = '#' + v;
                form.setFieldValue(name, v.toUpperCase());
              }}
              style={{ width: 90, textTransform: 'uppercase' }}
              disabled={status.create === Status.PENDING}
            />
          </div>
        </Form.Item>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded border border-gray-300"
          style={{ backgroundColor: record[name] }}
        />
        <span className="font-mono text-sm">{record[name]?.toUpperCase()}</span>
      </div>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record: notesTag) =>
        editingRow?.notesTagId === record.notesTagId ? (
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please enter name' },
              { min: 3, message: 'name should contain at least 3 character' },
            ]}
            style={{ margin: 0 }}
          >
            <Input placeholder="Enter name" disabled={status.create === Status.PENDING} />
          </Form.Item>
        ) : (
          record.name
        ),
    },
    {
      title: 'Background Color',
      dataIndex: 'backgroundColor',
      render: (_, record: notesTag) => <ColorCell name="backgroundColor" record={record} />,
    },
    {
      title: 'Font Color',
      dataIndex: 'fontColor',
      render: (_, record: notesTag) => <ColorCell name="fontColor" record={record} />,
    },
    {
      title: (
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={handleAdd}
          disabled={!!editingRow}
        >
          New
        </Button>
      ),
      width: 120,
      render: (_, record: notesTag) =>
        editingRow?.notesTagId === record.notesTagId ? (
          <Space>
            <Button
              icon={<IconCheck size={16} />}
              type="text"
              size="small"
              onClick={handleSave}
              loading={status.create === Status.PENDING}
            />
            <Button icon={<IconX size={16} />} type="text" danger size="small" onClick={handleCancel} />
          </Space>
        ) : (
          <Space>
            <Button icon={<IconEdit size={16} />} type="text" size="small" onClick={() => handleEdit(record)} />
            <Popconfirm
              title="Delete this tag?"
              onConfirm={() => handleDelete(record.notesTagId)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button icon={<IconTrash size={16} />} type="text" danger size="small" />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const dataSource = editingRow && editingRow.isNew ? [editingRow, ...notesTag] : notesTag || [];

  return (
    <div className="p-6 space-y-4">
      <Card>
        <Form form={form} component={false}>
          <Table
            rowKey="id"
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            loading={status.fetch === Status.PENDING}
          />
        </Form>
      </Card>
    </div>
  );
};

export default NotesTag;
