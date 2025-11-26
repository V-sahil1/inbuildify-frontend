import { FormField } from '../common/Models/ActionDialogModel';

export const SurveyTemplateFields = (showStatus): FormField[] => {
  const column: FormField[] = [
    { label: 'Name', name: 'template', type: 'text' },
    { label: 'Sort Order', name: 'sort', type: 'number' },
    { label: 'Recommended Template', name: 'recommendTemplate', type: 'switch' },
    showStatus && {
      label: 'Status',
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'InActive', value: 'InActive' },
      ],
    },
  ];
  return column.filter(Boolean);
};

export const TemplateQuestionField: FormField[] = [
  { label: 'Question', name: 'description', type: 'text' },
  {
    label: 'Options',
    name: 'options',
    type: 'select',
    options: [
      { label: 'Text', value: 'Text' },
      { label: 'Radio Button', value: 'Radio Button' },
      { label: 'Star (1 to 5)', value: 'Star (1 to 5)' },
      { label: 'Star (1 to 10)', value: 'Star (1 to 10)' },
    ],
  },
  { label: 'Sort Order', name: 'sort', type: 'number' },
];
