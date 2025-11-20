import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { TableDrawer } from '@/components/common/TableDrawer';
import { PackageFormModal } from '@/components/package/PackageFormModal';
import { PackageColumn } from '@/components/table-columns/PackageColumn';
import { PackagePricelistColumn } from '@/components/table-columns/PackagePricelistColumn';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { debouncedURL } from '@lib/utils/debounceURL';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { Button, Space, Table } from 'antd';
import { useEffect, useState } from 'react';

const Package = () => {
  const [editId, setEditId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState<
    'pricelist' | 'quotation' | 'delete' | 'edit' | 'create' | null
  >(null);
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['name', 'cost', 'add', 'remove', 'sort', 'label', 'dwellingType', 'status'],
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const { column: packageColumn, packageData } = PackageColumn({
    filters,
    setParams,
    setDrawerOpen,
  });
  const { column: pricelistColumn, pricelistData } = PackagePricelistColumn();
  const {
    columns: quotationColumns,
    data: quotationHistoryData,
    handleExport,
  } = QuotationHistoryColumn();
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Package Master</h1>
        <div className="flex items-center gap-2">
          <Button type="primary" ghost>
            Total Records 2
          </Button>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => {
              setDrawerOpen('create');
            }}
          >
            New Package
          </Button>
        </div>
      </div>
      <Table
        columns={packageColumn}
        dataSource={packageData}
        onRow={record => ({
          onClick: () => {
            setEditId(record.id);
            setDrawerOpen('create');
          },
        })}
      />
      {drawerOpen === 'create' && (
        <PackageFormModal
          title="Package Information"
          open={drawerOpen === 'create'}
          onClose={() => {
            setDrawerOpen(null);
            setEditId(null);
          }}
          onSubmit={values => {
            console.log('package submit', values);
            setDrawerOpen(null);
            !!editId && setDrawerOpen('edit');
          }}
          initialValues={packageData.filter(obj => obj.id === editId)[0]}
          isEditing={!!editId}
        />
      )}

      {['pricelist', 'quotation'].includes(drawerOpen) && (
        <TableDrawer
          title={
            drawerOpen === 'pricelist' ? (
              'Pricelist Items'
            ) : (
              <div className="flex justify-between">
                <p>Quotation History</p>
                <Space>
                  <Button type="primary">Total Records {quotationHistoryData.length}</Button>
                  <Button
                    type="primary"
                    onClick={() => handleExport(quotationHistoryData)}
                    icon={<IconDownload size={20} />}
                  />
                </Space>
              </div>
            )
          }
          table={{
            columns: drawerOpen === 'pricelist' ? pricelistColumn : quotationColumns,
            data: drawerOpen === 'pricelist' ? pricelistData : quotationHistoryData,
          }}
          open={['pricelist', 'quotation'].includes(drawerOpen)}
          onClose={() => setDrawerOpen(null)}
          width={drawerOpen === 'pricelist' ? 700 : 900}
        >
          {drawerOpen === 'pricelist' && (
            <Space className="mb-2">
              <Button type="primary">Show All</Button>
              <Button>Selected Items 2</Button>
            </Space>
          )}
        </TableDrawer>
      )}
      {['delete', 'edit'].includes(drawerOpen) && (
        <ConfirmationContentModal
          title="Confirmation"
          open={['delete', 'edit'].includes(drawerOpen)}
          onClose={() => setDrawerOpen(null)}
          okText={drawerOpen === 'delete' ? 'InActive' : 'Update'}
          content={
            drawerOpen === 'delete' ? (
              <div className="text-center">
                <p>Package Name: Premium Pack</p>
                <p className="text-blue">
                  This Package is alreadey mapped for existing quotation hence it can only be
                  inactivated
                </p>
                <p>Are you sure you want to inactive?</p>
              </div>
            ) : (
              <div>
                <p className="text-blue">The following changes are identified : </p>
                <p>Are you sure want to update the changes?</p>
              </div>
            )
          }
          onSubmit={() => {
            setDrawerOpen(null);
            drawerOpen == 'edit' && setEditId(null);
          }}
        />
      )}
    </div>
  );
};

export default Package;
