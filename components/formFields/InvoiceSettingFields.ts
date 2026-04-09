import { createSortOrderValidation } from '@lib/constants/formInputValidations';
import { FormField } from '../common/Models/ActionDialogModel';

export const InvoiceSettingFields = (length, isEditing) =>
  [
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
      type: 'number',
      rules: createSortOrderValidation(length, isEditing),
    },
    // {
    //   label: 'Is Deposit',
    //   name: 'isDeposit',
    //   type: 'switch',
    // },
  ] as FormField[];
