import React from 'react';
import ReactDataTable, { TableProps } from 'react-data-table-component';

type CustomDataTableProps<T> = TableProps<T> & {
  selectedRows?: any[];
};

const CustomDataTable = <T,>({
  selectedRows = [],
  conditionalRowStyles = [],
  ...props
}: CustomDataTableProps<T>) => {
  const defaultConditionalRowStyles = [
    {
      when: (row: any) => selectedRows.some(selected => selected.name === row.name),
      style: {
        backgroundColor: 'var(--primary-10) !important',
        color: 'var(--font-color-100) !important',
        '&:hover': {
          backgroundColor: 'var(--primary-10) !important',
          color: 'var(--font-color-100) !important',
        },
      },
    },
  ];

  return (
    <div className="react-data-table rounded-[8px]">
      <ReactDataTable
        highlightOnHover
        dense
        striped
        pagination
        paginationRowsPerPageOptions={[5, 10, 25, 50]}
        paginationPerPage={5}
        selectableRowsHighlight
        persistTableHead
        conditionalRowStyles={[
          ...defaultConditionalRowStyles,
          ...(Array.isArray(conditionalRowStyles) ? conditionalRowStyles : []),
        ]}
        noDataComponent={
          <div className="w-full !py-6 flex items-center justify-center bg-card-color text-font-color">
            <span>No data available</span>
          </div>
        }
        {...props}
      />
    </div>
  );
};

export default CustomDataTable;
