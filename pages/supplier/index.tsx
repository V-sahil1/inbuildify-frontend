'use client';

import React, { useState } from 'react';
import { Button, Space, Table, Typography } from 'antd';
import { IconDownload } from '@tabler/icons-react';
import SupplierType from '@/components/supplier/SupplierType';
import SupplierInfoDrawer from '@/components/supplier/SupplierInfoDrawer';
import { useSupplierColumns, Supplier } from '@/components/table-columns/SupplierColumns';
import { exportToExcel } from '@lib/utils/exportToExcel';

export default function SupplierPage() {
  const [supplierTypeOpen, setSupplierTypeOpen] = useState(false);
  const [supplierInfoOpen, setSupplierInfoOpen] = useState(false);

  const { columns, filteredData, setData } = useSupplierColumns();

  const handleCreateSupplier = (values: any) => {
    const newSupplier: Supplier = {
      key: Date.now().toString(),
      name: values.companyName || '',
      email: values.email || '',
      phone: values.primaryPhone || '',
      website: values.website || '',
      type: Array.isArray(values.supplierTypes) ? values.supplierTypes : [],
      induction: !!values['induction pack recieve'],
      isActive: values.status ? values.status === 'active' : true,
      description: values.description || '',
      contactName: values.contactName || '',
      workCoverExpiryDate: values.workCoverExpiryDate || '',
      plInsuranceExpiryDate: values.plInsuranceExpiryDate || '',
      tradeLicenseExpiryDate: values.tradeLicenseExpiryDate || '',
      whiteCardExpiryDate: values.whiteCardExpiryDate || '',
      forkLiftLicenseExpiryDate: values.forkLiftLicenseExpiryDate || '',
    };

    setData(prev => [...prev, newSupplier]);
  };

  const handleExport = () => {
    const columnsMap: Record<string, string> = {
      name: 'Supplier Name',
      description: 'Supplier Description',
      contactName: 'Contact Name',
      email: 'Email',
      phone: 'Primary Phone',
      website: 'Website',
      induction: 'Induction Pack Received',
      workCoverExpiryDate: 'Work Cover Expiry Date',
      plInsuranceExpiryDate: 'PLInsurance Expiry Date',
      tradeLicenseExpiryDate: 'TradeLicense Expiry Date',
      whiteCardExpiryDate: 'WhiteCard Expiry Date',
      forkLiftLicenseExpiryDate: 'Fork-Lift License Expiry Date',
      type: 'Supplier Type Name',
    };

    exportToExcel({
      data: filteredData.map(row => ({
        ...row,
        induction: row.induction ? 'Yes' : 'No',
        type: (row.type || []).join(', '),
      })),
      fileName: 'SupplierList',
      sheetName: 'SupplierList',
      columnHeaders: columnsMap,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center gap-4">
          <Typography.Title level={4} className="!mb-0">
            Supplier and Trades Listing
          </Typography.Title>
        </div>

        <Space>
          <Button>Total Records {filteredData.length}</Button>
          <Button type="primary" onClick={() => setSupplierInfoOpen(true)}>
            New Supplier
          </Button>
          <Button onClick={() => setSupplierTypeOpen(true)}>Supplier Type</Button>
          <Button icon={<IconDownload size={16} />} onClick={handleExport}>
            Export
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={filteredData} pagination={false} rowKey="key" />

      <SupplierType open={supplierTypeOpen} onClose={() => setSupplierTypeOpen(false)} />
      <SupplierInfoDrawer
        open={supplierInfoOpen}
        onClose={() => setSupplierInfoOpen(false)}
        onSubmit={handleCreateSupplier}
      />
    </div>
  );
}
