import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import AddMasterPricingItemModal from '@/components/common/Models/AddMasterPricingItemModel';
import { TableDrawer } from '@/components/common/TableDrawer';
import { PricelistHeader } from '@/components/pricelist/PricelistHeader';
import { PricelistSidebar } from '@/components/pricelist/PricelistSidebar';
import { PricelistColumn } from '@/components/table-columns/PricelistColumn';
import { PricelistLocationColumn } from '@/components/table-columns/PricelistLocationColumn';
import { PricelistMasterColumn } from '@/components/table-columns/PricelistMasterColumn';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { debouncedURL } from '@lib/utils/debounceURL';
import { BulkPricelist } from '@lib/utils/Reports/pricelist/BulkPricelist';
import { QuotationHistory } from '@lib/utils/Reports/quotation/QuotationHistory';
import { LocationType } from '@redux/feature/common/ICommonState';
import {
  IPriceList,
  IPriceListItem,
  PricelistItemFtechParams,
} from '@redux/feature/masterPriceList/iMasterPriceListState';
import { toggleExpand } from '@redux/feature/masterPriceList/masterPriceListSlice';
import {
  fetchCategoryItems,
  fetchPricelistMaster,
} from '@redux/feature/masterPriceList/masterPriceListThunk';
import { IconDownload } from '@tabler/icons-react';
import { Button, message, Space, Table, Upload } from 'antd';
import { useEffect, useState } from 'react';

