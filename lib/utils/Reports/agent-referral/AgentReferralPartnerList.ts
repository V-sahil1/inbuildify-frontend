import { exportToExcel } from '@lib/utils/exportToExcel';

export const AgentReferralPartnerList = data => {
  const column = {
    name: { label: 'Name', color: 'FF0023BD' },
    address1: { label: 'Address', color: 'FF0023BD' },
    email: { label: 'email', color: 'FF0023BD' },
    phone: { label: 'Phone', color: 'FF0023BD' },
    loginId: { label: 'LoginId', color: 'FF0023BD' },
    isActive: { label: 'Status', color: 'FF0023BD' },
  };
  exportToExcel({
    data: data.map(d => ({
      ...d,
      isActive: d.isActive ? 'Active' : 'Inactive',
    })),
    fileName: 'Agent-ReferralPartnerList',
    sheetName: 'Agent-ReferralPartnerList',
    columnHeaders: column,
  });
};
