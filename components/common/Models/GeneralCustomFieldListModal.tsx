import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import {
  createCustomFieldListOption,
  deleteCustomFieldListOption,
  fetchAllCustomField,
} from '@redux/feature/admin/general/customField/customFieldThunk';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';

export const GeneralCustomFieldListModal = ({
  open,
  onCancel,
  id,
}: {
  open: boolean;
  onCancel: () => void;
  id: string;
}) => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const { customField, status } = useAppSelector(state => state.general.customField);

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      try {
        dispatch(fetchAllCustomField()).unwrap();
      } catch (error) {
        message.error(error);
      }
    }
  }, [status.fetch]);

  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Action',
      width: 50,
      render: (_, record) => (
        <Button
          size="small"
          icon={<IconTrash size={15} />}
          onClick={() => handleDelete(record.name)}
        />
      ),
    },
  ];
  const handleAdd = async () => {
    try {
      if (inputValue === '') {
        setError('Please enter list option');
        return;
      }
      await dispatch(
        createCustomFieldListOption({ customFieldId: id, options: [inputValue] })
      ).unwrap();
      message.success('List Option added successfully');
      setInputValue('');
    } catch (error) {
      message.error(error);
    }
  };

  const handleDelete = async (option: string) => {
    try {
      await dispatch(
        deleteCustomFieldListOption({ customFieldId: id, options: [option] })
      ).unwrap();
      message.success('List Option deleted successfully');
    } catch (error) {
      message.error(error);
    }
  };
  const tableData = (customField.find(item => item.customFieldId === id)?.options || []).map(
    (item, index) => ({
      key: index,
      name: item,
    })
  );
  return (
    <Modal open={open} onCancel={onCancel} footer={null}>
      <div className="p-4">
        <div className="flex justify-center items-center gap-2">
          <p>List Options</p>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="max-w-[200px]"
          />
          <Button type="primary" icon={<IconPlus size={16} />} onClick={handleAdd} />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Table columns={column} dataSource={tableData} className="border mt-3" pagination={false} />
      </div>
    </Modal>
  );
};
