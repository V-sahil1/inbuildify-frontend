import { FormField } from '../common/Models/ActionDialogModel';
import { CustomBulkSelect } from '../common/CustomBulkSelect';

export const commonFolderSettingFields = (
  type: 'parent' | 'child',
  roleOptions: { label: string; value: string }[],
  userOptions: { label: string; value: string }[]
): FormField[] => {
  const baseFields: FormField[] = [
    {
      label: 'Name',
      name: 'name',
      type: 'text' as const,
      rules:[{required:true,message:'Please Enter Name'}]
    },
    {
      label: 'Sort order',
      name: 'sortOrder',
      type: 'number' as const,
    },
  ];

  if (type === 'child') {
    return baseFields;
  }

  const parentFields: FormField[] = [
    ...baseFields,
    {
      label: 'Roles',
      name: 'roleIds',
      type: 'custom' as const,
      render: <CustomBulkSelect options={roleOptions} onChange={() => {}} />,
    },
    {
      label: 'Users',
      name: 'userIds',
      type: 'custom' as const,
      render: <CustomBulkSelect options={userOptions} onChange={() => {}} />,
    },
    {
      label: 'Notify',
      name: 'notify',
      type: 'switch' as const,
    },
    {
      label: 'Share to customer',
      name: 'shareToCustomer',
      type: 'switch' as const,
    },
    {
      label: 'Lock',
      name: 'isLocked',
      type: 'switch' as const,
    },
  ];

  return parentFields;
};
