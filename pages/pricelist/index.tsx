import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import AddMasterPricingItemModal from '@/components/common/Models/AddMasterPricingItemModel';
import { TableDrawer } from '@/components/common/TableDrawer';
import { PricelistHeader } from '@/components/pricelist/PricelistHeader';
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
import { IPriceList, IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { toggleExpand } from '@redux/feature/masterPriceList/masterPriceListSlice';
import {
  fetchCategoryItems,
  fetchPricelistMaster,
} from '@redux/feature/masterPriceList/masterPriceListThunk';
import { IconDownload } from '@tabler/icons-react';
import { Button, Empty, message, Space, Spin, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { MasterPricelist } from '@/components/common/MasterPricelist';

const PriceList = () => {
  const [drawerOpen, setDrawerOpen] = useState<
    'create' | 'quotation' | 'copy' | 'location' | 'master' | 'edit' | null
  >(null);
  const [selectedPricelist, setSelectedPricelist] = useState<IPriceListItem | null>(null);
  const [selectedPriceMaster, setSelectedPriceMaster] = useState<IPriceList | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [localCategories, setLocalCategories] = useState<IPriceList[]>([]);
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

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
  const { priceMaster, status } = useAppSelector(state => state.masterPriceList);
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

  const { handlePricelistSubmit, handleActivateItem } = PricelistColumn(
    setDrawerOpen,
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
    handlePriceMasterStatus,
  } = PricelistMasterColumn(setModalOpen, modalOpen, setSelectedPriceMaster, selectedPriceMaster);

  useEffect(() => {
    setLocalCategories(priceMaster);
  }, [priceMaster]);

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

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExpand = async (categoryId: string, isExpanded: boolean) => {
    setDropDowns(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));

    if (!isExpanded) {
      try {
        setLoadingItems(prev => ({ ...prev, [categoryId]: true }));
        dispatch(toggleExpand(categoryId));
        await dispatch(
          fetchCategoryItems({
            price_list_id: categoryId,
            range_id: filters?.range || undefined,
            dwelling_type_id: filters?.dwellingType || undefined,
          })
        ).unwrap();
      } catch (error: any) {
        message.error(error || 'Failed to fetch category items');
      } finally {
        setLoadingItems(prev => ({ ...prev, [categoryId]: false }));
      }
    }
  };
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

      {status.priceMaster == Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>
      ) : priceMaster?.length > 0 ? (
        <MasterPricelist
          localCategories={localCategories}
          setLocalCategories={setLocalCategories}
          dropDowns={dropDowns}
          loadingItems={loadingItems}
          handleExpand={handleExpand}
          handlePriceMasterStatus={handlePriceMasterStatus}
          setModalOpen={setModalOpen}
          setDrawerOpen={setDrawerOpen}
          setSelectedPriceMaster={setSelectedPriceMaster}
          setSelectedPricelist={setSelectedPricelist}
          handleActivateItem={handleActivateItem}
        />
      ) : (
        <Empty
          description={<span className="text-gray-500">No Master Price found.</span>}
          className="py-12"
        />
      )}

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
