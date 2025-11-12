export interface ChecklistItem {
  title: string;
  tags: string[];
  level: 'Company Level' | 'My Home';
}

export const checklistItems: ChecklistItem[] = [
  {
    title: 'Alarm/Intercom rough in applicable',
    tags: ['Single Storey Build', 'Lockup Stage'],
    level: 'Company Level',
  },
  {
    title: 'Appliance install Electrician',
    tags: ['Single Storey Build', 'Completion Stage'],
    level: 'Company Level',
  },
  {
    title: 'Appliance install Plumber',
    tags: ['Single Storey Build', 'Completion Stage'],
    level: 'My Home',
  },
  {
    title: 'Assess land for power, water factors',
    tags: ['Single Storey Build', 'Base Stage'],
    level: 'Company Level',
  },
  {
    title: 'Bobcat remove excess soil',
    tags: ['Single Storey Build', 'Frame Stage'],
    level: 'My Home',
  },
];

export const initialCostCenters = [
  {
    key: '1',
    code: 'MH001',
    name: 'Site Bin Hire',
    description: 'Site Bin Hire',
    sortOrder: 1,
    isActive: false,
    checklist: 0,
  },
  {
    key: '2',
    code: 'MH002',
    name: 'Temp Fence',
    description: 'Temp Fence',
    sortOrder: 2,
    isActive: true,
    checklist: 0,
  },
  {
    key: '3',
    code: 'MH003',
    name: 'Set out',
    description: 'Set out',
    sortOrder: 3,
    isActive: true,
    checklist: 0,
  },
  {
    key: '4',
    code: 'MH004',
    name: 'Scaffold',
    description: 'Scaffold',
    sortOrder: 4,
    isActive: true,
    checklist: 0,
  },
  {
    key: '5',
    code: 'MH005',
    name: 'Temp Toilet',
    description: 'Temp Toilet',
    sortOrder: 5,
    isActive: true,
    checklist: 0,
  },
];
