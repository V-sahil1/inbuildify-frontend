import { useEffect, useState } from 'react';
import { Button, message, Space, Table } from 'antd';
import { TableDrawer } from '@/components/common/TableDrawer';
import FloorPlanFormModal from '@/components/floorplan/FloorplanFormModal';
import { FacadeColumns } from '@/components/table-columns/FacadeColumns';
import { FloorPlanColumn } from '@/components/table-columns/floorPlanColumn';
import { FloorplanPricelistColumns } from '@/components/table-columns/FloorplanPricelistColumns';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { debouncedURL } from '@lib/utils/debounceURL';
import { QuotationHistory } from '@lib/utils/Reports/quotation/QuotationHistory';
import { fetchFloorPlanPricelist, fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { RootState } from '@redux/feature/store';
import { IconDownload } from '@tabler/icons-react';
import { FloorPlanGetParams, IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';

const FloorPlanMaster = () => {
  const dispatch = useAppDispatch();
  const { floorPlans, status, pagination } = useAppSelector((state: RootState) => state.floorPlan);
  const [createFloorPlanOpen, setcreateFloorPlanOpen] = useState(false);
  const [selectedFloorplan, setSelectedFloorplan] = useState<IFloorPlanState | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState<'floorplan' | 'facade' | 'quotation' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSelectedData, setShowSelectedData] = useState(false);
  const {
    filters: debouncedFilters,
    debouncedUpdateURL,
    setParams,
  } = debouncedURL({
    filtersKey: ['name', 'dwellingType', 'location', 'label', 'status'],
    initialValue: { status: 'all' },
  });
  const { columns: floorPlanColumns, handleFloorPlan } = FloorPlanColumn(
    setDrawerOpen,
    setParams,
    selectedFloorplan,
    setSelectedFloorplan
  );
  const { columns: quotationColumns, data } = QuotationHistoryColumn();
  const { columns: floorplanPricelistColumn, priceListItems } = FloorplanPricelistColumns(
    floorPlans?.find(i => i?.floorPlanId === selectedFloorplan?.floorPlanId)?.pricelistItems,
    selectedFloorplan,
    setSelectedFloorplan
  );
  const { columns: facadeColumns, facadeData } = FacadeColumns();
  const filterButtons = ['All', 'Standard', 'Upgrade'];
  const PAGE_SIZE = 10;

  const fetchFloorPlansData = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      const params: FloorPlanGetParams = {
        page,
        limit,
      };
      params.name = debouncedFilters?.name;
      params.dwelling_type_id = debouncedFilters?.dwellingType;
      params.location_id =
        debouncedFilters?.location !== '' ? debouncedFilters?.location : undefined;
      params.range_id = debouncedFilters?.label;
      params.status =
        debouncedFilters?.status !== 'all' ? debouncedFilters?.status === 'true' : undefined;
      await dispatch(fetchFloorPlans(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Floor Plans');
    }
  };

  useEffect(() => {
    fetchFloorPlansData();
  }, [currentPage, debouncedFilters]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const fetchPricelistItems = () => {
    try {
      floorPlans?.map(async i => await dispatch(fetchFloorPlanPricelist(i?.floorPlanId)).unwrap());
    } catch (error) {
      message.error(error || 'Failed to fetch pricelist items');
    }
  };

  useEffect(() => {
    fetchPricelistItems();
  }, [status.floorPlan.fetch]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Floor Plan Master</h1>
        <Space>
          <Button type="primary">
            Total Records
            <div className="rounded-full w-4 h-4 text-xs text-center bg-card-color text-primary">
              {floorPlans?.length}
            </div>
          </Button>
          <Button type="primary" onClick={() => setcreateFloorPlanOpen(true)}>
            New Floor Plan
          </Button>
        </Space>
      </div>
      <Table
        columns={floorPlanColumns}
        dataSource={floorPlans}
        onRow={record => ({
          onClick: () => {
            setcreateFloorPlanOpen(true);
            setSelectedFloorplan(record);
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
      {createFloorPlanOpen && (
        <FloorPlanFormModal
          title="Create FloorPlan"
          open={createFloorPlanOpen}
          onCancel={() => {
            setcreateFloorPlanOpen(false);
            setSelectedFloorplan(null);
          }}
          onSubmit={values => {
            handleFloorPlan(values);
            setcreateFloorPlanOpen(false);
            setSelectedFloorplan(null);
          }}
          isEditing={!!selectedFloorplan}
          initialValues={selectedFloorplan}
          loading={status?.floorPlan.create === Status.PENDING}
        />
      )}
      {drawerOpen === 'quotation' && (
        <TableDrawer
          open={drawerOpen === 'quotation'}
          width={1200}
          onClose={() => setDrawerOpen(null)}
          title={
            <div className="flex justify-between">
              <p>Quotation History</p>
              <Space>
                <Button type="primary">Total Records {data.length}</Button>
                <Button
                  type="primary"
                  onClick={() => QuotationHistory(data, 'Floorplan QuotationList')}
                  icon={<IconDownload size={20} />}
                />
              </Space>
            </div>
          }
          table={[{ columns: quotationColumns, data }]}
        />
      )}
      {drawerOpen === 'floorplan' && (
        <TableDrawer
          open={drawerOpen === 'floorplan'}
          width={800}
          onClose={() => {
            setDrawerOpen(null);
            setSelectedFloorplan(null);
          }}
          title="Pricelist Items"
          table={[
            {
              columns: floorplanPricelistColumn,
              data: showSelectedData
                ? floorPlans
                    ?.find(i => i?.floorPlanId === selectedFloorplan?.floorPlanId)
                    ?.pricelistItems?.map(i =>
                      priceListItems.find(c => c?.priceListItemId === i?.priceListItemId)
                    )
                : priceListItems,
            },
          ]}
        >
          <Space className="my-2">
            <Button
              type={showSelectedData ? 'default' : 'primary'}
              onClick={() => setShowSelectedData(false)}
            >
              Show All
            </Button>
            <Button
              type={showSelectedData ? 'primary' : 'default'}
              onClick={() => setShowSelectedData(true)}
            >
              Selected Items{' '}
              {floorPlans?.find(i => i?.floorPlanId === selectedFloorplan?.floorPlanId)
                ?.pricelistItems?.length | 0}
            </Button>
          </Space>
        </TableDrawer>
      )}
      {drawerOpen === 'facade' && (
        <TableDrawer
          open={drawerOpen === 'facade'}
          width={800}
          onClose={() => setDrawerOpen(null)}
          title="Facade"
          table={[{ columns: facadeColumns, data: facadeData }]}
        >
          <div className="flex justify-between my-2">
            <Space>
              <Button type="primary">Show All</Button>
              <Button>Selected Items {selectedFloorplan.facade?.length | 0}</Button>
            </Space>
            <div>
              {filterButtons.map(obj => (
                <Button
                  className="rounded-none"
                  type={`${activeFilter === obj ? 'primary' : 'default'}`}
                  onClick={() => setActiveFilter(obj)}
                >
                  {obj}
                </Button>
              ))}
            </div>
          </div>
        </TableDrawer>
      )}
    </div>
  );
};

export default FloorPlanMaster;
