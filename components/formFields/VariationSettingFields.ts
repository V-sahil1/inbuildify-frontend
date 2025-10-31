import { FormField } from '../common/Models/ActionDialogModel';

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Project Manager', value: 'Project Manager' },
  { label: 'Site Supervisor', value: 'Site Supervisor' },
  { label: 'Client', value: 'Client' },
];

export const variationSettingFields: FormField[] = [
  {
    label: 'Role',
    name: 'role',
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
