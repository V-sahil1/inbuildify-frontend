import { FormField } from '../common/Models/ActionDialogModel';

export const inspectionChecklistSettingFields = (
  type: 'checklist' | 'section' | 'deleteChecklist' | 'deleteSection',
  sectionOptions,
  options,
  onExistingJob,
  setExistingJob
): FormField[] => {
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
        name: 'constructionOptionId',
        type: 'select',
        options: options,
        rules: [{ required: true, message: 'Please enter options' }],
      },
      {
        label: 'Section Title',
        name: 'sectionId',
        type: 'select',
        options: sectionOptions,
        rules: [{ required: true, message: 'Please enter section title' }],
      },
      {
        label: 'Sort',
        name: 'sortOrder',
        type: 'number',
        rules: [{ required: true, message: 'Please enter sort' }],
      },
      {
        label: 'Add the insoection into all the existing jobs',
        name: 'addAllExistingJobs',
        type: 'switch',
        initialValue: onExistingJob?.checklist || null,
        onChange: value => {
          setExistingJob(prev => ({ ...prev, checklist: value }));
        },
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
      name: 'sortOrder',
      type: 'number',
      rules: [{ required: true, message: 'Please enter sort' }],
    },
    {
      label: 'Add the insoection into all the existing jobs',
      name: 'addAllExistingJobs',
      type: 'switch',
      initialValue: onExistingJob.section,
      onChange: value => {
        setExistingJob(prev => ({ ...prev, section: value }));
      },
    },
  ];
};
