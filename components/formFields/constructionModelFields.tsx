import { useState } from 'react';
import { FormField } from '../common/Models/ActionDialogModel';
import { useUsersHook } from '@hooks/useUserData';

const ConstructionModelFields = (): FormField[] => {
  const [mailOpen, setMailOpen] = useState(false);
  const { users } = useUsersHook()
  const userOptions = users.map((user) => ({ label: user.name, value: user.usersId }))
  const fields: (FormField | false)[] = [
    {
      label: 'Construction Type',
      name: 'constructionType',
      type: 'select',
      mode: 'tags',
      options: [
        { label: 'abc', value: 'abc' },
        { label: 'xyz', value: 'xyz' },
      ],
    },
    {
      label: 'Site Supervisor',
      name: 'supervisor',
      type: 'select',
      mode: 'tags',
      options: [
        { label: 'abc', value: 'abc' },
        { label: 'xyz', value: 'xyz' },
      ],
    },
    {
      label: 'Construction Options',
      name: 'constructionOptions',
      type: 'select',
      mode: 'tags',
      options: [
        { label: 'abc', value: 'abc' },
        { label: 'xyz', value: 'xyz' },
      ],
    },
    {
      label: 'Send Mail',
      name: 'mail',
      type: 'switch',
      onClick: () => setMailOpen(!mailOpen),
    },
    mailOpen && {
      label: 'To',
      name: 'sentTo',
      type: 'select',
      mode: 'tags',
      options: userOptions,
    },
    mailOpen && { label: 'Subject', name: 'subject', type: 'text' },
    mailOpen && { label: 'Message', name: 'message', type: 'texteditor' },
    mailOpen && { label: 'Attach Files', name: 'attachment', type: 'image' },
  ];

  return fields.filter(Boolean) as FormField[];
};

export default ConstructionModelFields;