const PriceList = () => {
  const [drawerOpen, setDrawerOpen] = useState<
    'create' | 'quotation' | 'copy' | 'location' | 'master' | 'edit' | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPricelist, setSelectedPricelist] = useState<IPriceListItem | null>(null);
  const [selectedPriceMaster, setSelectedPriceMaster] = useState<IPriceList | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [modalOpen, setModalOpen] = useState<
    | 'copy'
    | 'create'
    | 'edit'
    | 'Itemcopy'
    | 'ItemCreate'
    | 'activePricelist'
    | 'import'
    | 'createLocation'
  >(null);
  const { priceMaster, status, pagination } = useAppSelector(state => state.masterPriceList);
  const PAGE_SIZE = 10;
  const dispatch = useAppDispatch();

  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: [
      'location',
      'range',
      'dwellingType',
      'description',
      'price',
      'costOption',
      'sort',
      'status',
      'category',
    ],
    initialValue: { status: '' },
  });

  const {
    columns: pricelistColumn,
    handlePricelistSubmit,
    handleActivateItem,
  } = PricelistColumn(
    filters,
    setParams,
    setDrawerOpen,
    setModalOpen,
    setSelectedPricelist,
    selectedPricelist
  );
  const { columns: quotationColumns, data: quotationData } = QuotationHistoryColumn();
  const {
    column: locationColumn,
    data,
    locationFormFields,
    locationSubmit,
  } = PricelistLocationColumn(setModalOpen, setSelectedLocation, selectedLocation);
  const {
    Mastercolumn,
    suggestedMasterColumn,
    suggestedData,
    categoryData,
    masterFields,
    priceMasterSubmit,
  } = PricelistMasterColumn(setModalOpen, modalOpen, setSelectedPriceMaster, selectedPriceMaster);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        await dispatch(fetchPricelistMaster({})).unwrap();
      } catch (e) {
        message.error(e || 'Failed to fetch categories');
      }
    };
    if (status.priceMaster === Status.IDLE) {
      fetchCategoriesData();
    }
  }, [dispatch, status.priceMaster]);

  const fetchItems = async () => {
    try {
      priceMaster?.map(async i => {
        if (!i.isExpanded) {
          dispatch(toggleExpand(i.priceListId));
          await dispatch(fetchCategoryItems({ price_list_id: i.priceListId })).unwrap();
        }
      });
    } catch (error) {
      message.error(error || 'Failed to fetch items');
    }
  };
  useEffect(() => {
    fetchItems();
  }, [status.priceMaster]);

  const fetchAllCategoryItems = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    const params: PricelistItemFtechParams = {
      page,
      limit,
      price_list_id: selectedPriceMaster?.priceListId,
    };
    params.range_id = filters?.range || undefined;
    params.status =
      filters?.status !== '' ? (filters?.status === 'true' ? 'active' : 'inactive') : undefined;
    params.price = Number(filters?.price) || undefined;
    params.cost_option = filters?.costOption || undefined;
    params.sort_order = filters?.sort || undefined;
    params.item_description = filters?.description || undefined;
    params.location_id = filters?.location || undefined;
    params.dwelling_type_id = filters?.dwellingType || undefined;
    try {
      if (!selectedPriceMaster?.isExpanded) {
        dispatch(toggleExpand(selectedPriceMaster?.priceListId));
        await dispatch(fetchCategoryItems(params)).unwrap();
      }
    } catch (error) {
      message.error(error || 'Failed to fetch category items');
    }
  };

  useEffect(() => {
    fetchAllCategoryItems();
  }, [selectedPriceMaster, filters]);
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Price List</h1>
        <PricelistHeader
          filters={filters}
          setParams={setParams}
          setDrawerOpen={setDrawerOpen}
          setModalOpen={setModalOpen}
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-1">
          <PricelistSidebar
            filters={filters}
            setParams={setParams}
            selectedCategory={selectedPriceMaster}
            setSelectedCategory={setSelectedPriceMaster}
            categories={priceMaster}
          />
        </div>
        <div className="col-span-4">
          <Table
            columns={pricelistColumn}
            dataSource={
              selectedPriceMaster
                ? priceMaster.find(i => i.priceListId === selectedPriceMaster?.priceListId)?.items
                : priceMaster?.map(i => (i.items?.length > 0 ? i.items : [])).flat() || []
            }
            onRow={record => ({
              onClick: () => {
                setModalOpen('ItemCreate');
                setSelectedPricelist(record);
              },
            })}
            pagination={{
              current: pagination?.currentPage,
              pageSize: pagination?.limit,
              total: pagination?.totalRecords,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              onChange: page => {
                setCurrentPage(page);
              },
            }}
          />
        </div>
      </div>
      {modalOpen === 'ItemCreate' && (
        <AddMasterPricingItemModal
          open={modalOpen === 'ItemCreate'}
          extraField={true}
          onClose={() => {
            setModalOpen(null);
            setSelectedPricelist(null);
          }}
          categoryId={selectedPricelist?.priceList.id}
          categoryItem={selectedPricelist}
        />
      )}
      {['master', 'quotation', 'location'].includes(drawerOpen) && (
        <TableDrawer
          open={['master', 'quotation', 'location'].includes(drawerOpen)}
          width={700}
          onClose={() => setDrawerOpen(null)}
          title={
            drawerOpen === 'quotation' ? (
              <div className="flex justify-between">
                <p>Quotation History</p>
                <Space>
                  <Button type="primary">Total Records {quotationData.length}</Button>
                  <Button
                    type="primary"
                    onClick={() => QuotationHistory(quotationData, 'Pricelist QuotationList')}
                    icon={<IconDownload size={20} />}
                  />
                </Space>
              </div>
            ) : drawerOpen === 'master' ? (
              'Price List Master'
            ) : (
              'Location'
            )
          }
          table={
            drawerOpen === 'quotation'
              ? [{ columns: quotationColumns, data: quotationData }]
              : drawerOpen === 'master'
                ? [
                    { columns: Mastercolumn, data: categoryData },
                    { columns: suggestedMasterColumn, data: suggestedData },
                  ]
                : [{ columns: locationColumn, data }]
          }
        />
      )}
      {['copy', 'create', 'edit', 'Itemcopy', 'createLocation'].includes(modalOpen) && (
        <ActionDialogmodel
          title={
            modalOpen === 'create'
              ? 'Create Price Master'
              : modalOpen === 'copy'
                ? 'Copy of Price Master'
                : modalOpen === 'edit'
                  ? 'Edit Price Master'
                  : modalOpen === 'Itemcopy'
                    ? 'Copy of PriceList Item'
                    : 'Create Location'
          }
          open={['copy', 'create', 'edit', 'Itemcopy', 'createLocation'].includes(modalOpen)}
          onCancel={() => {
            setModalOpen(null);
            setSelectedPriceMaster(null);
            setSelectedPricelist(null);
            setSelectedLocation(null);
          }}
          fields={modalOpen === 'createLocation' ? locationFormFields : masterFields}
          isEditing={!!selectedPricelist || !!selectedPriceMaster || !!selectedLocation}
          initialValues={
            (!!selectedPricelist || !!selectedPriceMaster) && modalOpen === 'Itemcopy'
              ? { name: selectedPricelist?.itemDescription }
              : modalOpen === 'createLocation'
                ? { ...selectedLocation, status: selectedLocation?.status ? 'active' : 'inactive' }
                : {
                    ...selectedPriceMaster,
                    isActive: selectedPriceMaster?.isActive ? 'active' : 'inactive',
                  }
          }
          onSubmit={values => {
            modalOpen === 'Itemcopy'
              ? handlePricelistSubmit(values)
              : modalOpen === 'createLocation'
                ? locationSubmit(values)
                : priceMasterSubmit(values);
            setModalOpen(null);
            setSelectedPriceMaster(null);
            setSelectedPricelist(null);
            setSelectedLocation(null);
          }}
        />
      )}
      {['activePricelist', 'import'].includes(modalOpen) && (
        <ConfirmationContentModal
          title={modalOpen === 'import' ? 'Import Pricelist Item' : 'Confirmation'}
          open={['activePricelist', 'import'].includes(modalOpen)}
          onClose={() => setModalOpen(null)}
          onSubmit={() => {
            modalOpen === 'activePricelist' && handleActivateItem();
            setModalOpen(null);
          }}
          okText={modalOpen === 'import' ? 'Import' : 'Active'}
          content={
            modalOpen === 'import' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Upload>
                    <Button>Click to Upload</Button>
                  </Upload>
                  <Button icon={<IconDownload size={15} />} onClick={BulkPricelist}>
                    Download Template
                  </Button>
                </div>
                <p className="text-red-500">Maximum 1000 items can be imported at a time </p>
                <p className="text-red-500">Supported formats(.xlsx)</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg">Pricelist Item: {selectedPricelist.itemDescription}</p>
                <p>Do you want to activate pricelist item?</p>
              </div>
            )
          }
        />
      )}
    </div>
  );
};

export default PriceList;
