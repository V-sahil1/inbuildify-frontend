'use client';

import React, { useState } from 'react';
import { Button, Space, Table, Typography } from 'antd';
import { IconDownload } from '@tabler/icons-react';
import SupplierType from '@/components/supplier/SupplierType';
import SupplierInfoDrawer from '@/components/supplier/SupplierInfoDrawer';
import { useSupplierColumns } from '@/components/table-columns/SupplierColumns';
import { SupplierList } from '@lib/utils/Reports/supplier/SupplierList';
import { Supplier } from '@redux/feature/supplier/ISupplierState';

export default function SupplierPage() {
  const [drawerOpen, setDrawerOpen] = useState<'supplier' | 'supplierType' | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { columns, suppliers, handleCreate } = useSupplierColumns(
    selectedSupplier,
    setSelectedSupplier,
    setDrawerOpen
  );

  return (
    <div style={{ padding: 20 }}>
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center gap-4">
          <Typography.Title level={4} className="!mb-0">
            Supplier and Trades Listing
          </Typography.Title>
        </div>

        <Space>
          <Button>Total Records {suppliers?.length}</Button>
          <Button type="primary" onClick={() => setDrawerOpen('supplier')}>
            New Supplier
          </Button>
          <Button onClick={() => setDrawerOpen('supplierType')}>Supplier Type</Button>
          <Button
            icon={<IconDownload size={16} />}
            onClick={() => SupplierList(suppliers, 'Supplier and Trades List')}
          >
            Export
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={suppliers}
        pagination={false}
        rowKey="supplierId"
        onRow={record => ({
          onClick: () => {
            setSelectedSupplier(record);
            setDrawerOpen('supplier');
          },
        })}
      />

      {drawerOpen === 'supplierType' && (
        <SupplierType open={drawerOpen === 'supplierType'} onClose={() => setDrawerOpen(null)} />
      )}
      {drawerOpen === 'supplier' && (
        <SupplierInfoDrawer
          open={drawerOpen === 'supplier'}
          onClose={() => setDrawerOpen(null)}
          onSubmit={handleCreate}
          initialValues={{
            ...selectedSupplier,
            supplierTypeId: selectedSupplier?.supplierTypes?.map(st => st.id) || [],
          }}
          isEditing={!!selectedSupplier}
        />
      )}
    </div>
  );
}
