import { FormField } from '../common/Models/ActionDialogModel';

export const variationSettingFields = (roleOptions: { label: string; value: string }[]): FormField[] => {
  return [
    {
      label: 'Role',
      name: 'roleId',
      type: 'select',
      options: roleOptions,
      rules: [{ required: true, message: 'Please select a role' }],
    },
    {
      label: 'Amount',
      name: 'amount',
      type: 'number',
      rules: [{ required: true, message: 'Please enter an amount' }],
    },
  ];
};
