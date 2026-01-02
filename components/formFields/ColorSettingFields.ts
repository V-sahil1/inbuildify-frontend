import { FormField } from '../common/Models/ActionDialogModel';

export const colorSettingFields = (
  displayOption: string,
  onChange?: (value: string) => void
): FormField[] => {
  return [
    {
      label: 'Options',
      name: 'displayOption',
      type: 'dynamic-select',
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
          label: "Show in existing 'Items' Column",
        },
      ],
      onChange: onChange,
    },
    displayOption !== 'show_in_existing_items_column' && {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
    },
    displayOption !== 'show_in_existing_items_column' && {
      label: 'Width',
      name: 'width',
      type: 'number',
    },
    {
      label: 'Column Name',
      name: 'columnName',
      type: 'text',
    },
  ].filter(Boolean) as FormField[];
};
