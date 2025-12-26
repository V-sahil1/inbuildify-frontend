export const leadMandatoryOption = [
  {
    value: 'email_and_phone',
    label: 'Email and Phone are mandatory',
  },
  {
    label: 'Either Email or Phone is mandatory',
    value: 'either_email_or_phone',
  },
  {
    label: 'Email is not mandatory',
    value: 'email_not_mandatory',
  },
  {
    label: 'Phone is not mandatory',
    value: 'phone_not_mandatory',
  },
  {
    label: 'Email and Phone are not mandatory',
    value: 'email_and_phone_not_mandatory',
  },
];

export const salesProcessData = [
  {
    id: 1,
    processId: 1,
    name: 'New',
    functionality: ['Contact', 'Property'],
    category: 'Lead',
    sort: 1,
  },
  {
    id: 2,
    processId: 1,
    name: 'Working',
    functionality: ['Quotation'],
    category: 'Lead',
    sort: 2,
  },
  {
    id: 3,
    processId: 2,
    name: 'Proposal',
    functionality: ['Capture Deposit'],
    category: 'Opportunity',
    sort: 1,
  },
];

export const salesProcessProcessesData = [
  { id: 1, name: 'Sales', isDefault: true },
  { id: 2, name: 'Lead', isDefault: false },
];
