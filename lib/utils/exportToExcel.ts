import * as ExcelJS from 'exceljs';

interface ExportToExcelOptions {
  data: any[];
  fileName: string;
  sheetName?: string;
  columnHeaders?: Record<string, string>;
}

export const exportToExcel = async ({
  data,
  fileName,
  sheetName = 'Sheet1',
  columnHeaders,
}: ExportToExcelOptions) => {
  if (!data || data.length === 0) {
    console.warn('No data provided for Excel export');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Get headers from columnHeaders or use data keys
  const headers = columnHeaders ? Object.values(columnHeaders) : Object.keys(data[0] || {});

  // Add header row with styles
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center' };

  // Add data rows
  data.forEach(item => {
    const rowData = columnHeaders
      ? Object.keys(columnHeaders).map(key => item[key])
      : Object.values(item);
    worksheet.addRow(rowData);
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = Math.min(Math.max(maxLength + 2, 10), 50);
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create blob and download
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
