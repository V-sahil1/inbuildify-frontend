import { exportToExcel } from '@lib/utils/exportToExcel';

export const SupplierList = (data: any, title: string) => {
  const columns = {
    name: { label: 'Supplier Name', color: 'FF0023BD' },
    description: { label: 'Supplier Description', color: 'FF0023BD' },
    contactName: { label: 'Contact Name', color: 'FF0023BD' },
    email: { label: 'Email', color: 'FF0023BD' },
    phone: { label: 'Primary Phone', color: 'FF0023BD' },
    website: { label: 'Website', color: 'FF0023BD' },
    induction: { label: 'Induction Pack Received', color: 'FF0023BD' },
    workCoverExpiryDate: { label: 'Work Cover Expiry Date', color: 'FF0023BD' },
    plInsuranceExpiryDate: { label: 'PLInsurance Expiry Date', color: 'FF0023BD' },
    tradeLicenseExpiryDate: { label: 'TradeLicense Expiry Date', color: 'FF0023BD' },
    whiteCardExpiryDate: { label: 'WhiteCard Expiry Date', color: 'FF0023BD' },
    forkLiftLicenseExpiryDate: { label: 'Fork-Lift License Expiry Date', color: 'FF0023BD' },
    type: { label: 'Supplier Type Name', color: 'FF0023BD' },
  };
  exportToExcel({
    data: data.map(row => ({
      ...row,
      induction: row.induction ? 'Yes' : 'No',
      type: (row.type || []).join(', '),
    })),
    fileName: 'SupplierList',
    sheetName: 'SupplierList',
    columnHeaders: columns,
    title: title,
  });
};
