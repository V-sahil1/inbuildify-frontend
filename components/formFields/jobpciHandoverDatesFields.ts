import { FormField } from '../common/Models/ActionDialogModel';

export const jobPciHandoverDatesFields = (): FormField[] => {
  return [
    {
      label: 'PCI Date',
      name: 'pciDate',
      type: 'date',
      placeholder: 'Select PCI date',
      rules: [{ required: true, message: 'Please select PCI date' }],
    },
    {
      label: 'Occupancy Permit Date',
      name: 'occupancyPermitDate',
      type: 'date',
      placeholder: 'Select occupancy permit date',
      rules: [{ required: true, message: 'Please select occupancy permit date' }],
    },
    {
      label: 'Handover Date',
      name: 'handoverDate',
      type: 'date',
      placeholder: 'Select handover date',
      rules: [{ required: true, message: 'Please select handover date' }],
    },
    {
      label: 'Occupancy Permit Document',
      name: 'occupancyPermitDocument',
      type: 'image',
      rules: [{ required: true, message: 'Please select occupancy permit document' }],
    },
  ];
};
