'use client';

import { message } from 'antd';
import { FormField } from '../common/Models/ActionDialogModel';
import { useUsersHook } from '@hooks/useUserHook';

export const jobTransferFields = (): FormField[] => {
  const { userOptions, error } = useUsersHook();
  if (error) {
    message.error(error || 'Failed to fetch users');
  }
  return [
    {
      label: 'New Assignee',
      name: 'newAssignee',
      type: 'select',
      placeholder: 'Enter template name',
      rules: [{ required: true, message: 'Please enter template name' }],
      options: userOptions,
    },
    {
      label: 'Transfer the pending tasks and appointments',
      name: 'transferPendingTasksAndAppointments',
      type: 'switch',
    },

    {
      label: 'Transfer the lead/opportunity and quotation',
      name: 'transferLeadOpportunityAndQuotation',
      type: 'switch',
    },
    {
      label: 'Notes',
      name: 'notes',
      type: 'textarea',
    },
  ];
};
