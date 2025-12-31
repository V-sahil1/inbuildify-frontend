export const configurationSettingsOptions = [
  { value: 'document_id', label: 'Document ID' },
  { value: 'job_id', label: 'Job ID' },
  { value: 'document_id_and_job_id', label: 'Document ID and Job ID' },
  { value: 'hide_document_id_and_job_id', label: "Don't show Document ID and Job ID" },
];

export const fieldTypeOptions = [
  { label: 'Number', value: 'number' },
  { label: 'Text', value: 'text' },
  { label: 'Date', value: 'date' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'List', value: 'list' },
  { label: 'Multiline Text', value: 'multiline' },
];

export const customFieldsData = {
  lead: [
    {
      id: 1,
      name: 'Budget (Build)',
      fieldType: 'number',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 2,
      name: 'Budget (H&L)',
      fieldType: 'number',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 3,
      name: 'Region',
      fieldType: 'list',
      sortOrder: 3,
      isActive: false,
    },
    {
      id: 4,
      name: 'Client Profile',
      fieldType: 'multiline',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 5,
      name: 'Prelim Agreement Signed',
      fieldType: 'date',
      sortOrder: 5,
      isActive: true,
    },
  ],
  client: [],
  project: [],
};

export const notesTagData = {
  lead: [
    { id: 1, name: 'Hot Lead', backgroundColor: '#F87171', fontColor: '#FFFFFF' },
    { id: 2, name: 'Warm Lead', backgroundColor: '#FACC15', fontColor: '#000000' },
  ],
  client: [
    { id: 1, name: 'Premium', backgroundColor: '#22C55E', fontColor: '#FFFFFF' },
    { id: 2, name: 'Standard', backgroundColor: '#60A5FA', fontColor: '#FFFFFF' },
  ],
  project: [
    { id: 1, name: 'In Progress', backgroundColor: '#A855F7', fontColor: '#FFFFFF' },
    { id: 2, name: 'Completed', backgroundColor: '#10B981', fontColor: '#FFFFFF' },
  ],
};

export const checklistScreenOptions = [
  { value: 'Color', label: 'Color' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Job', label: 'Job' },
  { value: 'Lead', label: 'Lead' },
  { value: 'Quotation', label: 'Quotation' },
  { value: 'Workflow', label: 'Workflow' },
];

export const checklistFunctionalityOptions = [
  { value: 'When Stage Started', label: 'When Stage Started' },
  { value: 'When Job Created', label: 'When Job Created' },
  { value: 'When Lead Close Won', label: 'When Lead Close Won' },
  { value: 'When Color Approved', label: 'When Color Approved' },
];