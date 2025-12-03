import * as ExcelJS from 'exceljs';

type ExcelColumn =
  | string
  | {
    label: string;
    color?: string;
    dataColor?: string;
    dataColorFn?: (value: any, row: any) => string | undefined;
    children?: {
      key: string;
      label: string;
      color?: string;
      dataColor?: string;
      dataColorFn?: (value: any, row: any) => string | undefined;
    }[];
  };

interface ExportToExcelOptions {
  data: any[];
  fileName: string;
  sheetName?: string;
  columnHeaders: Record<string, ExcelColumn>;
  title?: string;
}

export const exportToExcel = async ({
  data,
  fileName,
  sheetName = 'Sheet1',
  columnHeaders,
  title,
}: ExportToExcelOptions) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  if (title) {
    const titleRow = sheet.addRow([title]);
    titleRow.font = { size: 18, bold: true };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };

    const colCount = Object.keys(columnHeaders).length;
    sheet.mergeCells(1, 1, 1, colCount);

    sheet.addRow([]);
  }

  const parentRow = sheet.addRow([]);
  const childRow = sheet.addRow([]);

  const flatKeys: string[] = [];
  let colIndex = 1;

  Object.entries(columnHeaders).forEach(([key, config]) => {
    const isString = typeof config === 'string';
    const isMulti = !isString && config.children && config.children.length > 0;

    // 🔹 CASE 1: Simple string → direct column
    if (isString) {
      const cell = parentRow.getCell(colIndex);
      cell.value = config;
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };

      flatKeys.push(key);
      colIndex++;
      return;
    }

    // 🔹 CASE 2: Single-level styled column
    if (!isMulti) {
      const cell = parentRow.getCell(colIndex);
      cell.value = config.label;
      cell.font = { bold: true, color: config.color ? { argb: 'FFFFFFFF' } : undefined };
      cell.alignment = { horizontal: 'center' };

      if (config.color) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: config.color } };
      }

      flatKeys.push(key);
      colIndex++;
      return;
    }

    // CASE 3 — Parent + children multi-header
    const span = config.children!.length;
    sheet.mergeCells(parentRow.number, colIndex, parentRow.number, colIndex + span - 1);

    const parentCell = parentRow.getCell(colIndex);
    parentCell.value = config.label;
    parentCell.font = { bold: true, color: config.color ? { argb: 'FFFFFFFF' } : undefined };
    parentCell.alignment = { horizontal: 'center', vertical: 'middle' };

    if (config.color) {
      parentCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: config.color } };
    }

    config.children!.forEach(child => {
      const c = childRow.getCell(colIndex);
      c.value = child.label;
      c.font = { bold: true, color: child.color ? { argb: 'FFFFFFFF' } : undefined };
      c.alignment = { horizontal: 'center' };

      if (child.color) {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: child.color } };
      }

      flatKeys.push(child.key);
      colIndex++;
    });
  });

  // Add Data Rows
  data.forEach(rowObj => {
    const row = sheet.addRow(
      flatKeys.map(k => {
        const raw = rowObj[k];

        // CASE 1: Array → multiline cell
        if (Array.isArray(raw)) {
          return raw.join('\n');
        }

        // CASE 2: String → unchanged
        if (typeof raw === 'string') {
          return raw;
        }

        // CASE 3: Numbers / booleans / null
        return raw ?? '';
      })
    );

    row.eachCell((cell, i) => {
      const key = flatKeys[i - 1];
      const value = rowObj[key];

      const isEmpty =
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);

      // Skip coloring if empty
      if (isEmpty) return;

      for (const [colKey, config] of Object.entries(columnHeaders)) {
        if (typeof config === 'string') continue;

        // CHILDREN CASE
        if (config.children) {
          const child = config.children.find(c => c.key === key);
          if (!child) continue;

          // DYNAMIC DATA COLOR
          if (child.dataColorFn) {
            const dynamic = child.dataColorFn(value, rowObj);
            if (dynamic) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: dynamic } };
              cell.font = { color: { argb: 'FFFFFFFF' } };
              return;
            }
          }

          // STATIC DATA COLOR
          if (child.dataColor) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: child.dataColor } };
            cell.font = { color: { argb: 'FFFFFFFF' } };
          }
        }

        // DIRECT COLUMN WITH CONDITION
        if (!config.children && colKey === key) {
          if (config.dataColorFn) {
            const dynamic = config.dataColorFn(value, rowObj);
            if (dynamic) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: dynamic } };
              cell.font = { color: { argb: 'FFFFFFFF' } };
              return;
            }
          }

          if (config.dataColor) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: config.dataColor } };
            cell.font = { color: { argb: 'FFFFFFFF' } };
          }
        }
      }
    });
  });

  // Auto width
  sheet.columns.forEach(col => {
    col.width = Math.max(
      12,
      ...col.values.map(v => (v ? v.toString().length + 2 : 10))
    );
  });

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xlsx`;
  link.click();
};
