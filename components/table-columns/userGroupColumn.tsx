import TooltipButton from '../common/TooltipButton';
import { IconPencil } from '@tabler/icons-react';
import { message, Tag } from 'antd';
import { useAppDispatch } from '@hooks/redux';
import { createUserGroup, updateUserGroup } from '@redux/feature/userGroup/userGroupThunk';
import { userGroup } from '@redux/feature/userGroup/IUserGroupState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const userGroupColumn = (setModalOpen, setSelectedGroup, selectedGroup) => {
  const dispatch = useAppDispatch();

  const column = [
    {
      title: 'Group Name',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (_, record) =>
        record.users &&
        record?.users.map(user => (
          <Tag>{user.name}</Tag>
        )),
    },
    {
      render: (_, record) => {
        return (
          <TooltipButton
            title="Edit"
            type="text"
            icon={<IconPencil size={15} />}
            onClick={() => {
              setModalOpen(true);
              setSelectedGroup(record);
            }}
          />
        );
      },
    },
  ];

  function handleSubmit(values: userGroup) {
    try {
      if (selectedGroup) {
        const updatedFields = getUpdatedFields(values, selectedGroup);
        if (Object.keys(updatedFields).length == 0) {
          message.error('No changes made');
          setModalOpen(false);
          setSelectedGroup(null);
          return;
        }
        dispatch(updateUserGroup({ data: updatedFields, id: selectedGroup.userGroupId })).unwrap();
      } else {
        dispatch(createUserGroup(values)).unwrap();
      }
      setModalOpen(false);
      setSelectedGroup(null);
    } catch (error) {
      message.error(error || 'Failed to save user group');
    }
  }
  return { column, userGroupSubmit: handleSubmit };
};
