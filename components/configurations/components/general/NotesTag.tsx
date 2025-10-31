'use client';
import React, { useState } from 'react';
import { Button, Input, Table, Space, Form, Popconfirm, Card, ColorPicker } from 'antd';
import { IconEdit, IconTrash, IconCheck, IconX, IconPlus } from '@tabler/icons-react';
import { notesTagData } from 'data/configuration/ConfigrationData';

type TagRow = {
  id: number;
  name: string;
  backgroundColor: string;
  fontColor: string;
  isNew?: boolean;
};

const NotesTag: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('lead');
  const [form] = Form.useForm();
  const [editingRow, setEditingRow] = useState<TagRow | null>(null);

  const [sectionData, setSectionData] = useState<Record<string, TagRow[]>>(notesTagData);

  const handleAdd = () => {
    const newRow: TagRow = {
      id: Date.now(),
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
      const values = await form.validateFields();
      const newList = [...(sectionData[selectedSection] || [])];
      if (!editingRow) return;

      if (editingRow.isNew) {
        newList.unshift({ ...values, id: editingRow.id });
      } else {
        const idx = newList.findIndex(i => i.id === editingRow.id);
        if (idx >= 0) newList[idx] = { ...editingRow, ...values };
      }

      setSectionData({ ...sectionData, [selectedSection]: newList });
      setEditingRow(null);
      form.resetFields();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    form.resetFields();
  };

  const handleEdit = (record: TagRow) => {
    setEditingRow(record);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: number) => {
    const updated = (sectionData[selectedSection] || []).filter(i => i.id !== id);
    setSectionData({ ...sectionData, [selectedSection]: updated });
  };

  const handleSectionChange = (val: string) => {
    setSelectedSection(val);
    setEditingRow(null);
    form.resetFields();
  };

  const ColorCell = ({
    name,
    record,
  }: {
    name: 'backgroundColor' | 'fontColor';
    record: TagRow;
  }) => {
    const isEditing = editingRow?.id === record.id;

    if (isEditing) {
      const currentValue = Form.useWatch(name, form);

      return (
        <Form.Item name={name} style={{ margin: 0 }}>
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
      render: (_: any, record: TagRow) =>
        editingRow?.id === record.id ? (
          <Form.Item name="name" rules={[{ required: true }]} style={{ margin: 0 }}>
            <Input placeholder="Enter name" />
          </Form.Item>
        ) : (
          record.name
        ),
    },
    {
      title: 'Background Color',
      dataIndex: 'backgroundColor',
      render: (_: any, record: TagRow) => <ColorCell name="backgroundColor" record={record} />,
    },
    {
      title: 'Font Color',
      dataIndex: 'fontColor',
      render: (_: any, record: TagRow) => <ColorCell name="fontColor" record={record} />,
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
      render: (_: any, record: TagRow) =>
        editingRow?.id === record.id ? (
          <Space>
            <Button
              icon={<IconCheck size={16} />}
              type="primary"
              size="small"
              onClick={handleSave}
            />
            <Button icon={<IconX size={16} />} danger size="small" onClick={handleCancel} />
          </Space>
        ) : (
          <Space>
            <Button icon={<IconEdit size={16} />} size="small" onClick={() => handleEdit(record)} />
            <Popconfirm
              title="Delete this tag?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button icon={<IconTrash size={16} />} danger size="small" />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const dataSource =
    editingRow && editingRow.isNew
      ? [editingRow, ...(sectionData[selectedSection] || [])]
      : sectionData[selectedSection] || [];

  return (
    <div className="p-6 space-y-4">
      <Card>
        <Form form={form} component={false}>
          <Table rowKey="id" pagination={false} dataSource={dataSource} columns={columns} />
        </Form>
      </Card>
    </div>
  );
};

export default NotesTag;
