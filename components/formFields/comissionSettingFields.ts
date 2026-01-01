import { FormField } from '../common/Models/ActionDialogModel';

export const getParentFields = (): FormField[] => [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    placeholder: 'e.g., Referral Partner',
    rules: [{ required: true, message: 'Please enter a name' }],
  },
  {
    label: 'Recipient',
    name: 'recipient',
    type: 'select',
    options: [
      { label: 'Sales Person', value: 'sales_person' },
      { label: 'Reporting To', value: 'reporting_to' },
      { label: 'Referral Partner', value: 'referral_partner' },
      { label: 'Customer', value: 'customer' },
      { label: 'Other User', value: 'other_user' },
    ],
    placeholder: 'e.g., Sales Person',
    rules: [{ required: true, message: 'Please enter a recipient' }],
  },
  {
    label: 'Commission Unit',
    name: 'commissionUnit',
    type: 'radio',
    options: [
      { label: 'Percentage', value: 'percentage' },
      { label: 'Amount', value: 'amount' },
    ],
    rules: [{ required: true, message: 'Please enter a commission value' }],
  },
  {
    label: 'Commission Value',
    name: 'commissionValue',
    type: 'text',
    placeholder: '$10,000 or 10%',
    rules: [{ required: true, message: 'Please enter a commission value' }],
  },
  {
    label: 'Sort',
    name: 'sortOrder',
    type: 'number',
    rules: [{ required: true, message: 'Please enter a sort order' }],
  },
];

export const getChildFields = (): FormField[] => [
  {
    label: 'Stage Name',
    name: 'name',
    type: 'text',
    placeholder: 'e.g., 5% Deposit',
    rules: [{ required: true, message: 'Please enter a stage name' }],
  },
  {
    label: 'Commission Unit',
    name: 'commissionUnit',
    type: 'radio',
    options: [
      { label: 'Percentage', value: 'percentage' },
      { label: 'Amount', value: 'amount' },
    ],
    rules: [{ required: true, message: 'Please enter a commission value' }],
  },
  {
    label: 'Commission Value',
    name: 'commissionValue',
    type: 'text',
    placeholder: '$5,000 or 25%',
    rules: [{ required: true, message: 'Please enter a commission value' }],
  },
  {
    label: 'Sort',
    name: 'sortOrder',
    type: 'number',
    rules: [{ required: true, message: 'Please enter a sort order' }],
  },
];

export const getIncomingFields = (): FormField[] => [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    placeholder: 'e.g., Distributor',
    rules: [{ required: true, message: 'Please enter a name' }],
  },
  {
    label: 'Commission Type',
    name: 'commissionUnit',
    type: 'radio',
    options: [
      { label: 'Percentage', value: 'percentage' },
      { label: 'Amount', value: 'amount' },
    ],
    rules: [{ required: true, message: 'Please enter a commission value' }],
  },
  {
    label: 'Commission Value',
    name: 'commissionValue',
    type: 'text',
    placeholder: '$5,000 or 10%',
    rules: [{ required: true, message: 'Please enter a commission value' }],
  },
  {
    label: 'Sort',
    name: 'sortOrder',
    type: 'number',
    rules: [{ required: true, message: 'Please enter a sort order' }],
  },
];
