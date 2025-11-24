import React from 'react';
import { TableDrawer } from '@/components/common/TableDrawer';
import { useSupplierTypeColumns } from '@/components/table-columns/SupplierTypeColumns';

interface SupplierTypeProps {
  open: boolean;
  onClose: () => void;
}

const SupplierType: React.FC<SupplierTypeProps> = ({ open, onClose }) => {
  const { columns, data, confirmModal, checklistDrawer, supplierDrawer } = useSupplierTypeColumns();

  return (
    <>
      <TableDrawer
        open={open}
        onClose={onClose}
        title="Supplier Type / Group"
        width="45%"
        table={{ columns, data }}
      />
      {confirmModal}
      {checklistDrawer}
      {supplierDrawer}
    </>
  );
};

export default SupplierType;
