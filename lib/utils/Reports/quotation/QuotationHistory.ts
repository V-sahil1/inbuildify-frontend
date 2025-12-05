import { exportToExcel } from '@lib/utils/exportToExcel';

export const QuotationHistory = (data, fileName) => {
  const column = {
    referenceNo: { label: 'Reference No', color: 'FF0023BD' },
    customerName: { label: 'Customer Name', color: 'FF0023BD' },
    propertyAddress: { label: 'Property Address', color: 'FF0023BD' },
    quotationStatus: { label: 'Quotation Status', color: 'FF0023BD' },
    leadStatus: { label: 'Lead Status', color: 'FF0023BD' },
  };
  exportToExcel({
    data,
    fileName: fileName,
    sheetName: fileName,
    columnHeaders: column,
  });
};
