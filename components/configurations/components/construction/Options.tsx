'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { IConstructionOption } from '@redux/feature/admin/construction/constructionOption/ICostructionOptionState';
import {
  createConstructionOption,
  deleteConstructionOption,
  fetchAllConstructionOption,
  updateContructionOption,
} from '@redux/feature/admin/construction/constructionOption/constructionOptionThunk';
import { Status } from '@lib/constants/enum';
import TooltipButton from '@/components/common/TooltipButton';

export const Options: React.FC = () => {
  const dispatch = useAppDispatch();
  const { constructionOption, status } = useAppSelector(
    state => state.construction.constructionOption
  );

  const [isModalVisible, setModalVisible] = useState<'create' | 'delete' | null>(null);
  const [currentItem, setCurrentItem] = useState<IConstructionOption | null>(null);

  const fetchAllConstructionOptionData = async () => {
    try {
      await dispatch(fetchAllConstructionOption()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch option data');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchAllConstructionOptionData();
    }
  }, [status.fetch]);

  const handleOpenModal = (item?: IConstructionOption) => {
    setCurrentItem(item || null);
    setModalVisible('create');
  };

  const handleSave = async (values: IConstructionOption) => {
    try {
      if (currentItem) {
        if (values.optionName === currentItem.optionName) {
          setModalVisible(null);
          return;
        }
        await dispatch(
          updateContructionOption({ data: values, id: currentItem.constructionOptionId })
        ).unwrap();
        message.success('Option updated');
      } else {
        await dispatch(createConstructionOption(values)).unwrap();
        message.success('Option added');
      }
      setModalVisible(null);
    } catch (error) {
      message.error(error || 'Failed to save option ');
    }
  };

  const confirmDelete = (item: IConstructionOption) => {
    setCurrentItem(item);
    setModalVisible('delete');
  };

  const handleDelete = async () => {
    if (currentItem) {
      try {
        await dispatch(deleteConstructionOption(currentItem.constructionOptionId)).unwrap();
        message.success('Option deleted');
        setModalVisible(null);
      } catch (error) {
        message.error(error || 'Failed to delete option ');
      }
    }
  };

  const columns = [
    {
      title: 'S.No',
      render: (_, __, index: number) => index + 1,
      width: 80,
    },
    {
      title: 'Options',
      dataIndex: 'optionName',
      key: 'optionName',
    },
    {
      title: 'Actions',
      align: 'right' as const,
      render: (_, record: IConstructionOption) => (
        <Space>
          <TooltipButton
            title="Edit"
            type="text"
            icon={<IconEdit size={16} />}
            onClick={() => handleOpenModal(record)}
          />
          <TooltipButton
            title="Delete"
            type="text"
            icon={<IconTrash size={16} color="red" />}
            onClick={() => confirmDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-card-color rounded-xl shadow-sm">
      <div className="flex items-center justify-between  p-2 rounded-t-md mb-2">
        <h3 className="font-semibold text-font-color text-sm sm:text-base">Options</h3>
        <Button type="primary" onClick={() => handleOpenModal()} icon={<IconPlus size={16} />}>
          New
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={constructionOption}
        rowKey="id"
        pagination={false}
        bordered
        className="text-sm"
        loading={status.fetch === Status.PENDING}
      />

      {isModalVisible === 'create' && (
        <ActionDialogmodel
          title={currentItem ? 'Edit Option' : 'Add Option'}
          open={isModalVisible === 'create'}
          onCancel={() => setModalVisible(null)}
          isEditing={!!currentItem}
          initialValues={currentItem}
          onSubmit={handleSave}
          fields={[
            {
              label: 'Option Name',
              name: 'optionName',
              type: 'text',
              rules: [{ required: true, message: 'Please enter option name' }],
            },
          ]}
          loading={status.create === Status.PENDING}
        />
      )}

      {isModalVisible === 'delete' && (
        <ConfirmationModal
          open={isModalVisible === 'delete'}
          onClose={() => setModalVisible(null)}
          onConfirm={handleDelete}
          type="danger"
          message={`Are you sure you want to delete ${currentItem?.optionName}`}
          loading={status.create === Status.PENDING}
        />
      )}
    </div>
  );
};
