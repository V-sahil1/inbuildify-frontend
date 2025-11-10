import { StageItem } from './types';

export const DEFAULT_DATA: StageItem[] = [
  {
    id: 1,
    name: 'Sales',
    dependent: false,
    functionality: 'Sales',
    sort: 1,
    isActive: true,
  },
  {
    id: 2,
    name: 'Preconstruction',
    dependent: false,
    functionality: 'Workflow',
    sort: 2,
    isActive: true,
  },
  {
    id: 3,
    name: 'Color',
    dependent: false,
    functionality: 'Color',
    sort: 3,
    isActive: true,
  },
  {
    id: 4,
    name: 'Construction',
    dependent: false,
    functionality: 'Construction',
    sort: 4,
    isActive: true,
  },
  {
    id: 5,
    name: 'Maintenance',
    dependent: false,
    functionality: 'Maintenance',
    sort: 5,
    isActive: true,
  },
];
