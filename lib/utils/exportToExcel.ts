import * as ExcelJS from "exceljs";

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

interface HeaderBlock {
  position: "top" | "bottom";
  layout?: "horizontal" | "vertical";
  columnHeaders: Record<string, ExcelColumn>;
  data: any[];
}

interface ExportToExcelOptions {
  data: any[];
  fileName: string;
  sheetName?: string;
  columnHeaders: Record<string, ExcelColumn>;
  title?: string;
  extraHeaderRows?: HeaderBlock[];
}

export const exportToExcel = async ({
  data,
  fileName,
  sheetName = "Sheet1",
  columnHeaders,
  title,
  extraHeaderRows = [],
}: ExportToExcelOptions) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  // TITLE
  if (title) {
    const titleRow = sheet.addRow([title]);
    titleRow.font = { size: 18, bold: true };
    titleRow.alignment = { horizontal: "center", vertical: "middle" };

    const colCount = Object.keys(columnHeaders).length;
    sheet.mergeCells(1, 1, 1, colCount);

    sheet.addRow([]);
  }

  // Build main table (used for both main and extra blocks)
  const buildTable = (
    headers: Record<string, ExcelColumn>,
    rows: any[]
  ) => {
    const parentRow = sheet.addRow([]);
    const childRow = sheet.addRow([]);

    const flatKeys: string[] = [];
    let colIndex = 1;

    Object.entries(headers).forEach(([key, config]) => {
      const isString = typeof config === "string";
      const isMulti =
        !isString && config.children && config.children.length > 0;

      if (isString) {
        const cell = parentRow.getCell(colIndex);
        cell.value = config;
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
        flatKeys.push(key);
        colIndex++;
        return;
      }

      if (!isMulti) {
        const cell = parentRow.getCell(colIndex);
        cell.value = config.label;
        cell.font = {
          bold: true,
          color: config.color ? { argb: "FFFFFFFF" } : undefined,
        };
        cell.alignment = { horizontal: "center" };

        if (config.color) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: config.color },
          };
        }

        flatKeys.push(key);
        colIndex++;
        return;
      }

      // Multi-column parent
      const span = config.children!.length;
      sheet.mergeCells(
        parentRow.number,
        colIndex,
        parentRow.number,
        colIndex + span - 1
      );

      const parentCell = parentRow.getCell(colIndex);
      parentCell.value = config.label;
      parentCell.font = {
        bold: true,
        color: config.color ? { argb: "FFFFFFFF" } : undefined,
      };
      parentCell.alignment = { horizontal: "center", vertical: "middle" };

      if (config.color) {
        parentCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: config.color },
        };
      }

      config.children!.forEach((child) => {
        const c = childRow.getCell(colIndex);
        c.value = child.label;
        c.font = {
          bold: true,
          color: child.color ? { argb: "FFFFFFFF" } : undefined,
        };
        c.alignment = { horizontal: "center" };

        if (child.color) {
          c.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: child.color },
          };
        }

        flatKeys.push(child.key);
        colIndex++;
      });
    });

    // Add Data Rows
    rows.forEach(rowObj => {
      const row = sheet.addRow(
        flatKeys.map((k) => {
          const raw = rowObj[k];
          if (Array.isArray(raw)) return raw.join("\n");
          if (typeof raw === "string") return raw;
          return raw ?? "";
        })
      );

      row.eachCell((cell, i) => {
        const key = flatKeys[i - 1];
        const value = rowObj[key];

        const empty =
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (empty) return;

        for (const [colKey, config] of Object.entries(headers)) {
          if (typeof config === "string") continue;

          // CHILDREN
          if (config.children) {
            const child = config.children.find((c) => c.key === key);
            if (!child) continue;

            if (child.dataColorFn) {
              const dynamic = child.dataColorFn(value, rowObj);
              if (dynamic) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: dynamic },
                };
                cell.font = { color: { argb: "FFFFFFFF" } };
                return;
              }
            }

            if (child.dataColor) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: child.dataColor },
              };
              cell.font = { color: { argb: "FFFFFFFF" } };
            }
          }

          // DIRECT COLUMN WITH CONDITION
          if (!config.children && colKey === key) {
            if (config.dataColorFn) {
              const dynamic = config.dataColorFn(value, rowObj);
              if (dynamic) {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: dynamic },
                };
                cell.font = { color: { argb: "FFFFFFFF" } };
                return;
              }
            }

            if (config.dataColor) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: config.dataColor },
              };
              cell.font = { color: { argb: "FFFFFFFF" } };
            }
          }
        }
      });
    });

    sheet.addRow([]);
  };

  // 🔥 FUNCTION — Build Vertical Block (with full styling)
  const buildVerticalBlock = (
    headers: Record<string, ExcelColumn>,
    blockData: any[]
  ) => {
    const first = blockData[0] ?? {};

    Object.entries(headers).forEach(([key, config]) => {
      const label = typeof config === "string" ? config : config.label;
      const value = first[key] ?? "";

      const row = sheet.addRow([label, value]);

      const labelCell = row.getCell(1);
      const valueCell = row.getCell(2);

      // LABEL STYLE
      labelCell.font = { bold: true };
      labelCell.alignment = { horizontal: "left" };

      // APPLY LABEL COLOR
      const headerColor =
        typeof config !== "string" && config.color ? config.color : undefined;

      if (headerColor) {
        labelCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: headerColor },
        };
        labelCell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      }

      // APPLY VALUE COLOR
      if (typeof config !== "string") {
        if (config.dataColorFn) {
          const dynamic = config.dataColorFn(value, first);
          if (dynamic) {
            valueCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: dynamic },
            };
            valueCell.font = { color: { argb: "FFFFFFFF" } };
          }
        } else if (config.dataColor) {
          valueCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: config.dataColor },
          };
          valueCell.font = { color: { argb: "FFFFFFFF" } };
        }
      }
    });

    sheet.addRow([]);
  };

  // TOP BLOCKS
  extraHeaderRows
    .filter((b) => b.position === "top")
    .forEach((block) => {
      block.layout === "vertical"
        ? buildVerticalBlock(block.columnHeaders, block.data)
        : buildTable(block.columnHeaders, block.data);
    });

  // MAIN TABLE
  buildTable(columnHeaders, data);

  // BOTTOM BLOCKS
  extraHeaderRows
    .filter((b) => b.position === "bottom")
    .forEach((block) => {
      block.layout === "vertical"
        ? buildVerticalBlock(block.columnHeaders, block.data)
        : buildTable(block.columnHeaders, block.data);
    });

  // Auto-width
  sheet.columns.forEach((col) => {
    col.width = Math.max(
      12,
      ...col.values.map((v) =>
        v ? v.toString().length + 2 : 10
      )
    );
  });

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xlsx`;
  link.click();
};
