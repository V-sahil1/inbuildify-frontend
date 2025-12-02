export type MasterItem = {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  sortOrder: number;
};

export type MasterHeading = {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  sortOrder: number;
  items?: MasterItem[];
};

export type MasterGroup = {
  id: number;
  name: string;
  active: boolean;
  headings: MasterHeading[];
};

export const mockMasters: MasterGroup[] = [
  {
    id: 1,
    name: 'MY HOME INCLUSIONS',
    active: true,
    headings: [
      {
        id: 11,
        name: 'Site Costs And Connections',
        active: true,
        sortOrder: 1,
        items: [
          {
            id: 111,
            name: 'Site cost & connection based on land size up to 450m2, and up to 300mm fall overbuilding.',
            active: true,
            sortOrder: 1,
          },
          {
            id: 112,
            name: 'Site cost & connection based on land size up to 450m2, and up to 300mm fall overbuilding.',
            active: true,
            sortOrder: 2,
          },
        ],
      },
      {
        id: 12,
        name: 'External Features',
        active: true,
        sortOrder: 2,
      },
    ],
  },
  {
    id: 2,
    name: 'TERMS AND CONDITIONS',
    active: true,
    headings: [
      {
        id: 21,
        name: 'Terms and Conditions',
        active: true,
        sortOrder: 1,
      },
    ],
  },
];
