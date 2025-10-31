import { FormField } from '../common/Models/ActionDialogModel';

export const jobAddressFields = (): FormField[] => {
  return [
    {
      name: 'lotNo',
      label: 'Lot No',
      type: 'text',

      rules: [{ required: true, message: 'Lot No is required' }],
    },
    {
      name: 'streetNo',
      label: 'street No',
      type: 'text',
      rules: [{ required: true, message: 'Street No is required' }],
    },
    {
      name: 'addressLine1',
      label: 'Address Line 1',
      type: 'text',
      rules: [{ required: true, message: 'Address Line 1 is required' }],
    },
    {
      name: 'addressLine2',
      label: 'Address Line 2',
      type: 'text',
      rules: [{ required: true, message: 'Address Line 2 is required' }],
    },
    {
      name: 'city',
      label: 'City / Suburb',
      type: 'text',
      rules: [{ required: true, message: 'City is required' }],
    },
    {
      name: 'state',
      label: 'State / Region',
      type: 'select',
      rules: [{ required: true, message: 'State is required' }],
    },
    {
      name: 'zipCode',
      label: 'Zip / Postal Code',
      type: 'number',
      rules: [{ required: true, message: 'Zip Code is required' }],
    },
  ];
};
