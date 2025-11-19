import { FormField } from '../common/Models/ActionDialogModel';

export const createTemplateFields = (): FormField[] => {
  return [
    {
      label: 'Template Name',
      name: 'template_name',
      type: 'text',
      placeholder: 'Enter template name',
      rules: [{ required: true, message: 'Please enter template name' }],
    },
    {
      label: 'Template Type',
      name: 'template_type',
      type: 'radio',
      options: [
        { value: 'Template', label: 'Template' },
        { value: 'Package', label: 'Package' },
      ],
      placeholder: 'Select template type',
      rules: [{ required: true, message: 'Please select template type' }],
    },
    {
      label: 'Allow to remove items',
      name: 'allow_to_remove_items',
      type: 'switch',
    },
  ];
};
