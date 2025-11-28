import { useUsersHook } from '@hooks/useUserData';
import TooltipButton from '../common/TooltipButtton';
import { IconPencil } from '@tabler/icons-react';
import { Tag } from 'antd';
import { useState } from 'react';

export const userGroupColumn = (setModalOpen, setSelectedGroup, selectedGroup) => {
  const { users } = useUsersHook();
  const [userGroupData, setUserGroupData] = useState([]);
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
        record?.users.map(user => <Tag>{users.filter(i => i.usersId === user)[0].name}</Tag>),
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

  function handleSubmit(values) {
    selectedGroup
      ? setUserGroupData(prev =>
          prev.map(i => (i.id === selectedGroup.id ? { ...i, ...values } : i))
        )
      : setUserGroupData(prev => [
          ...prev,
          { ...values, id: Math.floor(Math.random() * 100000).toString() },
        ]);
    setModalOpen(false);
    setSelectedGroup(null);
  }
  return { column, userGroupData, userGroupSubmit: handleSubmit };
};
