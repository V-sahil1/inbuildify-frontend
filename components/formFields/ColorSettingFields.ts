import { FormField } from '../common/Models/ActionDialogModel';

export const colorSettingFields = (): FormField[] => {
  return [
    {
      label: 'Options',
      name: 'options',
      type: 'select',
      options: [
        {
          value: 'Show as a separate Column',
          label: 'Show as a separate Column',
        },
        {
          value: 'Show in existing ‘Items’ Column',
          label: 'Show in existing ‘Items’ Column',
        },
      ],
    },
    {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
    },
    {
      label: 'Width',
      name: 'width',
      type: 'number',
    },
    {
      label: 'Column Name',
      name: 'columnName',
      type: 'text',
    },
  ];
};
