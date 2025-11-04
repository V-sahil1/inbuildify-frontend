import { FormField } from '../common/Models/ActionDialogModel';

export const inspectionChecklistSettingFields = (type: 'checklist' | 'stage'): FormField[] => {
  if (type === 'checklist') {
    return [
      {
        label: 'Description',
        name: 'description',
        type: 'text',
        placeholder: 'Enter description',
        rules: [{ required: true, message: 'Please enter description' }],
      },
      {
        label: 'Options',
        name: 'options',
        type: 'select',
        options: [
          { value: 'bricks', label: 'Bricks' },
          { value: 'hebel', label: 'Hebel' },
          { value: 'concrete', label: 'Concrete' },
        ],
        rules: [{ required: true, message: 'Please enter options' }],
      },
      // this options will be of the table we are rendering it's type stage and by choosing this it will be added under that stage children
      {
        label: 'Section Title',
        name: 'sectionTitle',
        type: 'select',
        options: [
          { value: 'Foundation', label: 'Foundation' },
          { value: 'project', label: 'Project' },
        ],
        rules: [{ required: true, message: 'Please enter section title' }],
      },
      {
        label: 'Sort',
        name: 'sort',
        type: 'number',
        rules: [{ required: true, message: 'Please enter sort' }],
      },
      {
        label: 'Add the insoection into all the existing jobs',
        name: 'addInsoectionIntoAllTheExistingJobs',
        type: 'switch',
      },
    ];
  }
  return [
    {
      label: 'Description',
      name: 'description',
      type: 'text',
      placeholder: 'Enter description',
      rules: [{ required: true, message: 'Please enter description' }],
    },
    {
      label: 'Sort',
      name: 'sort',
      type: 'number',
      rules: [{ required: true, message: 'Please enter sort' }],
    },
    {
      label: 'Add the insoection into all the existing jobs',
      name: 'addInsoectionIntoAllTheExistingJobs',
      type: 'switch',
    },
  ];
};
