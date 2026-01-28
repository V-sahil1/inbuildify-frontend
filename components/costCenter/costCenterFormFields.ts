export const getCostCenterModalFields = isEditing => [
  {
    label: 'Code',
    name: 'code',
    type: 'text' as const,
    placeholder: 'Enter Code',
    rules: [{ required: true, message: 'Code is required' }],
  },
  {
    label: 'Name',
    name: 'name',
    type: 'text' as const,
    placeholder: 'Enter Name',
    rules: [{ required: true, message: 'Name is required' }],
  },
  {
    label: 'Description',
    name: 'description',
    type: 'textarea' as const,
    placeholder: 'Enter Description',
    rules: [{ required: true, message: 'Description is required' }],
    extra: '500 characters remaining',
  },
  {
    label: 'Sort Order',
    name: 'sortOrder',
    type: 'number' as const,
    placeholder: 'Enter Sort Order',
    rules: [{ required: true, message: 'Sort Order is required' }],
  },
  ...(isEditing
    ? [
        {
          label: 'Status',
          name: 'status',
          type: 'radio' as const,
          options: [
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ],
        },
      ]
    : []),
];
