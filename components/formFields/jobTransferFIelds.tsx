'use client';

import { message } from 'antd';
import { FormField } from '../common/Models/ActionDialogModel';
import { useUsersHook } from '@hooks/useUserData';

export const jobTransferFields = (): FormField[] => {
  const { users, isLoading, isError } = useUsersHook();
  if (isError) {
    message.error(isError || 'Failed to fetch users');
  }
  return [
    {
      label: 'New Assignee',
      name: 'newAssignee',
      type: 'select',
      placeholder: 'Enter template name',
      rules: [{ required: true, message: 'Please enter template name' }],
      options: users?.map(user => ({
        label: user.name,
        value: user.usersId,
      })),
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
