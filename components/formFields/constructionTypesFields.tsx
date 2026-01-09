import { FormField } from '../common/Models/ActionDialogModel';
import { CustomBulkSelect } from '../common/CustomBulkSelect';

export const constructionTypesFields = (
  dwellingTypeOptions: { label: string; value: string }[] = []
): FormField[] => {
  return [
    {
      label: 'Name',
      name: 'typesName',
      type: 'text',
      placeholder: 'Enter name',
      rules: [{ required: true, message: 'Please enter a name' }],
    },
    {
      label: 'Dwelling Type',
      name: 'dwellingType',
      type: 'custom',
      placeholder: 'Select dwelling type',
      render: <CustomBulkSelect options={dwellingTypeOptions} onChange={() => {}} />,
      rules: [{ required: true, message: 'Please select a dwelling type' }],
    },
    {
      label: 'Days to start construction',
      name: 'startConstructionDays',
      type: 'number',
      placeholder: 'Enter number of days',
      rules: [{ required: true, message: 'Please enter days' }],
    },
    {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
      placeholder: 'Enter sort order',
      rules: [{ required: true, message: 'Please enter sort order' }],
    },
  ];
};
