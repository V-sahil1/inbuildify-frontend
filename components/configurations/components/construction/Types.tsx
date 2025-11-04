'use client';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Space, message, Tooltip, Select, Form } from 'antd';
import { IconCopy, IconEdit, IconFileText, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getDwellingTypes } from '@redux/feature/types/typesThunk';
import { Status } from '@lib/constants/enum';
import { constructionTypesFields } from '@/components/formFields/constructionTypesFields';
import { constructionData } from 'data/configuration/constructionType';
import ConfirmationModal from '@/components/common/ConfirmationModal';

interface BuildType {
  id: number;
  name: string;
  level: string;
  dwellingType: string;
  daysToStart: number;
  sortOrder: number;
}

export const Types: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.types);
  const [copyItemModel, setCopyItemModel] = useState<boolean>(false);
  const [data, setData] = useState<BuildType[]>(constructionData);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteVisible, setDeleteVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<BuildType | null>(null);

  useEffect(() => {
    if (status.dwellingType === Status.IDLE) {
      dispatch(getDwellingTypes());
    }
  }, [dispatch, status.dwellingType]);

  const handleOpenModal = (item?: BuildType) => {
    setCurrentItem(item || null);
    setModalVisible(true);
  };

  const handleSave = (values: any) => {
    if (currentItem?.id) {
      // Update existing item
      const updatedData = data.map(item =>
        item.id === currentItem.id
          ? {
              ...item,
              ...values,
              daysToStart: Number(values.daysToStart),
              sortOrder: Number(values.sortOrder),
            }
          : item
      );
      setData(updatedData);
      message.success('Build type updated');
    } else {
      // Add new item
      const newItem: BuildType = {
        id: Date.now(),
        name: values.name,
        level: values.level,
        dwellingType: values.dwellingType,
        daysToStart: Number(values.daysToStart),
        sortOrder: Number(values.sortOrder),
      };
      setData(prev => [...prev, newItem]);
      message.success('Build type added');
    }
    setModalVisible(false);
    setCopyItemModel(false);
    setCurrentItem(null);
  };

  const handleCopy = (item: BuildType) => {
    setCurrentItem(item || null);
    setCopyItemModel(true);
  };

  const confirmDelete = (item: BuildType) => {
    setCurrentItem(item);
    setDeleteVisible(true);
  };

  const handleDelete = () => {
    if (currentItem) {
      const updatedData = data
        .filter(i => i.id !== currentItem.id)
        .map((i, index) => ({ ...i, sortOrder: index + 1 }));
      setData(updatedData);
      message.success('Build type deleted');
    }
    setDeleteVisible(false);
  };

  const columns = [
    {
      title: 'S.No',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <span>Types</span>
        </div>
      ),
      dataIndex: 'name',
      render: (text: string, record: BuildType) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="flex gap-2 text-xs mt-1">
            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium">
              {record.level}
            </span>
            <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-md font-medium">
              {record.dwellingType}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <span>No of days To start construction</span>
        </div>
      ),
      dataIndex: 'daysToStart',
      render: (days: number) => `${days} Days`,
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'Actions',
      align: 'right' as const,
      render: (_: any, record: BuildType) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<IconEdit className="text-blue-500" />}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<IconTrash className="!text-red-500" />}
              onClick={() => confirmDelete(record)}
            />
          </Tooltip>
          <Tooltip title="Copy">
            <Button
              icon={<IconCopy className="!text-blue-400" />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="Export">
            <Button icon={<IconFileText className="!text-blue-400" />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center gap-4 justify-between  p-2 rounded-t-md mb-2">
        <div className="w-full flex flex-col gap-2">
          <p className="text-medium font-semibold">Builder</p>
          <Select
            defaultValue="My Home"
            options={[
              { label: 'My Home', value: 'My Home' },
              { label: 'Company Level', value: 'Company Level' },
            ]}
          />
        </div>
        <Button type="primary" onClick={() => handleOpenModal()}>
          + New
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

      {/* on the create it is showing the id in the UI but it will be set by the backend response so it is not error */}
      <ActionDialogmodel
        title={currentItem ? 'Edit Build Type' : 'Add Build Type'}
        open={isModalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSave}
        isEditing={!!currentItem}
        submitButtonText={currentItem ? 'Update' : 'Create'}
        fields={constructionTypesFields()}
        initialValues={currentItem}
      />

      <ActionDialogmodel
        title="copy construction Type"
        open={copyItemModel}
        onCancel={() => setCopyItemModel(false)}
        onSubmit={handleSave}
        isEditing={true}
        submitButtonText="Copy"
        fields={[
          {
            label: 'Builder',
            name: 'builder',
            type: 'select',
            options: [
              { label: 'My Home', value: 'My Home' },
              { label: 'Company Level', value: 'Company Level' },
            ],
          },
          {
            label: 'New construction type',
            name: 'newConstructionType',
            type: 'text',
          },
        ]}
        initialValues={currentItem}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        title="Confirm Delete"
        open={isDeleteVisible}
        onConfirm={handleDelete}
        onClose={() => setDeleteVisible(false)}
        confirmText="Delete"
        message={`Are you sure you want to delete  ${currentItem?.name}`}
        type="danger"
      />
    </div>
  );
};
