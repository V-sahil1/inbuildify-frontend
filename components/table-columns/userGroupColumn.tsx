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
      render: (_, record) => record.users && record?.users.map(user => <Tag>{user.name}</Tag>),
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

  async function handleSubmit(values: userGroup) {
    try {
      if (selectedGroup) {
        const normalizedOriginal = {
          ...selectedGroup,
          usersId: selectedGroup.users?.map(user => user.id) || [],
        };

        const { isUpdated, updatedFields } = getUpdatedFields(values, normalizedOriginal);
        if (!isUpdated) {
          message.error('No changes made');
          return;
        }

        const isStatusChangeOnly = 'isActive' in updatedFields;
        if (isStatusChangeOnly && Object.keys(updatedFields).length > 1) {
          message.error('Status update must be done without changing other fields.');
          return;
        }

        const payload = isStatusChangeOnly ? { isActive: updatedFields.isActive } : updatedFields;
        await dispatch(updateUserGroup({ data: payload, id: selectedGroup.userGroupId })).unwrap();
        message.success('User group updated successfully');
      } else {
        await dispatch(createUserGroup(values)).unwrap();
        message.success('User group created successfully');
      }
      setModalOpen(false);
      setSelectedGroup(null);
    } catch (error) {
      message.error(error || 'Failed to save user group');
    }
  }
  return { column, userGroupSubmit: handleSubmit };
};
