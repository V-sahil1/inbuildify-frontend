import { FormField } from '../common/Models/ActionDialogModel';

export const delayExtensionNoticeFields = (): FormField[] => {
  return [
    {
      label: 'Reason',
      name: 'reason',
      type: 'text',
      placeholder: 'Enter reason',
      rules: [{ required: true, message: 'Please enter reason' }],
    },
    {
      label: 'No of days',
      name: 'noOfDays',
      type: 'number',
      placeholder: 'Enter days',
      rules: [{ required: true, message: 'Please enter reason' }],
    },
    {
      label: 'From',
      name: 'from',
      type: 'date',
      placeholder: 'Enter from date',
      rules: [{ required: true, message: 'Please enter from date' }],
    },
    {
      label: 'To',
      name: 'to',
      type: 'date',
      placeholder: 'Enter to date',
      rules: [{ required: true, message: 'Please enter to date' }],
    },
    {
      label: 'Send mail',
      type: 'switch',
      name: 'sendMail',
    },
  ];
};
