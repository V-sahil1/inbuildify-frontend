import { FormField } from '../common/Models/ActionDialogModel';

export const colorSettingFields = (): FormField[] => {
  return [
    {
      label: 'Options',
      name: 'options',
      type: 'select',
      options: [
        {
          value: 'dont_show',
          label: 'Dont Show',
        },
        {
          value: 'show_as_separate_column',
          label: 'Show as a separate Column',
        },
        {
          value: 'show_in_existing_items_column',
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
