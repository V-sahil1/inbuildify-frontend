import { FormField } from '../common/Models/ActionDialogModel';

export const jobProcessStageFields = (jobProcessFunctionalityOptions: { value: string; label: string }[]): FormField[] => {
  return [
    {
      label: 'Stage Name',
      name: 'name',
      type: 'text',
    },
    {
      label: 'Functionality',
      name: 'functionalityId',
      type: 'select',
      options: jobProcessFunctionalityOptions,
    },
    // {
    //   label: 'Required ?',
    //   name: 'required',
    //   type: 'checkbox',
    //   options: [{ label: 'date is required', value: 'dateIsRequired' }],
    // },
    {
      label: 'Sort',
      name: 'sortOrder',
      type: 'text',
    },
  ];
};
