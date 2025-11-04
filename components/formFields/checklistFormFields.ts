import { FormField } from '../common/Models/ActionDialogModel';

export const checklistFormFields: FormField[] = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
  },
  {
    label: 'No of days',
    name: 'noOfDays',
    type: 'number',
  },
  {
    label: 'Required ?',
    name: 'required',
    type: 'checkbox',
    options: [{ label: 'date is required', value: 'dateIsRequired' }],
  },
  {
    label: 'Sort',
    name: 'sort',
    type: 'text',
  },
];
