import { FormField } from '../common/Models/ActionDialogModel';

export const colorSettingCustomFields = (): FormField[] => {
  return [
    {
      label: 'Section Name',
      name: 'sectionName',
      type: 'select',
      placeholder: 'Select section name',
      options: [
        { label: 'Attachc PDF Beginning', value: 'attach_pdf_beginning' },
        { label: 'Attachc PDF END', value: 'attach_pdf_end' },
      ],
    },
    {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
    },
    {
      label: 'Attachments',
      name: 'attachments',
      type: 'image',
      acceptFileType: '.pdf,.doc,.docx',
      extra: 'Upload documents (PDF/Word, max 5MB)',
    },
  
  ];
};
