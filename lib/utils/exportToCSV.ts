import { ExcelColumn, ExportOptions } from "types/common.types";

export const exportToCSV = ({
    data,
    fileName,
    columnHeaders,
    extraHeaderRows = [],
}: ExportOptions) => {
    let csvRows: string[] = [];

    const getFlatKeys = (headers: Record<string, ExcelColumn>) => {
        const keys: string[] = [];

        Object.entries(headers).forEach(([key, config]) => {
            if (typeof config === "string") {
                keys.push(key);
            } else if (config.children?.length) {
                config.children.forEach((child) => keys.push(child.key));
            } else {
                keys.push(key);
            }
        });

        return keys;
    };

    const getHeaderLabels = (headers: Record<string, ExcelColumn>) => {
        const labels: string[] = [];

        Object.entries(headers).forEach(([_, config]) => {
            if (typeof config === "string") {
                labels.push(config);
            } else if (config.children?.length) {
                config.children.forEach((c) => labels.push(c.label));
            } else {
                labels.push(config.label);
            }
        });

        return labels;
    };

    // FUNCTION — Convert values safely
    const escapeValue = (val: any) => {
        if (val === null || val === undefined) return "";
        let v = val;

        if (Array.isArray(v)) v = v.join(" | "); // avoid multi-line breaking CSV
        v = v.toString().replace(/"/g, '""');

        return `"${v}"`;
    };

    // PROCESS EXTRA TOP BLOCKS
    extraHeaderRows
        .filter((b) => b.position === "top")
        .forEach((block) => {
            if (block.layout === "vertical") {
                const rowObj = block.data[0] || {};
                Object.entries(block.columnHeaders).forEach(([key, config]) => {
                    const label = typeof config === "string" ? config : config.label;
                    const value = escapeValue(rowObj[key] || "");
                    csvRows.push(`${label},${value}`);
                });
                csvRows.push(""); // empty line
            } else {
                const flatKeys = getFlatKeys(block.columnHeaders);
                const headerLabels = getHeaderLabels(block.columnHeaders);
                csvRows.push(headerLabels.join(","));

                block.data.forEach((rowObj) => {
                    const row = flatKeys.map((k) => escapeValue(rowObj[k]));
                    csvRows.push(row.join(","));
                });

                csvRows.push("");
            }
        });

    // MAIN TABLE
    const mainKeys = getFlatKeys(columnHeaders);
    const mainLabels = getHeaderLabels(columnHeaders);

    csvRows.push(mainLabels.join(","));
    data.forEach((rowObj) => {
        const row = mainKeys.map((k) => escapeValue(rowObj[k]));
        csvRows.push(row.join(","));
    });

    csvRows.push("");

    // PROCESS EXTRA BOTTOM BLOCKS
    extraHeaderRows
        .filter((b) => b.position === "bottom")
        .forEach((block) => {
            if (block.layout === "vertical") {
                const rowObj = block.data[0] || {};
                Object.entries(block.columnHeaders).forEach(([key, config]) => {
                    const label = typeof config === "string" ? config : config.label;
                    const value = escapeValue(rowObj[key] || "");
                    csvRows.push(`${label},${value}`);
                });
                csvRows.push("");
            } else {
                const flatKeys = getFlatKeys(block.columnHeaders);
                const headerLabels = getHeaderLabels(block.columnHeaders);
                csvRows.push(headerLabels.join(","));

                block.data.forEach((rowObj) => {
                    const row = flatKeys.map((k) => escapeValue(rowObj[k]));
                    csvRows.push(row.join(","));
                });

                csvRows.push("");
            }
        });

    // DOWNLOAD CSV
    const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
};
