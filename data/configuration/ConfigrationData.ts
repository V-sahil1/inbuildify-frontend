export const configurationSettingsOptions = [
  { value: 'doc_id', label: 'Document ID' },
  { value: 'job_id', label: 'Job ID' },
  { value: 'doc_id_job_id', label: 'Document ID and Job ID' },
  { value: 'none', label: "Don't show Document ID and Job ID" },
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

export const checklistData = [
  {
    id: 1,
    name: 'Final',
    screen: 'Construction',
    functionality: 'When Stage Started',
  },
  {
    id: 2,
    name: 'Fixing',
    screen: 'Construction',
    functionality: 'When Stage Started',
  },
  {
    id: 3,
    name: 'Lockup',
    screen: 'Construction',
    functionality: 'When Stage Started',
  },
  {
    id: 4,
    name: 'Frame',
    screen: 'Construction',
    functionality: 'When Stage Started',
  },
  {
    id: 5,
    name: 'Slab',
    screen: 'Construction',
    functionality: 'When Stage Started',
  },
  {
    id: 6,
    name: 'DA Checklist',
    screen: 'Job',
    functionality: 'When Job Created',
  },
  {
    id: 7,
    name: 'Lead Checklist 1',
    screen: 'Lead',
    functionality: 'When Lead Close Won',
  },
];
export const checklistDrawerData = (record: any) => [
  {
    key: '1',
    sno: 1,
    description: `${record.name} - Task 1`,
    notes: false,
    required: true,
    type: 'Checkbox',
    sort: 1,
  },
  {
    key: '2',
    sno: 2,
    description: `${record.name} - Task 2`,
    notes: true,
    required: false,
    type: 'Text',
    sort: 2,
  },
];

export interface RoleMapping {
  id: number | string;
  type: string;
  role: string;
  user: string;
  isNew?: boolean;
}

export const rolesOfRoleMapping = [
  'Admin Executive',
  'Construction Manager',
  'Draft Person',
  'MH - Company Admin',
  'Sales Manager',
  'Sales Manager - MH',
  'Site Supervisor',
];
export const typeOptionsOfRoleMapping = [
  { label: '--', value: '--' },
  { label: 'Sales Executive', value: 'Sales Executive' },
  { label: 'Builder', value: 'Builder' },
  { label: 'Construction Manager', value: 'Construction Manager' },
  { label: 'Contract Admin', value: 'Contract Admin' },
];

export const RoleAndMappingData: RoleMapping[] = [
  { id: 1, type: '--', role: 'Admin Executive', user: 'Ravi Kumar' },
  { id: 2, type: '--', role: 'Accounts', user: 'Anita Sharma' },
  { id: 3, type: '--', role: 'Color Consultant', user: 'Murthy Muthuswamy' },
  { id: 4, type: '--', role: 'My Home Admin', user: 'Anita Sharma' },
  {
    id: 5,
    type: '--',
    role: 'My Home - Company Admin',
    user: 'Murthy Muthuswamy',
  },
  { id: 6, type: '--', role: 'Construction Manager - MH', user: 'Ravi Kumar' },
  {
    id: 7,
    type: 'Sales Executive',
    role: 'Sales Executive',
    user: 'Anita Sharma',
  },
  { id: 8, type: 'Builder', role: 'Builder', user: 'Murthy Muthuswamy' },
  {
    id: 9,
    type: 'Construction Manager',
    role: 'Company Administrator',
    user: 'Murthy Muthuswamy',
  },
  {
    id: 10,
    type: 'Contract Admin',
    role: 'Contract Admin',
    user: 'Murthy Muthuswamy',
  },
];
