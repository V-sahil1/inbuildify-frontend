import { FormField } from '../common/Models/ActionDialogModel';

export const supplierInfoFields = (): FormField[] => {
  const fields: FormField[] = [
    {
      label: 'Contact Name',
      name: 'contactName',
      type: 'text',
      placeholder: 'Enter contact name',
      rules: [{ required: true, message: 'Please enter contact name' }],
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'Enter email',
      rules: [{ type: 'email', message: 'Please enter a valid email' }],
    },
    {
      label: 'Phone',
      name: 'phone',
      type: 'phone',
      placeholder: 'Enter phone',
    },
    {
      label: 'Type',
      name: 'contactType',
      type: 'text',
      placeholder: 'Enter contact type',
    },
  ];

  return fields;
};
