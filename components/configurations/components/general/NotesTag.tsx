'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Space, Form, Popconfirm, Card, ColorPicker, message } from 'antd';
import { IconEdit, IconTrash, IconCheck, IconX, IconPlus } from '@tabler/icons-react';
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
import { NotesTagType } from '@redux/feature/admin/general/notesTag/INotesTagState';
import TooltipButton from '@/components/common/TooltipButton';

const NotesTag: React.FC = () => {
  const [form] = Form.useForm();
  const [editingRow, setEditingRow] = useState<NotesTagType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const { notesTag, status, pagination } = useAppSelector(
    (state: RootState) => state.general.noteTags
  );
  const PAGE_SIZE = 10;
  useEffect(() => {
    fetchAllNotes();
  }, [currentPage]);
  async function fetchAllNotes(page: number = currentPage, limit: number = PAGE_SIZE) {
    try {
      await dispatch(fetchAllNotesTag({ page, limit })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch notes tag');
    }
  }

  const handleAdd = () => {
    const newRow: NotesTagType = {
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
      const values: NotesTagType = await form.validateFields();
      if (values) {
        if (editingRow && !!editingRow.notesTagId) {
          const prevValues = notesTag.filter(i => i.notesTagId === editingRow.notesTagId)[0];
          const { isUpdated, updatedFields } = getUpdatedFields<NotesTagType>(values, prevValues);
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

  const handleEdit = (record: NotesTagType) => {
    setEditingRow(record);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteNotesTag(id)).unwrap();
      if (notesTag.length === 1 && currentPage !== 1) {
        setCurrentPage(prev => prev - 1);
      } else if (currentPage !== pagination?.totalPages) {
        fetchAllNotes(currentPage, PAGE_SIZE);
      }
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
    record: NotesTagType;
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
      render: (_, record: NotesTagType) =>
        editingRow?.notesTagId === record.notesTagId ? (
          <Form.Item
            name="name"
            rules={[
              {
                validator: (_, value) => {
                  if (value.startsWith(' ') || value.endsWith(' ')) {
                    return Promise.reject('Name cannot start or end with spaces');
                  }
                  return Promise.resolve();
                },
              },
              { required: true, message: 'Please enter name' },
              { min: 3, message: 'name should contain at least 3 character' },
              { max: 100, message: 'name should not exceed 100 characters' },
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
      render: (_, record: NotesTagType) => <ColorCell name="backgroundColor" record={record} />,
    },
    {
      title: 'Font Color',
      dataIndex: 'fontColor',
      render: (_, record: NotesTagType) => <ColorCell name="fontColor" record={record} />,
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
      render: (_, record: NotesTagType) =>
        editingRow?.notesTagId === record.notesTagId ? (
          <Space>
            <Button
              icon={<IconCheck size={16} />}
              type="text"
              size="small"
              onClick={handleSave}
              loading={status.create === Status.PENDING}
            />
            <Button
              icon={<IconX size={16} color="red" />}
              type="text"
              size="small"
              onClick={handleCancel}
            />
          </Space>
        ) : (
          <Space>
            <TooltipButton
              title="Edit"
              icon={<IconEdit size={16} />}
              type="text"
              size="small"
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Are you sure you wantt to delete this tag?"
              onConfirm={() => handleDelete(record.notesTagId)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <TooltipButton
                title="Delete"
                icon={<IconTrash size={16} color="red" />}
                type="text"
                size="small"
              />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const dataSource = editingRow && editingRow.isNew ? [editingRow, ...notesTag] : notesTag || [];

  return (
    <div className="p-6 space-y-4">
      <Form form={form} component={false}>
        <Table
          rowKey="id"
          pagination={{
            current: pagination?.currentPage,
            pageSize: pagination?.limit,
            total: pagination?.totalRecords,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => (
              <p className="text-font-color">
                {range[0]}-{range[1]} of ${total} items
              </p>
            ),
            onChange: page => {
              setCurrentPage(page);
            },
          }}
          dataSource={dataSource}
          columns={columns}
          loading={status.fetch === Status.PENDING}
        />
      </Form>
    </div>
  );
};

export default NotesTag;
