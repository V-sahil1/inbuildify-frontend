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
import {
  IconDownload,
  IconFilter,
  IconPlus,
  IconSearch,
  IconSortAscending,
} from '@tabler/icons-react';
import {
  Badge,
  Button,
  Dropdown,
  Empty,
  Input,
  message,
  Pagination,
  Space,
  Spin,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';

const Package = () => {
  const dispatch = useAppDispatch();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState<
    'pricelist' | 'quotation' | 'delete' | 'edit' | 'create' | null
  >(null);
  const { packages, status, pagination } = useAppSelector(state => state.package);
  const { column: pricelistColumn, priceListItems } = PackagePricelistColumn(
    packages?.find(pkg => pkg.packageId === selectedPackage?.packageId)?.pricelistItems || [],
    selectedPackage
  );
  const { columns: quotationColumns, data: quotationHistoryData } = QuotationHistoryColumn();

  const PAGE_SIZE = 10;

  const fetchPackageData = async (
    page: number = currentPage,
    limit: number = PAGE_SIZE,
    isParam: boolean = true
  ) => {
    try {
      const params: PackageFetchParams = {
        page,
        limit,
      };
      params.search = filters?.search || undefined;
      if (isParam) {
        params.status = filters?.status === 'true' || undefined;
        params.dwelling_type_id = filters?.dwellingType || undefined;
        params.range_id = filters?.label || undefined;
        params.package_group_id = filters?.group || undefined;
      }
      params.name = filters?.name || undefined;
      params.cost = filters?.cost || undefined;
      params.builder_cost = filters?.builderCost || undefined;

      await dispatch(fetchPackages(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Packages');
    }
  };
  const {
    handlePackageSubmit,
    handlePackageStatus,
    filters,
    debouncedUpdateURL,
    sortMenu,
    packageFilterMenu,
    instantFilters,
    setParams,
  } = PackageColumn({
    setDrawerOpen,
    setSelectedPackage,
    selectedPackage,
    setFilterDropdownOpen,
    fetchPackageData,
  });
  useEffect(() => {
    fetchPackageData();
  }, [currentPage, filters?.search, filters?.name, filters?.cost, filters?.builder_cost]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Package Master</h1>
        <div className="flex items-center gap-3">
          <Input
            prefix={<IconSearch size={15} className="text-gray-400" />}
            placeholder="Search..."
            value={instantFilters?.search}
            onChange={e => setParams({ search: e.target.value })}
          />
          <Dropdown
            open={filterDropdownOpen}
            onOpenChange={setFilterDropdownOpen}
            trigger={['click']}
            dropdownRender={packageFilterMenu}
          >
            <Tooltip title="Filter">
              <Badge
                dot={!!(filters.status || filters.label || filters.dwellingType || filters.group)}
              >
                <IconFilter className="text-primary" />
              </Badge>
            </Tooltip>
          </Dropdown>
          <Dropdown
            menu={{
              items: sortMenu,
              onClick: (e: any) => {
                sortMenu.find(i => i.key === e.key)?.onClick?.();
              },
            }}
            trigger={['click']}
          >
            <Tooltip title="Sort">
              <Badge dot={!!(filters?.name || filters?.cost || filters?.builderCost)}>
                <IconSortAscending className="text-primary" />{' '}
              </Badge>
            </Tooltip>
          </Dropdown>
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
                        ?.pricelistItems.map(i =>
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
                {packages.find(i => i.packageId === selectedPackage.packageId)?.pricelistItems
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
