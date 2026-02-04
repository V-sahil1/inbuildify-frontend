'use client';
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Tooltip, Select } from 'antd';
import { IconCopy, IconEdit, IconFileText, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { constructionTypesFields } from '@/components/formFields/constructionTypesFields';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useBuildersHook } from '@hooks/useBuildersHook';
import { useDwellingAndRangeHook } from '@hooks/useDwellingAndRangeHook';
import {
  createType,
  deleteType,
  fetchAllType,
  updateType,
} from '@redux/feature/admin/construction/constructionType/constructionTypeThunk';
import { ConstructionType } from '@redux/feature/admin/construction/constructionType/IConstructionTypeState';
import { ColumnType } from 'antd/es/table';

export const Types: React.FC = () => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState<'copy' | 'create' | 'delete'>(null);
  const [currentItem, setCurrentItem] = useState<ConstructionType | null>(null);
  const { builderOptions } = useBuildersHook();
  const { dwellingTypeOptions } = useDwellingAndRangeHook({ type: 'dwellingType' });
  const [builderId, setBuilderId] = useState<string>('');
  const { type, status: constructionTypeStatus } = useAppSelector(
    state => state.construction.constructionType
  );

  const fetchData = async () => {
    try {
      const result = await dispatch(fetchAllType()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch construction type');
    }
  };

  useEffect(() => {
    if (constructionTypeStatus.fetch === Status.IDLE) {
      fetchData();
    }
  }, [constructionTypeStatus.fetch]);

  useEffect(() => {
    if (builderOptions && builderOptions.length > 0 && !builderId) {
      setBuilderId(builderOptions[0].value);
    }
  }, [builderOptions, builderId]);

  const handleOpenModal = (item?: ConstructionType) => {
    setCurrentItem(item || null);
    setModalOpen('create');
  };

  const handleSave = async values => {
    try {
      if (currentItem?.constructionTypeId) {
        await dispatch(updateType({ data: values, id: currentItem?.constructionTypeId })).unwrap();
        message.success('Build type updated');
      } else {
        await dispatch(createType({ ...values, builder: builderId })).unwrap();
        message.success('Build type added');
      }
      setModalOpen(null);
      setCurrentItem(null);
    } catch (error) {
      message.error(error || 'Failed to save construction type');
    }
  };

  const handleCopy = (item: ConstructionType) => {
    setCurrentItem(item || null);
    setModalOpen('copy');
  };

  const confirmDelete = (item: ConstructionType) => {
    setCurrentItem(item);
    setModalOpen('delete');
  };

  const handleDelete = async () => {
    try {
      if (currentItem) {
        await dispatch(deleteType(currentItem.constructionTypeId)).unwrap();
        message.success('Build type deleted');
      }
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to delete construction type');
    }
  };

  const columns: ColumnType<ConstructionType>[] = [
    {
      title: 'S.No',
      render: (_, __, index: number) => index + 1,
      width: 60,
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <span>Types</span>
        </div>
      ),
      dataIndex: 'typesName',
      render: (_, record: ConstructionType) => (
        <div>
          <div className="font-medium">{record.typesName || 'No name'}</div>
          <div className="flex gap-2 text-xs mt-1">
            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium">
              {record.builder.name}
            </span>
            <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-md font-medium">
              {record.dwellingType.map(item => item.name).join(', ')}
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
      dataIndex: 'startConstructionDays',
      render: (startConstructionDays: number) => `${startConstructionDays} Days`,
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
      render: (_, record: ConstructionType) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<IconEdit size={16} className="text-blue-500" />}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<IconTrash size={16} className="!text-red-500" />}
              onClick={() => confirmDelete(record)}
            />
          </Tooltip>
          <Tooltip title="Copy">
            <Button
              type="text"
              icon={<IconCopy size={16} className="!text-blue-400" />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="Export">
            <Button type="text" icon={<IconFileText size={16} className="!text-blue-400" />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-card-color rounded-xl shadow-sm">
      <div className="space-y-2 mb-4">
        <p className="text-medium font-semibold">Builder</p>
        <div className="w-full flex justify-between gap-2">
          <Select
            value={builderId}
            options={builderOptions}
            onChange={value => setBuilderId(value)}
            className="w-full"
          />
          <Button type="primary" onClick={() => handleOpenModal()}>
            + New
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={type || []}
        rowKey="constructionTypeId"
        pagination={false}
        bordered
        className="text-sm"
        loading={constructionTypeStatus.fetch === Status.PENDING}
      />

      {/* on the create it is showing the id in the UI but it will be set by the backend response so it is not error */}
      {modalOpen === 'create' && (
        <ActionDialogmodel
          title={currentItem ? 'Edit Build Type' : 'Add Build Type'}
          open={modalOpen === 'create'}
          onCancel={() => setModalOpen(null)}
          onSubmit={handleSave}
          isEditing={!!currentItem}
          submitButtonText={currentItem ? 'Update' : 'Create'}
          fields={constructionTypesFields(dwellingTypeOptions)}
          initialValues={{
            ...currentItem,
            dwellingType: currentItem?.dwellingType?.map(item => item.id),
          }}
          loading={constructionTypeStatus.create === Status.PENDING}
        />
      )}

      {modalOpen === 'copy' && (
        <ActionDialogmodel
          title="copy construction Type"
          open={modalOpen === 'copy'}
          onCancel={() => setModalOpen(null)}
          onSubmit={handleSave}
          isEditing={true}
          submitButtonText="Copy"
          fields={[
            {
              label: 'Builder',
              name: 'builder',
              type: 'select',
              options: builderOptions,
            },
            {
              label: 'New construction type',
              name: 'newConstructionType',
              type: 'text',
            },
          ]}
          initialValues={currentItem}
          loading={constructionTypeStatus.create === Status.PENDING}
        />
      )}

      {/* Delete Confirmation Modal */}
      {modalOpen === 'delete' && (
        <ConfirmationModal
          title="Confirm Delete"
          open={modalOpen === 'delete'}
          onConfirm={handleDelete}
          onClose={() => setModalOpen(null)}
          confirmText="Delete"
          message={`Are you sure you want to delete  ${currentItem?.typesName}`}
          type="danger"
          loading={constructionTypeStatus.create === Status.PENDING}
        />
      )}
    </div>
  );
};
