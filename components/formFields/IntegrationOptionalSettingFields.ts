import { useUsersHook } from '@hooks/useUserData';
import { FormField } from '../common/Models/ActionDialogModel';

export const getIntegrationOptionalSettingFields = (): FormField[] => {
  const { users } = useUsersHook();
  return [
    {
      label: 'Field Name',
      name: 'fieldName',
      type: 'text',
    },
    {
      label: 'Name',
      name: 'name',
      type: 'text',
    },
    {
      label: 'Assignee',
      name: 'assignee',
      type: 'select',
      options: users?.map(user => ({ label: user.name, value: user.usersId })) || [],
    },
  ];
};
