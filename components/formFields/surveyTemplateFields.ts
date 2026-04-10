import { FormField } from '../common/Models/ActionDialogModel';

export const SurveyTemplateFields = (showStatus, setIsRecommended, isRecommended): FormField[] => {
  const column: FormField[] = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Sort Order', name: 'sortOrder', type: 'number', min: 1 },
    {
      label: 'Recommended Template',
      name: 'isRecommended',
      type: 'switch',
      initialValue: isRecommended,
      onChange: value => setIsRecommended(value),
    },
    showStatus && {
      label: 'Status',
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'InActive', value: 'inactive' },
      ],
    },
  ];
  return column.filter(Boolean);
};

export const TemplateQuestionField: FormField[] = [
  { label: 'Question', name: 'description', type: 'text' },
  {
    label: 'Options',
    name: 'optionType',
    type: 'select',
    options: [
      { label: 'Text', value: 'text' },
      { label: 'Radio Button', value: 'radio' },
      { label: 'Star (1 to 5)', value: 'star_1_to_5' },
      { label: 'Star (1 to 10)', value: 'star_1_to_10' },
    ],
  },
  { label: 'Sort Order', name: 'sortOrder', type: 'number' },
];
