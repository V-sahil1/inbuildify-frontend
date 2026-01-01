import { FormField } from '../common/Models/ActionDialogModel';

export const InvoiceSettingFields: FormField[] = [
  {
    label: 'Description',
    name: 'description',
    placeholder: 'Ex. Deposit',
    type: 'text',
  },
  {
    label: 'Percentage',
    name: 'percentage',
    placeholder: '10',
    type: 'number',
    rules: [
      {
        min: 0,
        max: 100,
        message: 'Percentage must be between 0 and 100',
      },
    ],
  },
  {
    label: 'Sort Order',
    name: 'sortOrder',
    placeholder: '12',
    type: 'number',
  },
  // {
  //   label: 'Is Deposit',
  //   name: 'isDeposit',
  //   type: 'switch',
  // },
];
