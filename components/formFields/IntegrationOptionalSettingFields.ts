import { useUsersHook } from '@hooks/useUserHook';
import { FormField } from '../common/Models/ActionDialogModel';

export const getIntegrationOptionalSettingFields = (): FormField[] => {
  const { userOptions } = useUsersHook();
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
      options: userOptions || [],
    },
  ];
};
