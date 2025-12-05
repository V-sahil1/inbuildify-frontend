import { exportToCSV } from '@lib/utils/exportToCSV';
import { exportToExcel } from '@lib/utils/exportToExcel';

export const UserList = (key, data) => {
  const exportColumn = {
    name: { label: 'Name', color: 'FF0023BD' },
    address1: { label: 'Address', color: 'FF0023BD' },
    email: { label: 'Email', color: 'FF0023BD' },
    phone: { label: 'Mobile', color: 'FF0023BD' },
    loginId: { label: 'Login Id', color: 'FF0023BD' },
    role: { label: 'Role', color: 'FF0023BD' },
    reportingTo: { label: 'Reporting To', color: 'FF0023BD' },
    status: { label: 'Status', color: 'FF0023BD' },
  };
  key === 'excel'
    ? exportToExcel({
        data,
        fileName: 'UserList',
        sheetName: 'UserList',
        columnHeaders: exportColumn,
      })
    : exportToCSV({
        data,
        fileName: 'UserList',
        sheetName: 'UserList',
        columnHeaders: exportColumn,
      });
};
