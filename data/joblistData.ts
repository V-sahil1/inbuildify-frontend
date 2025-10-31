export interface JobDataType {
  key: string;
  slugId: string;
  refrenceId: string;
  customerName: string;
  jobAddress: string;
  estateName: string;
  created: string;
  titled: string;
  status: 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled' | 'Archived';
  consultant: {
    name: string;
  };
}

export const jobDummyData: JobDataType[] = [
  {
    key: '1',
    slugId: 'FKENSKN21',
    refrenceId: 'REF-001',
    customerName: 'PowerTech Ltd',
    jobAddress: '123 Main St, Sydney',
    estateName: 'Tech Park',
    created: '2023-10-01',
    titled: 'Office Renovation',
    status: 'In Progress',
    consultant: {
      name: 'John Smith',
    },
  },
  {
    key: '2',
    slugId: 'FKENSKN22',
    refrenceId: 'REF-002',
    customerName: 'GreenBuild Co',
    jobAddress: '456 Oak Ave, Melbourne',
    estateName: 'Green Valley',
    created: '2023-09-15',
    titled: 'Residential Construction',
    status: 'Completed',
    consultant: {
      name: 'Sarah Johnson',
    },
  },
  {
    key: '3',
    slugId: 'FKENSKN23',
    refrenceId: 'REF-003',
    customerName: 'Urban Design',
    jobAddress: '789 Pine Rd, Brisbane',
    estateName: 'City Center',
    created: '2023-10-05',
    titled: 'Retail Fitout',
    status: 'On Hold',
    consultant: {
      name: 'Mike Brown',
    },
  },
  {
    key: '4',
    slugId: 'FKENSKN24',
    refrenceId: 'REF-004',
    customerName: 'Skyline Constructions',
    jobAddress: '321 Hill St, Perth',
    estateName: 'Ocean View',
    created: '2023-09-20',
    titled: 'High-rise Development',
    status: 'In Progress',
    consultant: {
      name: 'Emma Wilson',
    },
  },
  {
    key: '5',
    slugId: 'FKENSKN25',
    refrenceId: 'REF-005',
    customerName: 'Heritage Builders',
    jobAddress: '654 Heritage Ln, Adelaide',
    estateName: 'Historic District',
    created: '2023-08-10',
    titled: 'Heritage Restoration',
    status: 'Archived',
    consultant: {
      name: 'David Lee',
    },
  },
  {
    key: '6',
    slugId: 'FKENSKN26',
    refrenceId: 'REF-006',
    customerName: 'Modern Spaces',
    jobAddress: '987 Design St, Sydney',
    estateName: 'Innovation Hub',
    created: '2023-10-02',
    titled: 'Office Interior',
    status: 'In Progress',
    consultant: {
      name: 'Lisa Chen',
    },
  },
  {
    key: '7',
    slugId: 'FKENSKN27',
    refrenceId: 'REF-007',
    customerName: 'Eco Builders',
    jobAddress: '159 Green Ave, Melbourne',
    estateName: 'Eco Village',
    created: '2023-09-25',
    titled: 'Sustainable Home',
    status: 'Completed',
    consultant: {
      name: 'James Wilson',
    },
  },
  {
    key: '8',
    slugId: 'FKENSKN28',
    refrenceId: 'REF-008',
    customerName: 'City Developers',
    jobAddress: '753 Metro Rd, Brisbane',
    estateName: 'Urban Living',
    created: '2023-10-08',
    titled: 'Apartment Complex',
    status: 'On Hold',
    consultant: {
      name: 'Olivia Martin',
    },
  },
  {
    key: '9',
    slugId: 'FKENSKN29',
    refrenceId: 'REF-009',
    customerName: 'Summit Constructions',
    jobAddress: '246Peak Dr, Perth',
    estateName: 'Mountain View',
    created: '2023-09-10',
    titled: 'Luxury Residence',
    status: 'Cancelled',
    consultant: {
      name: 'Robert Taylor',
    },
  },
  {
    key: '10',
    slugId: 'FKENSKN30',
    refrenceId: 'REF-010',
    customerName: 'Coastal Builders',
    jobAddress: '864 Beach Rd, Adelaide',
    estateName: 'Ocean Breeze',
    created: '2023-08-15',
    titled: 'Beach House',
    status: 'Archived',
    consultant: {
      name: 'Sophia Garcia',
    },
  },
];
