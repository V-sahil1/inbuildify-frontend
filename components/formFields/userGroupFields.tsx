import { useUsersHook } from '@hooks/useUserHook';

import { FormField } from '../common/Models/ActionDialogModel';
import { CustomBulkSelect } from '../common/CustomBulkSelect';

export const userGroupField = () => {
  const { userOptions } = useUsersHook();
  return [
    { label: 'Group Name', name: 'name', type: 'text' },
    {
      label: 'Select User',
      name: 'users',
      type: 'custom',
      render: <CustomBulkSelect options={userOptions} onChange={() => {}} />,
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
