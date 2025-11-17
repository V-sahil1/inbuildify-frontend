import { FormField } from '../common/Models/ActionDialogModel';

export const holidayFields = (isEditing: boolean | null): FormField[] => {
  const fields: FormField[] = [
    {
      name: 'state',
      label: 'State/Region',
      type: 'select',
      options: [
        { label: 'VIC', value: 'VIC' },
        { label: 'NSW', value: 'NSW' },
        { label: 'QLD', value: 'QLD' },
        { label: 'WA', value: 'WA' },
        { label: 'SA', value: 'SA' },
        { label: 'TAS', value: 'TAS' },
        { label: 'ACT', value: 'ACT' },
        { label: 'NT', value: 'NT' },
      ],
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
    },
    {
      name: 'description',
      label: 'Holiday Description',
      type: 'textarea',
    },
  ];

  if (isEditing) {
    fields.push({
      name: 'status',
      label: 'Status',
      type: 'checkbox',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
    });
  }

  return fields;
};
