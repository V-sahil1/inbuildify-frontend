export const comissionData = [
  {
    id: '1',
    name: 'Referral Partner',
    recipient: 'Referral Partner',
    commissionValue: '$15,000.00',
    sort: 1,
    stages: [
      { id: '1a', name: '5% Deposit', commissionValue: '$5,000.00', sort: 1 },
      { id: '1b', name: 'Base Stage', commissionValue: '$5,000.00', sort: 2 },
      { id: '1c', name: 'Lockup Stage', commissionValue: '$5,000.00', sort: 3 },
    ],
  },
  {
    id: '2',
    name: 'Sales Person',
    recipient: 'Sales Person',
    commissionValue: '$20,000.00',
    sort: 2,
    stages: [
      { id: '2a', name: '5% Deposit', commissionValue: '25.00%', sort: 1 },
      { id: '2b', name: 'Base Stage', commissionValue: '25.00%', sort: 2 },
      { id: '2c', name: 'Lockup', commissionValue: '50.00%', sort: 3 },
    ],
  },
];
