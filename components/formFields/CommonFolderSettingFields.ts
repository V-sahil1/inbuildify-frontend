import { FormField } from '../common/Models/ActionDialogModel';

export const commonFolderSettingFields = (type: 'parent' | 'child'): FormField[] => {
  if (type === 'child') {
    return [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
      },
      {
        label: 'Sort order',
        name: 'sortOrder',
        type: 'number',
      },
    ];
  }
  return [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
    },
    {
      label: 'Roles/Users',
      name: 'roles',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
    {
      label: 'Sort order',
      name: 'sortOrder',
      type: 'number',
    },
    {
      label: 'Notify',
      name: 'notify',
      type: 'switch',
    },
    {
      label: 'Share to customer',
      name: 'shareToCustomer',
      type: 'switch',
    },
    {
      label: 'Lock',
      name: 'lock',
      type: 'switch',
    },
  ];
};
