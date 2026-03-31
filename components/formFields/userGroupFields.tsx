import { useUsersHook } from '@hooks/useUserHook';

import { FormField } from '../common/Models/ActionDialogModel';
import { CustomBulkSelect } from '../common/CustomBulkSelect';

export const useUserGroupField = () => {
  const { userOptions } = useUsersHook();
  return [
    {
      label: 'Group Name',
      name: 'name',
      type: 'text',
      rules: [{ required: true, message: 'Please enter group name' }],
    },
    {
      label: 'Select User',
      name: 'usersId',
      type: 'custom',
      render: <CustomBulkSelect options={userOptions} onChange={() => {}} />,
      rules: [{ required: true, message: 'Please select user' }],
    },
    {
      label: 'Status',
      name: 'isActive',
      type: 'radio',
      options: [
        { label: 'Active', value: true },
        { label: 'InActive', value: false },
      ],
      initialValue: true,
      rules: [{ required: true, message: 'Please select status' }],
    },
  ] as FormField[];
};
