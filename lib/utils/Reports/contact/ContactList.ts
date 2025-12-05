import { exportToCSV } from '@lib/utils/exportToCSV';
import { exportToExcel } from '@lib/utils/exportToExcel';

export const ContactList = (key, data) => {
  const columns = {
    name: { label: 'Name', color: 'FF0023BD' },
    address: { label: 'Address', color: 'FF0023BD' },
    phone: { label: 'Phone', color: 'FF0023BD' },
    email: { label: 'Email', color: 'FF0023BD' },
    active: { label: 'Status', color: 'FF0023BD' },
  };
  key === 'excel'
    ? exportToExcel({
        data,
        fileName: 'ContactList',
        sheetName: 'ContactList',
        columnHeaders: columns,
      })
    : exportToCSV({
        data,
        fileName: 'ContactList',
        sheetName: 'ContactList',
        columnHeaders: columns,
      });
};
