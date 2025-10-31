export const initialStagePayments = [
  {
    key: '1',
    description: 'Deposit',
    percentage: 5,
    sortOrder: 1,
    isDeposit: true,
  },
  {
    key: '2',
    description: 'Base Stage',
    percentage: 20,
    sortOrder: 2,
  },
  {
    key: '3',
    description: 'Frame Stage',
    percentage: 20,
    sortOrder: 3,
  },
  {
    key: '4',
    description: 'Lockup Stage',
    percentage: 25,
    sortOrder: 4,
  },
  {
    key: '5',
    description: 'Fixing Stage',
    percentage: 20,
    sortOrder: 5,
  },
  {
    key: '6',
    description: 'Completion',
    percentage: 10,
    sortOrder: 6,
  },
];

export const initialInvoiceSettings = {
  showInvoiceSummary: false,
  invoiceTerms: 7,
};
