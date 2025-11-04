import { RowData } from '@/components/configurations/components/construction/InspectionChecklist';

export const inspectionChecklistData: RowData[] = [
  { key: '1', description: 'Bored piers depth', sort: 1, type: 'stage' },
  { key: '2', description: 'Edge beam founding depth', sort: 2, type: 'stage' },
  {
    key: '3',
    description: 'Site Condition',
    sort: 3,
    type: 'stage',
    children: [
      {
        key: '3-1',
        description: "Builder's sign or survey pegs / site identification",
        sort: 1,
        type: 'checklist',
      },
      { key: '3-2', description: 'Orientation to road', sort: 2, type: 'stage' },
      { key: '3-3', description: 'Site Gradient', sort: 3, type: 'stage' },
      { key: '3-4', description: 'Site Cut & Fill', sort: 4, type: 'stage' },
      {
        key: '3-5',
        description: 'Weather conditions: Raining/After rain/Dry',
        sort: 5,
        type: 'stage',
      },
      { key: '3-6', description: 'Surface drainage', sort: 6, type: 'stage' },
      { key: '3-7', description: 'Subsidence & Seepage', sort: 7, type: 'stage' },
    ],
  },
];
