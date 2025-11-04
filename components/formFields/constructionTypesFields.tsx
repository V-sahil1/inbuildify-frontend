import { useAppSelector } from '@hooks/redux';
import { FormField } from '../common/Models/ActionDialogModel';

export const constructionTypesFields = (): FormField[] => {
  const { dwellingType } = useAppSelector(state => state.types);
  return [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter name',
      rules: [{ required: true, message: 'Please enter a name' }],
    },
    {
      label: 'Level',
      name: 'level',
      type: 'select',
      placeholder: 'Select level',
      options: [
        { value: 'Company Level', label: 'Company Level' },
        { value: 'Builder Level', label: 'Builder Level' },
      ],
      rules: [{ required: true, message: 'Please select a level' }],
    },
    {
      label: 'Dwelling Type',
      name: 'dwellingType',
      type: 'select',
      placeholder: 'Select dwelling type',
      options: dwellingType?.map((item: any) => ({
        value: item?.dwellingTypeId,
        label: item?.name,
      })),
      rules: [{ required: true, message: 'Please select a dwelling type' }],
    },
    {
      label: 'Days to start construction',
      name: 'daysToStart',
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
