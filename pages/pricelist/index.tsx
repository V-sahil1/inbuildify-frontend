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
import { fetchCategories } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { IconDownload } from '@tabler/icons-react';
import { Button, message, Space, Table, Upload } from 'antd';
import { useEffect, useState } from 'react';

const PriceList = () => {
  const [drawerOpen, setDrawerOpen] = useState<
    'create' | 'quotation' | 'copy' | 'location' | 'master' | 'edit' | null
  >(null);
  const [selectedPricelist, setSelectedPricelist] = useState(null);
  const [selectedPriceMaster, setSelectedPriceMaster] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
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
  const { categories, status } = useAppSelector(state => state.masterPriceList);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();
      } catch (e) {
        message.error(e || 'Failed to fetch categories');
      }
    };
    if (status.Category === Status.IDLE) {
      fetchCategoriesData();
    }
  }, [dispatch, status]);
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
  });

  const {
    columns: pricelistColumn,
    priceLists,
    handlePricelistSubmit,
    handleActivateItem,
  } = PricelistColumn(
    filters,
    setParams,
    setDrawerOpen,
    setModalOpen,
    setSelectedPricelist,
    selectedPricelist,
    categories
  );
  const { columns: quotationColumns, data: quotationData, handleExport } = QuotationHistoryColumn();
  const {
    column: locationColumn,
    data,
    locationdata,
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
  } = PricelistMasterColumn(
    setModalOpen,
    modalOpen,
    setSelectedPriceMaster,
    locationdata,
    selectedPriceMaster,
    categories
  );

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
          locationdata={locationdata}
          setModalOpen={setModalOpen}
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-1">
          <PricelistSidebar
            filters={filters}
            setParams={setParams}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        </div>
        <div className="col-span-4">
          <Table
            columns={pricelistColumn}
            dataSource={
              selectedCategory
                ? priceLists.filter(i => i.categoryId === selectedCategory)
                : priceLists
            }
            onRow={record => ({
              onClick: () => {
                setModalOpen('ItemCreate');
                setSelectedPricelist(record);
              },
            })}
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
          categoryId={selectedPricelist?.categoryId}
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
                    onClick={() => handleExport(quotationData)}
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
              ? { name: selectedPricelist?.description }
              : modalOpen === 'createLocation'
                ? selectedLocation
                : { category: selectedPriceMaster?.name, status: selectedPriceMaster?.status }
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
                  <Button icon={<IconDownload size={15} />}>Download Template</Button>
                </div>
                <p className="text-red-500">Maximum 1000 items can be imported at a time </p>
                <p className="text-red-500">Supported formats(.xlsx)</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg">Pricelist Item: {selectedPricelist.description}</p>
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
