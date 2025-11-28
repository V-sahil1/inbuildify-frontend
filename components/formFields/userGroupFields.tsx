import { useUsersHook } from '@hooks/useUserData';
import { CustomSelectWithAutoSelectAll } from '../common/CustomSelectwithSelectAll';
import { FormField } from '../common/Models/ActionDialogModel';

export const userGroupField = () => {
  const { users } = useUsersHook();
  const userOptions = users.map(user => ({ label: user.name, value: user.usersId }));
  return [
    { label: 'Group Name', name: 'name', type: 'text' },
    {
      label: 'Select User',
      name: 'users',
      type: 'custom',
      render: <CustomSelectWithAutoSelectAll options={userOptions} onChange={() => {}} />,
    },
    {
      label: 'Status',
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'InActive', value: 'InActive' },
      ],
      initialValue: 'Active',
    },
  ] as FormField[];
};
