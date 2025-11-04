import React, { useState } from 'react';
import { Table, Input, Button, Space, Tooltip } from 'antd';
import { IconCheck, IconEdit, IconPlus, IconTrash, IconX } from '@tabler/icons-react';

export const MaintenanceArea = () => {
  const [data, setData] = useState([
    { key: 1, name: 'Bathroom' },
    { key: 2, name: 'Doors' },
    { key: 3, name: 'Kitchen' },
    { key: 4, name: 'Others' },
    { key: 5, name: 'Paint' },
    { key: 6, name: 'Wall' },
  ]);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = () => {
    setIsAdding(true);
    const newKey = data.length + 1;
    setData([...data, { key: newKey, name: '' }]);
    setEditingKey(newKey);
  };

  const handleSave = (key: number) => {
    const newData = data.map(item =>
      item.key === key ? { ...item, name: newValue || item.name } : item
    );
    setData(newData);
    setEditingKey(null);
    setIsAdding(false);
    setNewValue('');
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleEdit = (record: any) => {
    setEditingKey(record.key);
    setNewValue(record.name);
  };

  const handleCancel = (key: number) => {
    if (isAdding) {
      setData(data.filter(item => item.key !== key));
      setIsAdding(false);
    }
    setEditingKey(null);
    setNewValue('');
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'key',
      width: '80px',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Maintenance Area',
      dataIndex: 'name',
      render: (text: string, record: any) =>
        editingKey === record.key ? (
          <Input value={newValue} onChange={e => setNewValue(e.target.value)} autoFocus />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '',
      align: 'right' as const,
      render: (_: any, record: any) => {
        if (editingKey === record.key) {
          return (
            <Space>
              <Tooltip title="Save">
                <Button
                  type="text"
                  icon={<IconCheck style={{ color: 'green' }} />}
                  onClick={() => handleSave(record.key)}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  type="text"
                  icon={<IconX style={{ color: 'red' }} />}
                  onClick={() => handleCancel(record.key)}
                />
              </Tooltip>
            </Space>
          );
        }
        return (
          <Space>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<IconEdit style={{ color: '#ff9d00ff' }} />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<IconTrash style={{ color: 'red' }} />}
                onClick={() => handleDelete(record.key)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-gray-700 text-lg">Maintenance Area</div>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={handleAddNew}
          disabled={isAdding || editingKey !== null}
        >
          New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        rowClassName="text-sm"
      />
    </div>
  );
};
