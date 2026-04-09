import { createSortOrderValidation } from '@lib/constants/formInputValidations';
import { FormField } from '../common/Models/ActionDialogModel';

export const jobProcessStageFields = (
  jobProcessFunctionalityOptions: { value: string; label: string }[],
  length?: number,
  isEditing?: boolean
): FormField[] => {
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
    //   options: [{ label: 'date is required', value: 'dateIsRequi red' }],
    // },
    {
      label: 'Sort',
      name: 'sortOrder',
      type: 'number',
      rules: createSortOrderValidation(length, isEditing),
    },
  ];
};
