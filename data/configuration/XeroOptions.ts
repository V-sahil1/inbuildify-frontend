export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  FAILED: 'failed',
  DISCONNECTED: 'disconnected',
};

export const INVOICE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'authorised', label: 'Authorised' },
];

export const INITIAL_SETTINGS = {
  incomeAccount: '200',
  defaultInvoiceStatus: 'draft',
  trackingCategory: 'Website Leads',
};
