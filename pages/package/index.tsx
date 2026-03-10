import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { TableDrawer } from '@/components/common/TableDrawer';
import { PackageFormModal } from '@/components/package/PackageFormModal';
import { PackageItem } from '@/components/package/PackageItem';
import { PackageColumn } from '@/components/table-columns/PackageColumn';
import { PackagePricelistColumn } from '@/components/table-columns/PackagePricelistColumn';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { QuotationHistory } from '@lib/utils/Reports/quotation/QuotationHistory';
import type { Package, PackageFetchParams } from '@redux/feature/package/IPackageState';
import { fetchPackagePricelist, fetchPackages } from '@redux/feature/package/packageThunk';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { Button, Empty, message, Pagination, Space, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';

const Package = () => {
  const dispatch = useAppDispatch();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState<
    'pricelist' | 'quotation' | 'delete' | 'edit' | 'create' | null
  >(null);
  const { packages, status, pagination } = useAppSelector(state => state.package);
  const { handlePackageSubmit, handlePackageStatus, debouncedUpdateURL, filters } = PackageColumn({
    setDrawerOpen,
    setSelectedPackage,
    selectedPackage,
  });
  const { column: pricelistColumn, priceListItems } = PackagePricelistColumn(
    packages?.find(pkg => pkg.packageId === selectedPackage?.packageId)?.priceListItem || [],
    selectedPackage,
    setSelectedPackage
  );
  const { columns: quotationColumns, data: quotationHistoryData } = QuotationHistoryColumn();
  const PAGE_SIZE = 10;

  const fetchPackageData = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      const params: PackageFetchParams = {
        page,
        limit,
      };
      params.name = filters?.name || undefined;
      params.cost = filters?.cost ? Number(filters?.cost) : undefined;
      params.sort_order = filters?.sort || undefined;
      params.status = filters?.status !== '' ? filters?.status === 'true' : undefined;
      params.add = filters?.add !== 'all' ? filters?.add === 'yes' : undefined;
      params.remove = filters?.remove !== 'all' ? filters?.remove === 'yes' : undefined;
      params.dwelling_type_id = filters?.dwellingType !== 'all' ? filters?.dwellingType : undefined;
      params.range_id = filters?.label !== 'all' ? filters?.label : undefined;

      await dispatch(fetchPackages(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Packages');
    }
  };

  useEffect(() => {
    fetchPackageData();
  }, [currentPage, filters]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const fetchPricelistItems = () => {
    try {
      packages?.map(async i => await dispatch(fetchPackagePricelist(i?.packageId)).unwrap());
    } catch (error) {
      message.error(error || 'Failed to fetch pricelist items');
    }
  };

  useEffect(() => {
    fetchPricelistItems();
  }, [status.packages]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Package Master</h1>
        <div className="flex items-center gap-2">
          <Button type="primary" ghost>
            Total Records {pagination?.totalRecords || 0}
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
      {status.packages === Status.PENDING ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : packages && packages?.length > 0 ? (
        <div className="space-y-4">
          {packages?.map(pkg => (
            <PackageItem
              key={pkg.packageId}
              pkg={pkg}
              setSelectedPackage={setSelectedPackage}
              setDrawerOpen={setDrawerOpen}
            />
          ))}
        </div>
      ) : (
        <Empty
          description={
            <span className="text-gray-500">
              No packages found. Create your first package to get started.
            </span>
          }
          className="py-12"
        />
      )}
      <div className="flex justify-end mt-3 flex-shrink-0">
        <Pagination
          current={currentPage || 1}
          pageSize={pagination?.limit || PAGE_SIZE}
          total={pagination?.totalRecords || 0}
          showSizeChanger={false}
          showQuickJumper={false}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} floor plans`}
          onChange={page => {
            setCurrentPage(page);
          }}
        />
      </div>
      {drawerOpen === 'create' && (
        <PackageFormModal
          title="Package Information"
          open={drawerOpen === 'create'}
          onClose={() => {
            setDrawerOpen(null);
            setSelectedPackage(null);
          }}
          onSubmit={values => {
            handlePackageSubmit(values);
          }}
          initialValues={{
            ...selectedPackage,
            packageGroupId: selectedPackage?.packageGroup.map(i => i.id),
            rangeId: selectedPackage?.range.map(i => i.id),
            dwellingTypeId: selectedPackage?.dwellingType.map(i => i.id),
          }}
          isEditing={!!selectedPackage}
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
                    onClick={() => QuotationHistory(quotationHistoryData, 'Package QuotationList')}
                    icon={<IconDownload size={20} />}
                  />
                </Space>
              </div>
            )
          }
          table={[
            {
              columns: drawerOpen === 'pricelist' ? pricelistColumn : quotationColumns,
              data:
                drawerOpen === 'pricelist'
                  ? showAll
                    ? priceListItems
                    : packages
                        .find(i => i.packageId === selectedPackage.packageId)
                        ?.priceListItem.map(i =>
                          priceListItems.find(p => p.priceListItemId === i.priceListItemId)
                        )
                  : quotationHistoryData,
            },
          ]}
          open={['pricelist', 'quotation'].includes(drawerOpen)}
          onClose={() => {
            setSelectedPackage(null);
            setDrawerOpen(null);
          }}
          width={drawerOpen === 'pricelist' ? 700 : 900}
        >
          {drawerOpen === 'pricelist' && (
            <Space className="mb-2">
              <Button type="primary" onClick={() => setShowAll(true)}>
                Show All
              </Button>
              <Button onClick={() => setShowAll(false)}>
                Selected Items (
                {packages.find(i => i.packageId === selectedPackage.packageId)?.priceListItem
                  ?.length || 0}
                )
              </Button>
            </Space>
          )}
        </TableDrawer>
      )}

      {['delete', 'edit'].includes(drawerOpen) && (
        <ConfirmationContentModal
          title="Confirmation"
          open={['delete', 'edit'].includes(drawerOpen)}
          onClose={() => setDrawerOpen(null)}
          okText={
            drawerOpen === 'delete' ? (selectedPackage?.status ? 'InActive' : 'Active') : 'Update'
          }
          content={
            drawerOpen === 'delete' ? (
              <div className="text-center">
                <p>Package Name: Premium Pack</p>
                {selectedPackage?.status && (
                  <p className="text-blue">
                    This Package is alreadey mapped for existing quotation hence it can only be
                    inactivated
                  </p>
                )}
                <p>
                  Are you sure you want to {selectedPackage?.status ? 'InActivate' : 'Activate'}?
                </p>
              </div>
            ) : (
              <div>
                <p className="text-blue">The following changes are identified : </p>
                <p>Are you sure want to update the changes?</p>
              </div>
            )
          }
          onSubmit={() => {
            handlePackageStatus();
          }}
        />
      )}
    </div>
  );
};

export default Package;
