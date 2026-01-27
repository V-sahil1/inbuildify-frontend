import { FormField } from '../common/Models/ActionDialogModel';

export const holidayFields = (
  isEditing: boolean | null,
  stateOptions: { label: string; value: string }[]
): FormField[] => {
  const fields: FormField[] = [
    {
      name: 'state',
      label: 'State/Region',
      type: 'select',
      options: stateOptions,
      mode: 'tags',
    },
    {
      name: 'holidayStartDate',
      label: 'Start Date',
      type: 'date',
      rules: [
        {
          required: true,
          message: 'Please select a start date',
        },
        () => ({
          validator(_, value) {
            if (!value) return Promise.resolve();

            const today = new Date();

            if (value.isBefore(today, 'day')) {
              return Promise.reject(new Error('Start date must be greater than today'));
            }
            return Promise.resolve();
          },
        }),
      ],
    },
    {
      name: 'holidayEndDate',
      label: 'End Date',
      type: 'date',
      rules: [
        {
          required: true,
          message: 'Please select an end date',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value) return Promise.resolve();

            const startDate = getFieldValue('holidayStartDate');
            if (!startDate) return Promise.resolve();

            if (value.isBefore(startDate, 'day')) {
              return Promise.reject(new Error('End date must be greater than start date'));
            }
            return Promise.resolve();
          },
        }),
      ],
    },
    {
      name: 'holidayDescription',
      label: 'Holiday Description',
      type: 'textarea',
    },
  ];

  if (isEditing) {
    fields.push({
      name: 'status',
      label: 'Status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' },
      ],
    });
  }

  return fields;
};
