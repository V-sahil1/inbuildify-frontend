import { FormField } from '../common/Models/ActionDialogModel';

export const checklistFormFields = (dataRequired, setDataRequired) => {
  return [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      rules: [{required: true, message: 'Please Enter Name'}]
    },
    {
      label: 'No of days',
      name: 'noOfDays',
      type: 'number',
    },
    {
      label: 'Data Required',
      name: 'dataRequired',
      type: 'checkbox',
      initialValue: dataRequired,
      onChange: value => setDataRequired(value),
    },
    {
      label: 'Sort',
      name: 'sortOrder',
      type: 'number',
    },
  ] as FormField[];
};
