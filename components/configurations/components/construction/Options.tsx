'use client';
import { useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import ConfirmationModal from '@/components/common/ConfirmationModal';

interface OptionItem {
  id: number;
  name: string;
}

export const Options: React.FC = () => {
  const [data, setData] = useState<OptionItem[]>([
    { id: 1, name: 'Polyethylene Foam' },
    { id: 2, name: 'Bricks' },
    { id: 3, name: 'Hebel' },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<OptionItem | null>(null);

  const handleOpenModal = (item?: OptionItem) => {
    setCurrentItem(item || null);
    setModalVisible(true);
  };

  const handleSave = (values: any) => {
    console.log(values);
    if (currentItem) {
      setData(prev => prev.map(i => (i.id === currentItem.id ? { ...i, name: values.name } : i)));
      message.success('Option updated');
    } else {
      setData(prev => [...prev, { id: Date.now(), name: values.name }]);
      message.success('Option added');
    }
    setModalVisible(false);
  };

  const confirmDelete = (item: OptionItem) => {
    setCurrentItem(item);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    if (currentItem) {
      setData(prev => prev.filter(i => i.id !== currentItem.id));
      message.success('Option deleted');
    }
    setDeleteModalVisible(false);
  };

  const columns = [
    {
      title: 'S.No',
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
    },
    {
      title: 'Options',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      align: 'right' as const,
      render: (_: any, record: OptionItem) => (
        <Space>
          <Button
            type="default"
            icon={<IconEdit className="!text-blue-500" />}
            onClick={() => handleOpenModal(record)}
          />
          <Button
            type="default"
            icon={<IconTrash className="!text-red-500" />}
            onClick={() => confirmDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between  p-2 rounded-t-md mb-2">
        <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Options</h3>
        <Button type="primary" onClick={() => handleOpenModal()} icon={<IconPlus />}>
          New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        bordered
        className="text-sm"
      />

      <ActionDialogmodel
        title={currentItem ? 'Edit Option' : 'Add Option'}
        open={isModalVisible}
        onCancel={() => setModalVisible(false)}
        isEditing={!!currentItem}
        initialValues={currentItem}
        onSubmit={handleSave}
        fields={[
          {
            label: 'Option Name',
            name: 'name',
            type: 'text',
          },
        ]}
      />

      <ConfirmationModal
        open={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        type="danger"
        message={`Are you sure you want to delete ${currentItem?.name}`}
      />
    </div>
  );
};
